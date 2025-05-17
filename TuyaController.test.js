import BaseClass from './Libs/BaseClass.test.js';
import DeviceList from './Data/DeviceList.test.js';
import { Hex } from './Crypto/Hex.test.js';

export default class TuyaController extends BaseClass {
    constructor(tuyaDevice) {
        super();
        this.enabled = false;
        this.id = tuyaDevice.id;
        this.tuyaDevice = tuyaDevice;
        this.deviceList = this.getDevices();

        this.tuyaDevice.on('device:initialized', this.deviceInitialized.bind(this));
    }

    deviceInitialized() {
        service.log('Device initialized');
        service.log(this);

        this.enabled = true;
        service.removeController(this);
        service.addController(this);
        service.announceController(this);
    }

    getDevices() {
        let devices = [
            { key: 0, deviceName: 'Select device type' }
        ];
        let keys = Object.keys(DeviceList);
        for (const key of keys) {
            devices.push({ key: key, deviceName: DeviceList[key].name });
        }
        return devices;
    }

    validateDeviceUpdate(enabled, deviceType, localKey, ledCount = null) {
        // ledCount puede ser null o el nuevo valor
        return this.tuyaDevice.validateDeviceUpdate(enabled, deviceType, localKey, ledCount);
    }

    updateDevice(enabled, deviceType, localKey, ledCount = null) {
        service.log(`updateDevice: enabled=${enabled}, deviceType=${deviceType}, localKey=${localKey}, ledCount=${ledCount}`);
        this.tuyaDevice.updateDevice(enabled, deviceType, localKey, ledCount);

        // Controller should already exist, but check anyway
        if (service.hasController(this.id)) {
            service.updateController(this);
        }
    }

    // --- NUEVO: método para aplicar color en tiempo real ---
    applyColor(qmlColor) {
        // qmlColor: Qt.rgba(r, g, b, a), pero valores entre 0 y 1.
        if (!this.tuyaDevice) return;

        // Convertimos a [r,g,b] 0-255
        const r = Math.round(qmlColor.r * 255);
        const g = Math.round(qmlColor.g * 255);
        const b = Math.round(qmlColor.b * 255);

        // Usa tu propio método si ya existe, si no, lo añado aquí:
        const [h, s, v] = this.rgbToHsv([r, g, b]);

        const hHex = this.getW32FromHex(h.toString(16), 2).toString(Hex);
        const sHex = this.getW32FromHex(parseInt(s / 10).toString(16), 1).toString(Hex);
        const vHex = this.getW32FromHex(parseInt(v / 10).toString(16), 1).toString(Hex);

        const colorString = hHex + sHex + vHex + "00000100";

        this.tuyaDevice.sendColors(colorString);
    }

    // Si ya tienes estos métodos, elimina estos helpers
    rgbToHsv(arr) {
        let h = 0, s = 0, v = 0;
        let r = arr[0], g = arr[1], b = arr[2];
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        v = max / 255;
        s = max === 0 ? 0 : 1 - min / max;
        if (max === min) {
            h = 0;
        } else if (max === r && g >= b) {
            h = 60 * ((g - b) / (max - min));
        } else if (max === r && g < b) {
            h = 60 * ((g - b) / (max - min)) + 360;
        } else if (max === g) {
            h = 60 * ((b - r) / (max - min)) + 120;
        } else if (max === b) {
            h = 60 * ((r - g) / (max - min)) + 240;
        }
        h = parseInt(h);
        s = parseInt(s * 1000);
        v = parseInt(v * 1000);
        return [h, s, v];
    }

    getW32FromHex(hexString, byteLen) {
        if (byteLen) {
            hexString = this.zeroPad(hexString, 2 * byteLen);
        }
        return Hex.parse(hexString);
    }
}
