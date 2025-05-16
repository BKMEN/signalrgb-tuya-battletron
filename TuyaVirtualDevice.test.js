import BaseClass from './Libs/BaseClass.test.js';
import DeviceList from './Data/DeviceList.test.js';
import TuyaDevice from './TuyaDevice.test.js';
import { Hex } from './Crypto/Hex.test.js';

export default class TuyaVirtualDevice extends BaseClass {
    constructor(deviceData) {
        super();
        this.tuyaDevice = new TuyaDevice(deviceData, null);
        this.frameDelay = 50;
        this.lastRender = 0;

        this.setupDevice(this.tuyaDevice);
    }

    getLedNames() {
        let ledNames = [];
        for (let i = 1; i <= this.ledCount; i++) {
            ledNames.push(`Led ${i}`);
        }
        return ledNames;
    }

    getLedPositions() {
        let ledPositions = [];
        for (let i = 0; i < this.ledCount; i++) {
            ledPositions.push([i, 0]);
        }
        return ledPositions;
    }

    setupDevice(tuyaDevice) {
        this.tuyaLeds = DeviceList[tuyaDevice.deviceType].leds;
        this.ledCount = this.tuyaLeds.length;

        this.ledNames = this.getLedNames();
        this.ledPositions = this.getLedPositions();

        device.setName(tuyaDevice.getName());

        device.setSize([this.ledCount, 1]);
        device.setControllableLeds(this.ledNames, this.ledPositions);
    }

    render(lightingMode, forcedColor, now) {
        if (now - this.lastRender > this.frameDelay) {
            this.lastRender = now;
            let RGBData = [];
            switch (lightingMode) {
                case "Canvas":
                    RGBData = this.getDeviceRGB();
                    break;
                case "Forced":
                    for (let i = 0; i < this.ledCount; i++) {
                        RGBData.push(this.hexToRGB(forcedColor));
                    }
                    break;
            }

            let colorString = this.generateColorString(RGBData);
            this.tuyaDevice.sendColors(colorString);
        }
    }

    getDeviceRGB() {
        const RGBData = [];
        for (let i = 0; i < this.ledPositions.length; i++) {
            const ledPosition = this.ledPositions[i];
            const color = device.color(ledPosition[0], ledPosition[1]);
            RGBData.push(color);
        }
        return RGBData;
    }

    generateColorString(colors) {
        const spliceLength = this.tuyaLeds.length;
        if (colors.length === 1) {
            const [h, s, v] = this.rgbToHsv(colors[0]);
            let color = this.getW32FromHex(h.toString(16), 2).toString(Hex) +
                        this.getW32FromHex(parseInt(s / 10).toString(16), 1).toString(Hex) +
                        this.getW32FromHex(parseInt(v / 10).toString(16), 1).toString(Hex);
            return color + "00000100";
        } else {
            const colorArray = colors.map(color => {
                const [h, s, v] = this.rgbToHsv(color);
                return (
                    this.getW32FromHex(h.toString(16), 2).toString(Hex) +
                    this.getW32FromHex(s.toString(16), 2).toString(Hex) +
                    this.getW32FromHex(v.toString(16), 2).toString(Hex)
                );
            });

            let groupIndex = 1;
            let groupString = '';
            for (let i = 0; i < this.tuyaLeds.length; i++) {
                if (i % 4 === 0 && i !== 0) groupIndex++;
                groupString += this.zeroPad(groupIndex.toString(16), 2);
            }

            const spliceNumHex = this.getW32FromHex(spliceLength.toString(16), 2).toString(Hex);
            const colorValue = '0004' + colorArray.join('') + spliceNumHex + groupString;

            return colorValue;
        }
    }

    zeroPad(numStr, length) {
        while (numStr.length < length) {
            numStr = '0' + numStr;
        }
        return numStr;
    }
}
