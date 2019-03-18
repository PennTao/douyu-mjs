import bunyan from 'bunyan';
import { DanmakuClient } from '../src/lib/danmaku/danmaku';

const logger = bunyan.createLogger({ name: 'fetch-damaku-example' });
const danmakuClient = new DanmakuClient({
  url: 'openbarrage.douyutv.com',
  port: '8601',
  // roomId: '5369328',
  roomId: '312212',
});

try {
  danmakuClient.start();
  let previousRemainder = Buffer.alloc(0);

  danmakuClient.on('connected', () => {
    logger.info('ready');
    danmakuClient.connectToRoom();
    danmakuClient.joinGroup('-9999');
    danmakuClient.keepAlive(45000);
  });

  danmakuClient.on('data', (data) => {
    logger.info('data received from Douyu danmaku server');

    const { records, remainingBuffer } = danmakuClient.processBuffer(data, previousRemainder);
    previousRemainder = remainingBuffer;
    records.forEach((record) => {
      if (record.type !== 'chatmsg') {
        logger.info(record, 'Message parsed');
      }
    });
  });

  danmakuClient.on('closed', () => {
    logger.info('connection closed');
    logger.info('reconnect');
    danmakuClient.start();
  });

  danmakuClient.on('error', (err) => {
    logger.error(err);
  });
} catch (ex) {
  logger.error(ex);
}
