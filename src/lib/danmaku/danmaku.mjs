import net from 'net';

const HEADER_LENGTH = 8;
const FRAME_LENGTH = 4;
const regex = 'txt@=(.+?)/cid@';
class DanmakuClient {
    constructor(options) {
        this.url = options.url;
        this.port = options.port;
        this.roomId = options.roomId;
        this.roomId = '1126960';
        this.socket = new net.Socket();

    }

    async start() {
        await this.socket.connect(this.port, this.url);


        this.socket.on('connect', () => {
            console.log('connected');
            this.connectToRoom();
            console.log('connected to room');
            this.joinGroup();
            console.log('joined group -9999');
        });

        this.socket.on('data', (data) => {
            console.log('received data')
            const danmaku = data.toString('utf8', HEADER_LENGTH + FRAME_LENGTH).match(regex);
            if (danmaku) {
                console.log('======danmaku======')
                console.log(danmaku[1]);
            }
            
        });
        this.socket.on('error', (err) => {
            console.log(err)
        })
    }

    joinGroup() {
        const message = `type@=joingroup/rid@=${this.roomId}/gid@=-9999/\0`;
        const buffer = this.encodeMessage(message);
        this.socket.write(buffer);
    }

    connectToRoom() {
        const message = `type@=loginreq/username@=taolei/password@=douyu/roomid@=${this.roomId}/\0`;
        const buffer = this.encodeMessage(message);
        this.socket.write(buffer);
    }

    encodeMessage(message) {
        const messageLen = message.length;
        const code = 689;
        const bufferHead = new Buffer(HEADER_LENGTH + FRAME_LENGTH);
        const bufferMessage = new Buffer(message, 'utf8');
        const totalBufferLength = message.length + HEADER_LENGTH + FRAME_LENGTH;
        bufferHead.writeInt32LE(totalBufferLength - FRAME_LENGTH, 0);
        bufferHead.writeInt32LE(totalBufferLength - FRAME_LENGTH, 4);
        bufferHead.writeInt16LE(code, 8);
        bufferHead.writeInt16LE(0,10);
        return  Buffer.concat([bufferHead, bufferMessage], totalBufferLength);
    }


}

export { DanmakuClient };
export default DanmakuClient;