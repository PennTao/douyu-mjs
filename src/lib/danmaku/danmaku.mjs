import net from 'net';
import EventEmitter from 'events';

const HEADER_LENGTH = 8;
const FRAME_LENGTH = 4;
const HEADER_SIZE = 4;
const HEADER_TYPECODE = 2;
const HEADER_ENCRYPT = 1;
const HEADER_RESERVED = 1;

const regex = 'txt@=(.+?)/cid@';
class DanmakuClient extends EventEmitter{
    constructor(options) {
        super();
        this.url = options.url;
        this.port = options.port;
        this.roomId = options.roomId;;
        this.socket = new net.Socket();
        this.socket.on('ready', () => {
            this.emit('connected');
        });
        this.socket.on('data', (data) => {
            this.emit('data', data);
        });

        this.socket.on('close', () => {
            this.emit('closed');
        })
    }
    /**
     * [start: connect to Douyu danmaku server]
     */
    start() {
        this.socket.connect(this.port, this.url);
    }

    /**
     * [encode: encode the message sent to Douyu danmaku server]
     * Message format, please refer to 斗鱼弹幕服务器第三方接入协议v1.6.2.pdf for more details
     * Message length, 4 byte little endian integer
     * Message length, 4 byte little endian integer(repeat)
     * Message type, 2 byte little endian integer
     *  689: client sending message to server
     *  690 server sending message to client
     * Encrypt, 1 byte little endian integer, unused, default to 0
     * Reserved, 1 byte little endian integer, unused, default to 0
     * Body, must end with '\0'
     * @param   {string}    message     [message to be encoded]
     * @return  {Buffer}                [encoded buffer]                    
     */
    encode(message) {
        const code = 689;
        const bufferHeader = new Buffer(HEADER_LENGTH + FRAME_LENGTH);
        const bufferMessage = new Buffer(message, 'utf8');
        const totalBufferLength = message.length + HEADER_LENGTH + FRAME_LENGTH;
        bufferHeader.writeInt32LE(totalBufferLength - FRAME_LENGTH, 0);
        bufferHeader.writeInt32LE(totalBufferLength - FRAME_LENGTH, 4);
        bufferHeader.writeInt16LE(code, 8);
        bufferHeader.writeInt16LE(0,10);
        return Buffer.concat([bufferHeader, bufferMessage], totalBufferLength);
        // this.socket.write(Buffer.concat([bufferHead, bufferMessage], totalBufferLength));        
    }

    /**
     * [decode: decode the message received from Douyu danmaku server]
     * @param   {Buffer}    buffer      [buffer to be decoded]
     * @return  {string}                [decoded string from buffer]
     */
    decode(buffer) {
        // console.log(buffer.toString('utf8'));
        // console.log("Message Length: " + buffer.readInt32LE(0));
        // console.log("Message Length: " + buffer.readInt32LE(HEADER_SIZE));
        // console.log("Coed: " + buffer.readInt16LE(HEADER_SIZE + HEADER_SIZE))
        // console.log("buffer size: " + buffer.byteLength)
        // console.log("str: " + buffer.toString('utf-8', 12, buffer.readInt32LE(0) + 4 ))
        // console.log("str size: " + buffer.toString('utf-8', 12, buffer.readInt32LE(0) + 4 ).length)
        // if(buffer.readInt32LE(0) < buffer.byteLength){
        //     console.log('second msg');
        //     console.log(buffer.readInt32LE(0) + HEADER_SIZE);
        //     console.log("Message Length: " + buffer.readInt32LE(buffer.readInt32LE(0) + HEADER_SIZE))
        //     console.log("Message Length: " + buffer.readInt32LE(buffer.readInt32LE(0) + HEADER_SIZE * 2))
        // }
        return buffer.toString('utf8', HEADER_LENGTH + FRAME_LENGTH);
    }

    processBuffer(buffer, previousBuffer) {
        let position = 0;
        let messageSize = 0;
        let fullBuffer;
        const bufferRecords = [];
        const totalHeaderSize = HEADER_SIZE * 2 + HEADER_TYPECODE + HEADER_ENCRYPT + HEADER_ENCRYPT;
        if (previousBuffer !== null || previousBuffer.length === 0) {
            fullBuffer = Buffer.concat([previousBuffer, buffer]);
        } else {
            fullBuffer = buffer;
        }
        console.log(fullBuffer.toString('utf8'))
        console.log(previousBuffer.length)
        messageSize = fullBuffer.readInt32LE(position);
        console.log(messageSize);
        console.log(fullBuffer.length)
        if (fullBuffer.length < messageSize ) {
            return {
                bufferRecords,
                remainingBuffer: fullBuffer,
            }
        }
        while(position < fullBuffer.length) {
            const bufferRecord = fullBuffer.toString('utf-8', position + totalHeaderSize, messageSize );
            console.log(bufferRecord)
            position += messageSize + 4;
            console.log("new pos: " + position)
            console.log("full len: " + fullBuffer.length);
            if(position >= fullBuffer.length) {
                console.log('break')
                break;
            }
            messageSize = fullBuffer.readInt32LE(position);
            console.log(messageSize)

            bufferRecords.push(bufferRecord);

        }
        return {
            bufferRecords
        }
    }
    /**
     * [joinGroup: send a message to Douyu danmaku server to join a danmaku group]
     * @param   {string}    gourpId      [group id of the danmaku group, select -9999 to join unlimited danmaku group] 
     */
    joinGroup(gourpId) {
        const message = `type@=joingroup/rid@=${this.roomId}/gid@=${gourpId}/\0`;
        this.socket.write(this.encode(message));
    }

    /**
     * [connectToRoom: send a message to Douyu danmaku server to join a room]
     */
    connectToRoom() {
        const message = `type@=loginreq/username@=tao.lei/password@=douyu/roomid@=${this.roomId}/\0`;
        this.socket.write(this.encode(message));
    }

    /**
     * [keepAlive: periodically send a heartbeat message to Douyu danmaku server to maintain the socket connection]
     * Douyu danmaku server requires a heartbeat signal to be sent every 45s
     * @param   {integer}   interval        period of the  heartbeat signal in ms
     */
    keepAlive(interval) {
        // const message = `type@=keeplive/tick@${Math.floor(Date.now()/1000)}`;    //old heartbeat message
        const message = `type@=mrkl/`                                               //new heartbeat message
        setInterval( () => {
            this.socket.write(this.encode(message));
        }, interval);
    }

    /**
     * [handleMessage: decode and deserialize the message received from Douyu danmaku server]
     * @param   {buffer}    rawMessage          message received from Douyu danmaku server
     * @param   {string}    previousRemainder   the previously received message's unhandled part
     * @return  {Object}                        Array of JSON of the decoded and deserialized message and remaining message string to be processed next time
     */
    handleMessage(rawMessage, previousRemainder) {
        console.log(this.processBuffer(rawMessage, previousRemainder));
        const deserializeRecords = [];
        if (rawMessage === null) {
            return {
                deserializeRecords,
                remainder: previousRemainder
            }
        }

        // Decode the buffer message to string
        const decodedMessage = this.decode(rawMessage);

        const fullMessage = previousRemainder + decodedMessage;
        const splitPosition = fullMessage.lastIndexOf('type@=');


        if (fullMessage.indexOf('type@=') === splitPosition) {
            return {
                deserializeRecords,
                remainder: fullMessage
            }
        }
        const processingMessage = fullMessage.substring(0, splitPosition);

        const remainder = fullMessage.substring(splitPosition);
        // console.log('============full================')
        // console.log(processingMessage);
        // console.log('============rema================')
        // console.log(remainder)
        // console.log('============end================')
        const rawRecords = processingMessage.split('type@=');

        rawRecords.forEach(rawRecord => {
            const deserializeRecord = this.deserialize(rawRecord);
            if (deserializeRecord) {
                deserializeRecords.push(this.deserialize(rawRecord)) ;
            }
        })
        return {
            deserializeRecords,
            remainder,
        }
    }

    deserialize(rawRecord) {
        if (rawRecord.length <= 0) {
            //TODO: throw error
            return null;
        }

        const data = rawRecord.split('/');

        if(data.length <= 1) {
            //TODO: throw error
            return null;
        }

        if(data[0].lastIndexOf('@=') != -1) {
            //TODO: throw error
            return null;            
        }

        const recordType = data.shift();
        const deserializeRecord = {
            recordType,
        }

        data.forEach( keyValuePair => {
            const keyValueArray = keyValuePair.split('@=');
            const key = keyValueArray[0];
            const value = keyValueArray[1];
            deserializeRecord[key] = value
        });

        return deserializeRecord;
    }
}

export { DanmakuClient };
export default DanmakuClient;









// import net from 'net';
// import EventEmitter from 'events';

// const HEADER_LENGTH = 8;
// const FRAME_LENGTH = 4;
// const HEADER_SIZE = 4;
// const HEADER_TYPECODE = 2;
// const HEADER_ENCRYPT = 1;
// const HEADER_RESERVED = 1;

// const regex = 'txt@=(.+?)/cid@';
// class DanmakuClient extends EventEmitter{
//     constructor(options) {
//         super();
//         this.url = options.url;
//         this.port = options.port;
//         this.roomId = options.roomId;;
//         this.socket = new net.Socket();
//         this.socket.on('ready', () => {
//             this.emit('connected');
//         });
//         this.socket.on('data', (data) => {
//             this.emit('data', data);
//         });

//         this.socket.on('close', () => {
//             this.emit('closed');
//         })
//     }
//     /**
//      * [start: connect to Douyu danmaku server]
//      */
//     start() {
//         this.socket.connect(this.port, this.url);
//     }

//     /**
//      * [encode: encode the message sent to Douyu danmaku server]
//      * Message format, please refer to 斗鱼弹幕服务器第三方接入协议v1.6.2.pdf for more details
//      * Message length, 4 byte little endian integer
//      * Message length, 4 byte little endian integer(repeat)
//      * Message type, 2 byte little endian integer
//      *  689: client sending message to server
//      *  690 server sending message to client
//      * Encrypt, 1 byte little endian integer, unused, default to 0
//      * Reserved, 1 byte little endian integer, unused, default to 0
//      * Body, must end with '\0'
//      * @param   {string}    message     [message to be encoded]
//      * @return  {Buffer}                [encoded buffer]                    
//      */
//     encode(message) {
//         const code = 689;
//         const bufferHeader = new Buffer(HEADER_LENGTH + FRAME_LENGTH);
//         const bufferMessage = new Buffer(message, 'utf8');
//         const totalBufferLength = message.length + HEADER_LENGTH + FRAME_LENGTH;
//         bufferHeader.writeInt32LE(totalBufferLength - FRAME_LENGTH, 0);
//         bufferHeader.writeInt32LE(totalBufferLength - FRAME_LENGTH, 4);
//         bufferHeader.writeInt16LE(code, 8);
//         bufferHeader.writeInt16LE(0,10);
//         return Buffer.concat([bufferHeader, bufferMessage], totalBufferLength);
//         // this.socket.write(Buffer.concat([bufferHead, bufferMessage], totalBufferLength));        
//     }

//     /**
//      * [decode: decode the message received from Douyu danmaku server]
//      * @param   {Buffer}    buffer      [buffer to be decoded]
//      * @return  {string}                [decoded string from buffer]
//      */
//     decode(buffer) {
//         let pos = 0;
//         let messageSize = 0;
//         const totalHeaderSize = HEADER_SIZE * 2 + HEADER_TYPECODE + HEADER_ENCRYPT + HEADER_RESERVED;
//         const decodedMessages = []

//         do {
//             messageSize = buffer.readInt32LE(pos);
//             console.log('====msg size=====')
//             console.log(messageSize)
//             console.log(buffer.readInt32LE(pos + HEADER_SIZE))

//             const decodedMessage = buffer.toString('utf8', pos + totalHeaderSize + 1, pos + totalHeaderSize + messageSize);
//             pos += (totalHeaderSize + messageSize);
//             decodedMessages.push(decodedMessage);
            
//         } while (pos < buffer.byteLength);

//         let remainingBuffer = Buffer.alloc(1);

//         if (pos !== buffer.byteLength - 1) {
//             remainingBuffer = buffer.slice(pos - totalHeaderSize - messageSize)
//         }
//         console.log('====decode=====')
//         console.log({
//             decodedMessages,
//             remainingBuffer,
//         })
//         return {
//             decodedMessages,
//             remainingBuffer,
//         }
//     }
//     /**
//      * [joinGroup: send a message to Douyu danmaku server to join a danmaku group]
//      * @param   {string}    gourpId      [group id of the danmaku group, select -9999 to join unlimited danmaku group] 
//      */
//     joinGroup(gourpId) {
//         const message = `type@=joingroup/rid@=${this.roomId}/gid@=${gourpId}/\0`;
//         this.socket.write(this.encode(message));
//     }

//     /**
//      * [connectToRoom: send a message to Douyu danmaku server to join a room]
//      */
//     connectToRoom() {
//         const message = `type@=loginreq/username@=tao.lei/password@=douyu/roomid@=${this.roomId}/\0`;
//         this.socket.write(this.encode(message));
//     }

//     /**
//      * [keepAlive: periodically send a heartbeat message to Douyu danmaku server to maintain the socket connection]
//      * Douyu danmaku server requires a heartbeat signal to be sent every 45s
//      * @param   {integer}   interval        period of the  heartbeat signal in ms
//      */
//     keepAlive(interval) {
//         // const message = `type@=keeplive/tick@${Math.floor(Date.now()/1000)}`;    //old heartbeat message
//         const message = `type@=mrkl/`                                               //new heartbeat message
//         setInterval( () => {
//             this.socket.write(this.encode(message));
//         }, interval);
//     }

//     /**
//      * [handleMessage: decode and deserialize the message received from Douyu danmaku server]
//      * @param   {buffer}    bufferMessage          message received from Douyu danmaku server
//      * @param   {string}    remainingBuffer   the previously received message's unhandled part
//      * @return  {Object}                        Array of JSON of the decoded and deserialized message and remaining message string to be processed next time
//      */
//     handleMessage(bufferMessage, previousRemainingBuffer) {
//         let deserializeRecords = [];
//         if (bufferMessage === null) {
//             return {
//                 deserializeRecords,
//                 remainder: previousRemainingBuffer
//             }
//         }

//         // Decode the buffer message to string
//         let fullBufferMessage;
//         if (previousRemainingBuffer.length > 0) {
//             fullBufferMessage = Buffer.concat([previousRemainingBuffer, bufferMessage]);
//         } else {
//             fullBufferMessage = bufferMessage
//         }
//         const { decodedMessages, remainingBuffer } = this.decode(fullBufferMessage);

//         deserializeRecords = decodedMessages.map( decodedMessage => this.deserialize(decodedMessage));
//         console.log({remainingBuffer})
//         return {
//             deserializeRecords,
//             remainder: remainingBuffer,
//         }
//     }

//     deserialize(rawRecord) {
//         if (rawRecord.length <= 0) {
//             //TODO: throw error
//             return null;
//         }

//         const data = rawRecord.split('/');

//         if(data.length <= 1) {
//             //TODO: throw error
//             return null;
//         }
//         const deserializeRecord = {};

//         data.forEach( keyValuePair => {
//             const keyValueArray = keyValuePair.split('@=');
//             const key = keyValueArray[0];
//             const value = keyValueArray[1];
//             deserializeRecord[key] = value
//         });

//         return deserializeRecord;
//     }
// }

// export { DanmakuClient };
// export default DanmakuClient;