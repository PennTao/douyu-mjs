import { DanmakuClient } from '../src/lib/danmaku/danmaku.mjs'

const danmakuClient = new DanmakuClient({
    url: 'openbarrage.douyutv.com',
    port: '8601',
    // roomId: '5369328',
    roomId: '99999',
});

try {
    danmakuClient.start();
    let previousRemainder = Buffer.alloc(0);

    danmakuClient.on('connected', () => {
        console.log('ready');
        danmakuClient.connectToRoom();
        danmakuClient.joinGroup("-9999");
        danmakuClient.keepAlive(45000);
    });

    danmakuClient.on('data', data => {
        console.log('data received');

        const {records, remainingBuffer} = danmakuClient.processBuffer(data, previousRemainder);
        previousRemainder = remainingBuffer;
        records.forEach( record => {
            console.log(record.type);
        });
        if(records.length === 0) {
            console.log('====next====')
        }
    });

    danmakuClient.on('closed', () => {
        console.log('connection closed');
        console.log('reconnect');
        danmakuClient.start();
    });

    danmakuClient.on('error', (err) => {
        console.log(err)
    })
} catch (ex) {
    console.log(ex);
}
