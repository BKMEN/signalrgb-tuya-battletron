import TuyaBroadcast from './TuyaBroadcast.test.js';
import TuyaController from './TuyaController.test.js';
import TuyaDevice from './TuyaDevice.test.js';
import TuyaNegotiator from './TuyaNegotiator.test.js';
import TuyaVirtualDevice from './TuyaVirtualDevice.test.js';

/* ---------- */
/*   DEVICE   */
/* ---------- */
export function Name() { return "Tuya Razer"; }
export function Version() { return "0.0.1"; }
export function Type() { return "network"; }
export function Publisher() { return "RickOfficial"; }
export function Size() { return [1, 1]; }
export function DefaultPosition() { return [0, 70]; }
export function DefaultScale() { return 1.0; }

export function ControllableParameters()
{
	return [
		{
			"property": "lightingMode",
			"group": "General",
			"label": "Modo de iluminación",
			"type": "combobox",
			"values": ["Canvas", "Forced"],
			"default": "Canvas",
			"description": "Canvas usa los efectos de SignalRGB. Forced aplica un color fijo a todo el dispositivo."
		},
		{
			"property": "forcedColor",
			"group": "General",
			"label": "Color fijo",
			"type": "color",
			"default": "#009bde",
			"description": "Color que se usará en el modo 'Forced'."
		},
		{
			"property": "brightness",
			"group": "General",
			"label": "Brillo",
			"type": "slider",
			"min": 0,
			"max": 100,
			"default": 100,
			"description": "Controla el brillo global de los LEDs (si es compatible con tu dispositivo)."
		},
		{
			"property": "turnOff",
			"group": "Apagado",
			"label": "Comportamiento al apagar",
			"type": "combobox",
			"values": ["Do nothing", "Single color", "Turn device off"],
			"default": "Turn device off",
			"description": "Define qué hacer cuando SignalRGB se apaga o deja de enviar efectos."
		},
		{
			"property": "shutDownColor",
			"group": "Apagado",
			"label": "Color de apagado",
			"type": "color",
			"default": "#8000FF",
			"description": "Color que se aplica al apagar, si has seleccionado 'Single color'."
		},
		{
			"property": "deviceType",
			"group": "Debug",
			"label": "Tipo de dispositivo (avanzado)",
			"type": "text",
			"default": "",
			"description": "Permite forzar el tipo de dispositivo si el autodetectado no es correcto."
		}
	];
}

let tuyaVirtualDevice;

export function Initialize()
{
    if (controller.enabled)
    {
        // Crear dispositivo virtual
        tuyaVirtualDevice = new TuyaVirtualDevice(controller.tuyaDevice);
    }
}

export function Update()
{
}

export function Render()
{
    if (controller.enabled)
    {
        let now = Date.now();
        tuyaVirtualDevice.render(lightingMode, forcedColor, now);
    }
}

export function Shutdown()
{
}

export function Validate()
{
    return true;
}

/* ------------- */
/*   DISCOVERY   */
/* ------------- */
export function DiscoveryService()
{
    this.ipCache = {};
    this.lastPollTime = -5000;
    this.PollInterval = 5000;
    this.devicesLoaded = false;
    this.negotiator = null;

    this.Initialize = function()
    {
        this.negotiator = new TuyaNegotiator();
        this.broadcast = new TuyaBroadcast();
        this.broadcast.on('broadcast.device', this.handleTuyaDiscovery.bind(this));
    }

    this.handleTuyaDiscovery = function(data)
    {
        let deviceData = data;

        if (!service.hasController(deviceData.gwId))
        {
            service.log('Creando controlador para ' + deviceData.gwId);
            try {
                const deviceJson = service.getSetting(deviceData.gwId, 'data');
                if (deviceJson)
                {
                    deviceData = JSON.parse(deviceJson);
                }

                const tuyaDevice = new TuyaDevice(deviceData, this.negotiator.crc);
                const controller = new TuyaController(tuyaDevice);

                try {
                    this.negotiator.addDevice(tuyaDevice);
                } catch (ex) {
                    service.log(ex.message);
                }

                service.addController(controller);
                if (controller.enabled) service.announceController(controller);
            } catch (ex) {
                service.log(ex.message);
            }
        }
        else
        {
            let controller = service.getController(deviceData.gwId);
            if (!controller.tuyaDevice.initialized && controller.tuyaDevice.localKey)
            {
                this.negotiator.negotiate();
            }
        }
    }

    this.Update = function(force)
    {
        const now = Date.now();
        if (this.negotiator)
        {
            this.negotiator.handleQueue(now);
        }
    }

    this.Discovered = function(receivedPacket)
    {
        // No se utiliza actualmente
    }
}
