const screenshot = require('screenshot-desktop');

const dgram = require('dgram');
const server = dgram.createSocket('udp4');

const LOCAL_HOST = '127.0.0.1';
const LOCAL_PORT = 57956;
const FPS = 24;

let currentFrameNumber = 0;

function sendMjpegFrames(buffer, frameNum) {
    const packetSize = 1300;

    let payloadLeft = buffer.length;
    let packetNum = 0;

    while (payloadLeft > 0) {

        let fragment = Buffer.alloc(7 + packetSize);
        let payloadSize = payloadLeft > packetSize ? packetSize : payloadLeft;
        let isLastPacket = false;
        if (payloadLeft == packetSize || payloadLeft < packetSize) {
            isLastPacket = true;
        }
        payloadLeft -= payloadSize;

        // Размер полезной нагрузки - 2 байта
        fragment.writeUInt16BE(payloadSize, 0);
        // Номер кадра - 2 байта
        fragment.writeUInt16BE(frameNum, 2);
        // Номер пакета кадра - 2 байта
        fragment.writeUInt16BE(packetNum, 4);
        // Флаг последнего пакета кадра - 1 байт
        if (isLastPacket) {
            fragment.writeInt8(1, 6);
        } else {
            fragment.writeInt8(0, 6);
        }
        let startOffset = packetNum * packetSize;
        let endOffset = (packetNum * packetSize) + payloadSize;
        buffer.copy(fragment, 7, startOffset, endOffset);
        server.send(fragment, LOCAL_PORT, LOCAL_HOST, (err) => {
            if (err)
                console.log(err);
        });
        packetNum++;
    }
    console.log(frameNum);
}

async function captureScreen() {
    screenshot({ format: 'jpg' }).then((img) => {
        try {
            sendMjpegFrames(img, currentFrameNumber);
            currentFrame++;
        } catch (error) {
            console.error(`Ошибка отправки пакета: ${error}`);
        }
    }).catch((err) => {
        console.error(err);
    });
}

setInterval(captureScreen, 1000 / FPS);