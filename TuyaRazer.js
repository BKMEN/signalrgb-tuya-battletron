import TuyaBroadcast from './TuyaBroadcast.test.js';
import TuyaController from './TuyaController.test.js';
import TuyaDevice from './TuyaDevice.test.js';
import TuyaNegotiator from './TuyaNegotiator.test.js';
import TuyaVirtualDevice from './TuyaVirtualDevice.test.js';

/* ---------- */
/*   DEVICE   */
/* ---------- */
export function Name() { return "Tuya Battletron"; }
export function Version() { return "0.0.1"; }
export function Type() { return "network"; }
export function Publisher() { return "Yovan"; }
export function Size() { return [1, 1]; }
export function DefaultPosition() { return [0, 70]; }
export function DefaultScale() { return 1.0; }

export function ControllableParameters() {
	return [
		{ "property": "lightingMode", "group": "settings", "label": "Lighting Mode", "type": "combobox", "values": ["Canvas", "Forced"], "default": "Canvas" },
		{ "property": "forcedColor", "group": "settings", "label": "Forced Color", "min": "0", "max": "360", "type": "color", "default": "#009bde" },
		{ "property": "turnOff", "group": "settings", "label": "On shutdown", "type": "combobox", "values": ["Do nothing", "Single color", "Turn device off"], "default": "Turn device off" },
		{ "property": "shutDownColor", "group": "settings", "label": "Shutdown Color", "min": "0", "max": "360", "type": "color", "default": "#8000FF" }
	];
}

let tuyaVirtualDevice;

export function Initialize() {
	if (controller.enabled) {
		tuyaVirtualDevice = new TuyaVirtualDevice(controller.tuyaDevice);
	}
}

export function Update() {
	// Opcional: lógica de actualización
}

export function Render() {
	if (controller.enabled) {
		let now = Date.now();
		tuyaVirtualDevice.render(lightingMode, forcedColor, now);
	}
}

export function Shutdown() {
	// Apagar dispositivo si se desea
}

export function Validate() {
	return true;
}

/* ------------- */
/*   DISCOVERY   */
/* ------------- */
export function DiscoveryService() {
	this.IconUrl = "https://github.com/BKMEN/signalrgb-tuya-battletron/raw/main/assets/logo.png"; // <- usa raw aquí

	this.ipCache = {};
	this.lastPollTime = -5000;
	this.PollInterval = 5000;
	this.devicesLoaded = false;
	this.negotiator = null;

	this.Initialize = function () {
		this.negotiator = new TuyaNegotiator();
		this.broadcast = new TuyaBroadcast();
		this.broadcast.on('broadcast.device', this.handleTuyaDiscovery.bind(this));
	};

	this.handleTuyaDiscovery = function (data) {
		let deviceData = data;

		if (!service.hasController(deviceData.gwId)) {
			service.log('Creating controller for ' + deviceData.gwId);

			try {
				const deviceJson = service.getSetting(deviceData.gwId, 'data');
				if (deviceJson) {
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
		} else {
			let controller = service.getController(deviceData.gwId);
			if (!controller.tuyaDevice.initialized && controller.tuyaDevice.localKey) {
				this.negotiator.negotiate();
			}
		}
	};

	this.Update = function (force) {
		const now = Date.now();
		if (this.negotiator) {
			this.negotiator.handleQueue(now);
		}
	};

	this.Discovered = function (receivedPacket) {
		// No usado
	};
}
