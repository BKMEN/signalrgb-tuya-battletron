import udp from '@SignalRGB/udp';
import DeviceList from './Data/DeviceList.test.js';
import crc32 from './Libs/CRC32.test.js';
import { AES } from './Crypto/AES.test.js';
import { GCM } from './Crypto/mode/GCM.test.js';
import { Hex } from './Crypto/Hex.test.js';
import { Base64 } from './Crypto/Base64.test.js';
import TuyaEncryptor from './Libs/TuyaEncryptor.test.js';

export default class TuyaDevice extends TuyaEncryptor {
    constructor(deviceData, crc) {
        super();

        this.id             = deviceData.gwId;
        this.enabled        = deviceData.hasOwnProperty('enabled') ? deviceData.enabled : false;
        this.deviceType     = deviceData.hasOwnProperty('deviceType') ? deviceData.deviceType : 0;
        this.localKey       = deviceData.hasOwnProperty('localKey') ? deviceData.localKey : null;
        this.ledCount       = deviceData.hasOwnProperty('ledCount') ? deviceData.ledCount : 4;  // ✅ Valor por defecto añadido

        this.name           = this.getName();
        this.ip             = deviceData.ip;
        this.uuid           = deviceData.uuid;
        this.gwId           = deviceData.gwId;
        this.version        = deviceData.version;
        this.productKey     = deviceData.productKey;

        this.token          = this.getToken(deviceData, 'token');
        this.rnd            = this.getToken(deviceData, 'rnd');
        this.crc            = deviceData.hasOwnProperty('crc') ? deviceData.crc : this.calculateCrc(crc);
        this.negotiationKey = deviceData.hasOwnProperty('negotiationKey') ? deviceData.negotiationKey : null;
        this.sessionKey     = deviceData.hasOwnProperty('sessionKey') ? deviceData.sessionKey : null;
        this.initialized    = deviceData.hasOwnProperty('initialized') ? deviceData.initialized : false;
        this.negotiatorCrc  = deviceData.hasOwnProperty('negotiatorCrc') ? deviceData.negotiatorCrc : crc;

        if (!this.broadcastIp) this.setBroadcastIp(this.ip);
        this.socket = null;
    }

    getName() {
        if (this.deviceType !== 0) {
            return `${DeviceList[this.deviceType].name} - ${this.id}`;
        }
        return `Tuya device ${this.id}`;
    }

    getToken(deviceData, name) {
        if (deviceData.hasOwnProperty(name)) {
            if (deviceData[name].length == 32) {
                return deviceData[name];
            }
        }
        return this.randomHexBytes(16);
    }

    validateDeviceUpdate(enabled, deviceType, localKey, ledCount = null) {
        let shouldSave = false;
        if (this.enabled !== enabled) shouldSave = true;
        if (this.deviceType !== deviceType) shouldSave = true;
        if (this.localKey !== localKey) shouldSave = true;
        if (ledCount !== null && ledCount !== this.ledCount) shouldSave = true;

        return shouldSave;
    }

    updateDevice(enabled, deviceType, localKey, ledCount = null) {
        if (this.validateDeviceUpdate(enabled, deviceType, localKey, ledCount)) {
            this.enabled = enabled;
            this.deviceType = deviceType;
            this.localKey = localKey;
            if (ledCount !== null) {
                this.ledCount = ledCount;
                service.log(`Nuevo ledCount para ${this.id}: ${ledCount}`); // ✅ LOG añadido
            }
            this.saveToCache();
        }
    }

    toJson() {
        return {
            id: this.id,
            name: this.name,
            enabled: this.enabled,
            ip: this.ip,
            uuid: this.uuid,
            gwId: this.gwId,
            version: this.version,
            productKey: this.productKey,
            deviceType: this.deviceType,
            localKey: this.localKey,
            token: this.token,
            rnd: this.rnd,
            crc: this.crc,
            negotiationKey: this.negotiationKey,
            sessionKey: this.sessionKey,
            ledCount: this.ledCount
        };
    }

    saveToCache() {
        service.log('Saving to cache');
        service.saveSetting(this.id, 'data', JSON.stringify(this.toJson()));
    }

    calculateCrc(crc) {
        let hexString = this.zeroPad(this.hexFromString(this.id), 50, true);
        let deviceCrcW32 = Hex.parse(hexString + '00');
        let crcW32 = Hex.parse(crc.toString(16));
        deviceCrcW32.concat(crcW32);
        let crcId = crc32(deviceCrcW32.toUint8Array());
        return crcId.toString(16);
    }

    getNegotiationData() {
        const negotiatonHeader = '00000000';
        return negotiatonHeader + this.token + this.rnd;
    }

    startSession(sessionKey, negotiationKey) {
        service.log('Keys successfully negotiated, saving and starting session');
        this.sessionKey = sessionKey;
        this.negotiationKey = negotiationKey;
        this.initialized = true;
        this.saveToCache();
        this.trigger('device:initialized', this);
    }

    sendColors(colorString) {
        if (this.initialized) {
            const nonce = this.randomHexBytes(12);
            const dataLength = colorString.length / 2 + 24;
            const aad = this.createAad([colorString], dataLength, this.messageType.command, this.negotiatorCrc);

            const [colorDataEncrypted, authTag] = this.encryptGCM(colorString, nonce, aad, this.sessionKey);
            let length = this.getW32FromHex((colorDataEncrypted.length / 2).toString(16), 4).toString(Hex);

            let request = this.crc + length + colorDataEncrypted + authTag;
            let broadcastRequest = this.header + aad + nonce + request + this.tail;

            if (!this.socket) this.socket = udp.createSocket();
            const byteArray = this.hexToByteArray(broadcastRequest);
            this.socket.write(byteArray.buffer, this.broadcastIp, this.broadcastPort);
        } else {
            device.log('Not initialized');
            device.log(this.toJson());
        }
    }
}
