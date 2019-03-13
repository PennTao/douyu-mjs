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
        const bufferHeader = Buffer.alloc(HEADER_LENGTH + FRAME_LENGTH);
        const bufferMessage = Buffer.from(message, 'utf8');
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
     * @param   {Buffer}    buffer          [buffer to be decoded]
     * @param   {Buffer}    previousBuffer  []
     * @return  {string}                    [decoded string from buffer]
     */
    decode(buffer, previousBuffer) { // an incoming buffer might contain multiple messages or less than one  message, need to handle accordingly
        //  buffer index position
        let position = 0;
        //  current message size
        let messageSize = 0;
        //  remaining unprocessed buffer from last processing plus the incoming buffer
        let fullBuffer = Buffer.alloc(0);
        //  decoded messages 
        const decodedMessages = [];
        //  remaining unprocessed buffer to be returned for next processing
        let remainingBuffer = Buffer.alloc(0);
        //  total message header size
        const totalHeaderSize = HEADER_SIZE * 2 + HEADER_TYPECODE + HEADER_ENCRYPT + HEADER_ENCRYPT;

        if (previousBuffer === null || previousBuffer.length === 0) {
            fullBuffer = buffer;
        } else {
            fullBuffer = Buffer.concat([previousBuffer, buffer]);
        }


        //  Get the size of the first message in the buffer
        messageSize = fullBuffer.readInt32LE(position);
        //  Size of the first message is greater than the buffer size, so the buffer does not contain the full message
        //  return the buffer for next processing
        if (fullBuffer.length < messageSize ) {
            remainingBuffer = fullBuffer;
        } else {
            while(position < fullBuffer.length) {
                //  Decode the message and push to the return array
                const decodedMessage = fullBuffer.toString('utf-8', position + totalHeaderSize, messageSize + 2);
                decodedMessages.push(decodedMessage);
    
                position += messageSize + 4;
 
                //  New position reaches or goes pass the end of the full buffer, break
                if(position >= fullBuffer.length) {
                    break;
                }
                //  Get the size of the next message in the buffer
                messageSize = fullBuffer.readInt32LE(position);
            }
            //  The buffer does not contain full last message, assign the portion of the last message to remainingBuffer for next processing
            if (position > fullBuffer.length) {
                remainingBuffer = fullBuffer.slice(position - messageSize - 4);
            }             
        }
        return {
            decodedMessages,
            remainingBuffer,
        }
    }

    /**
     * [connectToRoom: send a message to Douyu danmaku server to join a room]
     */
    connectToRoom() {
        // const message = `type@=loginreq/roomid@=${this.roomId}/\0`;
        const message = `type@=loginreq/username@=tao.lei/password@=douyu/roomid@=${this.roomId}/\0`;
        this.socket.write(this.encode(message));
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
     * [processBuffer: decode and deserialize the message received from Douyu danmaku server]
     * @param   {buffer}    buffer              message received from Douyu danmaku server
     * @param   {buffer}    previousBuffer      the previously received message's unhandled part
     * @return  {Object}                        Array of JSON of the decoded and deserialized message and remaining message string to be processed next time
     */
    processBuffer(buffer, previousBuffer) {
        if (buffer === null) {

        }
        //  Decode the buffer to get string message
        const { decodedMessages, remainingBuffer } = this.decode(buffer, previousBuffer);
        //  Deserialized message
        const records = decodedMessages.map( decodedMessage => this.deserialize(decodedMessage));

        return {
            records,
            remainder: remainingBuffer
        }
    }

    deserialize(message) {
        if (message === null) {
            //TODO: throw message
            return null;
        }
        if (message.length <= 0) {
            //TODO: throw error
            return null;
        }

        const rawRecords = message.split('/');
        if(rawRecords.length <= 1) {
            //TODO: throw error
            return null;
        }

        // const recordType = data.shift();
        const deserializeRecord = { };

        rawRecords.forEach( keyValuePair => {
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
