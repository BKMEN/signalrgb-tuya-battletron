import TuyaDevice from './TuyaDevice.test.js';
import DeviceList from './Data/DeviceList.test.js';

export default class TuyaController {
    constructor(deviceData) {
        this.tuyaDevice = new TuyaDevice(deviceData, null);

        this.deviceList = [];
        Object.keys(DeviceList).forEach((key) => {
            this.deviceList.push({
                key: parseInt(key),
                deviceName: DeviceList[key].name
            });
        });
    }

    get tuyaId() {
        return this.tuyaDevice.id;
    }

    get tuyaIp() {
        return this.tuyaDevice.ip;
    }

    get tuyaKey() {
        return this.tuyaDevice.localKey;
    }

    get tuyaName() {
        return this.tuyaDevice.name;
    }

    get tuyaVersion() {
        return this.tuyaDevice.version;
    }

    get tuyaEnabled() {
        return this.tuyaDevice.enabled;
    }

    get deviceType() {
        return this.tuyaDevice.deviceType;
    }

    get deviceList() {
        return this.deviceList;
    }

    // ✅ ACTUALIZADO: nuevo parámetro ledCount
    validateDeviceUpdate(enabled, deviceType, localKey, ledCount = null) {
        let shouldSave = false;

        if (this.tuyaDevice.enabled !== enabled) {
            shouldSave = true;
        }

        if (this.tuyaDevice.deviceType !== deviceType) {
            shouldSave = true;
        }

        if (this.tuyaDevice.localKey !== localKey) {
            shouldSave = true;
        }

        if (
            ledCount !== null &&
            this.tuyaDevice.ledCount !== ledCount
        ) {
            shouldSave = true;
        }

        return shouldSave;
    }

    // ✅ ACTUALIZADO: nuevo parámetro ledCount
    updateDevice(enabled, deviceType, localKey, ledCount = null) {
        this.tuyaDevice.updateDevice(enabled, deviceType, localKey, ledCount);
    }

    getDevice() {
        return this.tuyaDevice;
    }
}
