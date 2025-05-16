import BaseClass from './Libs/BaseClass.test.js';
import DeviceList from './Data/DeviceList.test.js';

export default class TuyaController extends BaseClass
{
    constructor(tuyaDevice)
    {
export default class TuyaController extends BaseClass {
    constructor(tuyaDevice) {
super();
this.enabled = false;
this.id = tuyaDevice.id;
@@ -14,44 +12,37 @@ export default class TuyaController extends BaseClass
this.tuyaDevice.on('device:initialized', this.deviceInitialized.bind(this));
}

    deviceInitialized()
    {
    deviceInitialized() {
service.log('Device initialized');
service.log(this);
        

this.enabled = true;
service.removeController(this);
service.addController(this);
service.announceController(this);
}

    getDevices()
    {
    getDevices() {
let devices = [
{ key: 0, deviceName: 'Select device type' }
];
let keys = Object.keys(DeviceList);
        for (const key of keys)
        {
        for (const key of keys) {
devices.push({ key: key, deviceName: DeviceList[key].name });
}
return devices;
}

    validateDeviceUpdate(enabled, deviceType, localKey)
    {
    validateDeviceUpdate(enabled, deviceType, localKey) {
return this.tuyaDevice.validateDeviceUpdate(enabled, deviceType, localKey);
}

    updateDevice(enabled, deviceType, localKey)
    {
    updateDevice(enabled, deviceType, localKey) {
this.tuyaDevice.updateDevice(enabled, deviceType, localKey);

// Controller should already exist, but check anyway
        if (service.hasController(this.id))
        {
        if (service.hasController(this.id)) {
service.updateController(this);
}
}
            
}
}
