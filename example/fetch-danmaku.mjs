import { DanmakuClient } from '../../../src/lib/danmaku/danmaku.mjs'

const danmakuClient = new DanmakuClient({
    url: 'openbarrage.douyutv.com',
    port: '8601',
});

try {
    danmakuClient.start();
} catch (ex) {
    console.log(ex);
}
