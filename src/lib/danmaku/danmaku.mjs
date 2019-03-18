import net from 'net';
import EventEmitter from 'events';
import { encode, decode, decodeHeader } from '../../utils/utils';

const regex = /[^/]+@=[^/]+/g;
const regexArraySplitter = /[^/]+(?:[^/]*)*/g;

class DanmakuClient extends EventEmitter {
  constructor(options) {
    super();
    this.url = options.url;
    this.port = options.port;
    this.roomId = options.roomId;
    this.socket = new net.Socket();
    this.socket.on('ready', () => {
      this.emit('connected');
    });
    this.socket.on('data', (data) => {
      this.emit('data', data);
    });

    this.socket.on('close', () => {
      this.emit('closed');
    });

    this.socket.on('error', (err) => {
      this.emit('error', err);
    });
  }

  /**
     * [start: connect to Douyu danmaku server]
     */
  start() {
    this.socket.connect(this.port, this.url);
  }

  /**
     * [processBuffer: decode and deserialize the message received from Douyu danmaku server]
     * @param   {buffer}    buffer              message received from Douyu danmaku server
     * @param   {buffer}    previousBuffer      the previously received message's unhandled part
     * @return  {Object}                        Array of JSON of the decoded and deserialized message and remaining message string to be processed next time
     */
  processBuffer(incomingBuffer, previousBuffer) {
    const decodedMessages = [];
    let buffer = incomingBuffer;
    if (previousBuffer !== null && previousBuffer !== undefined) {
      buffer = Buffer.concat([previousBuffer, buffer]);
    }
    // let curBuffer = Buffer.alloc(0);
    let remainingBuffer = Buffer.alloc(0);
    let curBuffer = Buffer.alloc(0);
    let header;

    let { messageSize1, messageSize2, typeCode } = decodeHeader(buffer);

    if ((messageSize1 !== messageSize2) || typeCode !== 690) {
      console.log('message corrupted');
      return {
        decodedMessages,
        remainingBuffer,
      };
    }
    // console.log('buffer length: ' + buffer.length);
    // console.log('message size: ' + messageSize1);
    while (buffer.length >= messageSize1 + 4) {
      curBuffer = buffer.slice(0, messageSize1 + 4);
      buffer = buffer.slice(messageSize1 + 4);
      const { message } = decode(curBuffer);
      decodedMessages.push(message);
      // console.log(message)
      if (buffer.length >= 12) {
        header = decodeHeader(buffer);
        ({ messageSize1, messageSize2, typeCode } = header);
        // messageSize1 = header.messageSize1;
        // messageSize2 = header.messageSize2;
        // typeCode = header.typeCode;
        // console.log('buffer length: ' + buffer.length);
        // console.log('message size: ' + messageSize1);
        if ((messageSize1 !== messageSize2) || typeCode !== 690) {
          console.log('message corrupted');
          return {
            decodedMessages,
            remainingBuffer,
          };
        }
      } else {
        break;
      }
    }
    remainingBuffer = buffer;

    const records = decodedMessages.map(decodedMessage => this.deserialize(decodedMessage));
    return {
      records,
      remainingBuffer,
    };
  }

  /**
     * [connectToRoom: send a message to Douyu danmaku server to join a room]
     */
  connectToRoom() {
    // const message = `type@=loginreq/roomid@=${this.roomId}/\0`;
    const message = `type@=loginreq/username@=tao.lei/password@=douyu/roomid@=${this.roomId}/\0`;
    this.socket.write(encode(message));
  }

  /**
     * [joinGroup: send a message to Douyu danmaku server to join a danmaku group]
     * @param   {string}    gourpId      [group id of the danmaku group, select -9999 to join unlimited danmaku group]
     */
  joinGroup(gourpId) {
    const message = `type@=joingroup/rid@=${this.roomId}/gid@=${gourpId}/\0`;
    this.socket.write(encode(message));
  }

  /**
     * [keepAlive: periodically send a heartbeat message to Douyu danmaku server to maintain the socket connection]
     * Douyu danmaku server requires a heartbeat signal to be sent every 45s
     * @param   {integer}   interval        period of the  heartbeat signal in ms
     */
  keepAlive(interval) {
    // const message = `type@=keeplive/tick@${Math.floor(Date.now()/1000)}`;    //old heartbeat message
    const message = 'type@=mrkl/'; // new heartbeat message
    setInterval(() => {
      this.socket.write(encode(message));
    }, interval);
  }

  deserialize(message) {
    if (message === null) {
      return null;
    }
    const record = {};
    const items = message.match(regex);
    if (items === null) {
      return message;
    }
    items.forEach((item) => {
      const kvps = item.split('@=');
      const key = kvps[0];
      const value = kvps[1];
      const escapeSlashvalues = value.replace(/@S/g, '/').match(regexArraySplitter);
      const deserializeValues = escapeSlashvalues.map(escapeSlashvalue => this.deserialize(escapeSlashvalue.replace(/@A/g, '@').replace(/@S/g, '/').replace(/@A/g, '@')));
      // console.log(escapeSlashvalues)
      if (deserializeValues.length > 1) {
        record[key] = deserializeValues;
      } else {
        [record[key]] = deserializeValues;
      }
    });
    return record;
  }
}

export { DanmakuClient };
export default DanmakuClient;
