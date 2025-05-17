import BaseClass from './Libs/BaseClass.test.js';
import DeviceList from './Data/DeviceList.test.js';

export default class TuyaController extends BaseClass
{
    constructor(tuyaDevice)
    {
        super();
        this.enabled = false;
        this.id = tuyaDevice.id;
        this.tuyaDevice = tuyaDevice;
        this.deviceList = this.getDevices();

        this.tuyaDevice.on('device:initialized', this.deviceInitialized.bind(this));
    }

    deviceInitialized()
    {
        service.log('Device initialized');
        service.log(this);

        this.enabled = true;
        service.removeController(this);
        service.addController(this);
        service.announceController(this);
    }

    getDevices()
    {
        let devices = [
            { key: 0, deviceName: 'Select device type' }
        ];
        let keys = Object.keys(DeviceList);
        for (const key of keys)
        {
            devices.push({ key: key, deviceName: DeviceList[key].name });
        }
        return devices;
    }

    validateDeviceUpdate(enabled, deviceType, localKey, ledCount = null)
    {
        return this.tuyaDevice.validateDeviceUpdate(enabled, deviceType, localKey)
            || (ledCount !== null && ledCount !== this.tuyaDevice.ledCount);
    }

    updateDevice(enabled, deviceType, localKey, ledCount = null)
    {
        this.tuyaDevice.updateDevice(enabled, deviceType, localKey, ledCount);

        if (service.hasController(this.id))
        {
            service.updateController(this);
        }
    }

    // ✅ Nuevo método: Enviar color en vivo desde la interfaz
    sendColorToDevice(color, ledCount = 4)
    {
        const rgb = this.colorToHex(color);
        const colors = Array(ledCount).fill(rgb);
        const colorString = this.tuyaDevice.generateColorString(colors);
        this.tuyaDevice.sendColors(colorString);
    }

    // ✅ Convierte color Qt.rgba en array RGB [r, g, b]
    colorToHex(color)
    {
        const r = Math.round(color.r * 255);
        const g = Math.round(color.g * 255);
        const b = Math.round(color.b * 255);
        return [r, g, b];
    }
}
