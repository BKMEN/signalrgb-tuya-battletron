this.tuyaDevice = new TuyaDevice(deviceData, null);
this.frameDelay = 50;
this.lastRender = 0;

this.setupDevice(this.tuyaDevice);
}
    

getLedNames()
{
        return Array.from({ length: this.ledCount }, (_, i) => `Led ${i + 1}`);
        let ledNames = [];
        for (let i = 1; i <= this.ledCount; i++) {
            ledNames.push(`Led ${i}`);
        }
        return ledNames;
}

getLedPositions()
{
        return Array.from({ length: this.ledCount }, (_, i) => [i, 0]);
        let ledPositions = [];
        for (let i = 0; i < this.ledCount; i++) {
            ledPositions.push([i, 0]);
        }
        return ledPositions;
}

setupDevice(tuyaDevice)
{
        const deviceType = tuyaDevice.deviceType;
        const deviceInfo = DeviceList[deviceType];

        if (!deviceInfo) {
            service.log(`⚠️ Dispositivo con deviceType '${deviceType}' no encontrado en DeviceList.`);
            this.tuyaLeds = [1, 2, 3, 4];  // fallback
        } else {
            this.tuyaLeds = deviceInfo.leds;
        }

        const deviceInfo = DeviceList[tuyaDevice.deviceType];
        if (!deviceInfo) throw new Error("Device type not found in DeviceList");
        this.tuyaLeds = deviceInfo.leds;
this.ledCount = this.tuyaLeds.length;

this.ledNames = this.getLedNames();
this.ledPositions = this.getLedPositions();

        device.setName(tuyaDevice.getName());
        device.setName(deviceInfo.name || tuyaDevice.getName());
device.setSize([this.ledCount, 1]);
device.setControllableLeds(this.ledNames, this.ledPositions);
}

render(lightingMode, forcedColor, now)
{
        if (now - this.lastRender > this.frameDelay)
        {
        if (now - this.lastRender > this.frameDelay) {
this.lastRender = now;
let RGBData = [];

            switch (lightingMode)
            {
            switch (lightingMode) {
case "Canvas":
RGBData = this.getDeviceRGB();
break;
case "Forced":
                    RGBData = Array(this.ledCount).fill(this.hexToRGB(forcedColor));
                    for (let i = 0; i < this.ledCount; i++) {
                        RGBData.push(this.hexToRGB(forcedColor));
                    }
break;
}

            const colorString = this.generateColorString(RGBData);
            let colorString = this.generateColorString(RGBData);
this.tuyaDevice.sendColors(colorString);
}
}

getDeviceRGB()
{
        return this.ledPositions.map(([x, y]) => device.color(x, y));
        return this.ledPositions.map(pos => device.color(pos[0], pos[1]));
}

generateColorString(colors)
{
        const totalLeds = this.tuyaLeds.length;
        let spliceLength = this.tuyaLeds.length;
        if (colors.length === 1) spliceLength = 1;

        if (colors.length === 1)
        if (spliceLength === 1)
{
            const [h, s, v] = this.rgbToHsv(colors[0]);
            return this.getW32FromHex(h.toString(16), 2).toString(Hex) +
                   this.getW32FromHex(parseInt(s / 10).toString(16), 1).toString(Hex) +
                   this.getW32FromHex(parseInt(v / 10).toString(16), 1).toString(Hex) +
            const [h1,s1,v1] = this.rgbToHsv(colors[0]);
            return this.getW32FromHex(h1.toString(16), 2).toString(Hex) +
                   this.getW32FromHex(parseInt(s1 / 10).toString(16), 1).toString(Hex) +
                   this.getW32FromHex(parseInt(v1 / 10).toString(16), 1).toString(Hex) +
"00000100";
        }

        const colorArray = colors.map(color => {
            const [h, s, v] = this.rgbToHsv(color);
            return this.getW32FromHex(h.toString(16), 2).toString(Hex) +
                   this.getW32FromHex(s.toString(16), 2).toString(Hex) +
                   this.getW32FromHex(v.toString(16), 2).toString(Hex);
        });
        } else {
            const colorArray = colors.map(color => {
                const [h,s,v] = this.rgbToHsv(color);
                return this.getW32FromHex(h.toString(16), 2).toString(Hex) +
                       this.getW32FromHex(s.toString(16), 2).toString(Hex) +
                       this.getW32FromHex(v.toString(16), 2).toString(Hex);
            });

            let zoneString = '';
            for (let i = 1; i <= this.tuyaLeds.length; i++) {
                if (i <= 4) zoneString += '01';
                else if (i <= 8) zoneString += '02';
                else if (i <= 12) zoneString += '03';
                else if (i <= 16) zoneString += '04';
            }

        let addressString = '';
        for (let i = 1; i <= totalLeds; i++)
        {
            if (i <= 4) addressString += '01';
            else if (i <= 8) addressString += '02';
            else if (i <= 12) addressString += '03';
            else addressString += '04';
            const spliceNumHex = this.getW32FromHex(spliceLength.toString(16), 2).toString(Hex);
            return '0004' + colorArray.join('') + spliceNumHex + zoneString;
}

        const spliceNumHex = this.getW32FromHex(totalLeds.toString(16), 2).toString(Hex);
        return '0004' + colorArray.join('') + spliceNumHex + addressString;
}
}
