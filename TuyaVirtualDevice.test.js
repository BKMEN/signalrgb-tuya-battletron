import BaseClass from './Libs/BaseClass.test.js';
import DeviceList from './Data/DeviceList.test.js';
import TuyaDevice from './TuyaDevice.test.js';
import { Hex } from './Crypto/Hex.test.js';

export default class TuyaVirtualDevice extends BaseClass
{
    constructor(deviceData)
    {
        super();
        this.tuyaDevice = new TuyaDevice(deviceData, null);
        this.frameDelay = 50;
        this.lastRender = 0;

        this.setupDevice(this.tuyaDevice);
    }

    getLedNames()
    {
        let ledNames = [];
        for (let i = 1; i <= this.ledCount; i++)
        {
            ledNames.push(`Led ${i}`);
        }
        return ledNames;
    }

    getLedPositions()
    {
        let ledPositions = [];
        for (let i = 0; i < this.ledCount; i++)
        {
            ledPositions.push([i, 0]);
        }
        return ledPositions;
    }

    setupDevice(tuyaDevice)
    {
        this.tuyaLeds = DeviceList[tuyaDevice.deviceType]?.leds || [];
        
        // Obtiene el valor de ledCount desde el parámetro de SignalRGB, si está definido
        const ledCountSetting = device.getSetting("ledCount");
        this.ledCount = ledCountSetting || this.tuyaLeds.length || 4;

        this.ledNames = this.getLedNames();
        this.ledPositions = this.getLedPositions();

        device.setName(tuyaDevice.getName());
        device.setSize([this.ledCount, 1]);
        device.setControllableLeds(this.ledNames, this.ledPositions);
    }

    render(lightingMode, forcedColor, now)
    {
        if (now - this.lastRender > this.frameDelay)
        {
            this.lastRender = now;
            let RGBData = [];

            switch(lightingMode)
            {
                case "Canvas":
                    RGBData = this.getDeviceRGB();
                    break;
                case "Forced":
                    for (let i = 0; i < this.ledCount; i++)
                    {
                        RGBData.push(this.hexToRGB(forcedColor));
                    }
                    break;
            }

            let colorString = this.generateColorString(RGBData);
            this.tuyaDevice.sendColors(colorString);
        }
    }

    getDeviceRGB()
    {
        const RGBData = [];
        for (let i = 0 ; i < this.ledPositions.length; i++)
        {
            const ledPosition = this.ledPositions[i];
            const color = device.color(ledPosition[0], ledPosition[1]);
            RGBData.push(color);
        }
        return RGBData;
    }

    generateColorString(colors)
    {
        const spliceLength = this.ledCount;

        if (spliceLength === 1)
        {
            const [h1, s1, v1] = this.rgbToHsv(colors[0]);
            const color = this.getW32FromHex(h1.toString(16), 2).toString(Hex) +
                          this.getW32FromHex(parseInt(s1 / 10).toString(16), 1).toString(Hex) +
                          this.getW32FromHex(parseInt(v1 / 10).toString(16), 1).toString(Hex);

            return color + "00000100";
        }
        else
        {
            let colorArray = [];

            for (let color of colors)
            {
                const [h, s, v] = this.rgbToHsv(color);
                colorArray.push(
                    this.getW32FromHex(h.toString(16), 2).toString(Hex) +
                    this.getW32FromHex(s.toString(16), 2).toString(Hex) +
                    this.getW32FromHex(v.toString(16), 2).toString(Hex)
                );
            }

            let groupPattern = "";
            for (let i = 1; i <= spliceLength; i++)
            {
                // Agrupación lógica de LEDs por bloques de 4
                const groupIndex = Math.floor((i - 1) / 4) + 1;
                groupPattern += this.zeroPad(groupIndex.toString(16), 2);
            }

            const spliceNumHex = this.getW32FromHex(spliceLength.toString(16), 2).toString(Hex);
            const colorValue = '0004' + colorArray.join('') + spliceNumHex + groupPattern;

            return colorValue;
        }
    }
}
