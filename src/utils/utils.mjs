const HEADER_LENGTH_SIZE = 4;
const HEADER_LENGTH_TYPECODE = 2;
const HEADER_LENGTH_ENCRYPT = 1;
const HEADER_LENGTH_RESERVED = 1;
const HEADER_LENGTH_TOTAL = HEADER_LENGTH_SIZE * 2 + HEADER_LENGTH_TYPECODE + HEADER_LENGTH_ENCRYPT + HEADER_LENGTH_RESERVED;

/**
   * [encode: encode the message sent to Douyu danmaku server]
   * Message format, please refer to 斗鱼弹幕服务器第三方接入协议v1.6.2.pdf for more details
   * Message length, 4 byte little endian integer
   * Message length, 4 byte little endian integer(repeat)
   * Message type, 2 byte little endian integer
   *  689: client sending message to server
   *  690: server sending message to client
   * Encrypt, 1 byte little endian integer, unused, default to 0
   * Reserved, 1 byte little endian integer, unused, default to 0
   * Body, must end with '\0'
   * @param   {string}    message     [message to be encoded]
   * @return  {Buffer}                [encoded buffer]
   */
const encode = (message) => {
  const code = 689;
  const bufferHeader = Buffer.alloc(HEADER_LENGTH_TOTAL);
  const bufferMessage = Buffer.from(message, 'utf8');
  const totalBufferLength = message.length + HEADER_LENGTH_TOTAL;
  bufferHeader.writeInt32LE(totalBufferLength - HEADER_LENGTH_SIZE, 0);
  bufferHeader.writeInt32LE(totalBufferLength - HEADER_LENGTH_SIZE, 4);
  bufferHeader.writeInt16LE(code, 8);
  bufferHeader.writeInt16LE(0, 10);
  return Buffer.concat([bufferHeader, bufferMessage], totalBufferLength);
};

/**
   * [decodeHeader: decode the header of the message received from Douyu danmaku server]
   * @param   {Buffer}    buffer          [buffer to be decoded]
   * @return  {Object}                    [decoded string from buffer]
   */
const decodeHeader = (buffer) => {
  const messageSize1 = buffer.readInt32LE(0);
  const messageSize2 = buffer.readInt32LE(HEADER_LENGTH_SIZE);
  const typeCode = buffer.readInt16LE(HEADER_LENGTH_SIZE * 2);
  const encrypt = buffer.readInt8(HEADER_LENGTH_SIZE * 2 + HEADER_LENGTH_TYPECODE);
  const reserved = buffer.readInt8(HEADER_LENGTH_SIZE * 2 + HEADER_LENGTH_TYPECODE + HEADER_LENGTH_ENCRYPT);
  return {
    messageSize1,
    messageSize2,
    typeCode,
    encrypt,
    reserved,
  };
};

/**
   * [decode: decode the message received from Douyu danmaku server]
   * @param   {Buffer}    buffer          [buffer to be decoded]
   * @return  {Object}                    [decoded header object from buffer]
   */
const decode = (buffer) => {
  const {
    messageSize1, messageSize2, typeCode, encrypt, reserved,
  } = decodeHeader(buffer);
  const message = buffer.toString('utf-8', HEADER_LENGTH_TOTAL);
  return {
    messageSize1,
    messageSize2,
    typeCode,
    encrypt,
    reserved,
    message,
  };
};


export { encode, decode, decodeHeader };
