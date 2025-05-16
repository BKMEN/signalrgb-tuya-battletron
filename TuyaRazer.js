export function ControllableParameters() {
    return [
        {
            id: "enabled",
            name: "Activar dispositivo",
            type: "boolean",
            value: true,
            tooltip: "Activa o desactiva la conexión con el dispositivo Tuya."
        },
        {
            id: "deviceType",
            name: "Tipo de tira LED",
            type: "string",
            value: "monitor",
            options: [
                { label: "Monitor (4 LEDs)", value: "monitor" },
                { label: "Escritorio (15 LEDs)", value: "desk" },
                { label: "Habitación (50 LEDs)", value: "room" },
                { label: "Luces Auxiliares (4 LEDs)", value: "aux" }
            ],
            tooltip: "Selecciona el tipo de tira LED Tuya según la cantidad de LEDs y ubicación."
        },
        {
            id: "localKey",
            name: "Clave Local",
            type: "string",
            value: "",
            tooltip: "Introduce la clave local del dispositivo Tuya. Puedes encontrarla en la app o en tu panel de desarrollador."
        },
        {
            id: "brightness",
            name: "Brillo (experimental)",
            type: "number",
            value: 100,
            min: 0,
            max: 100,
            tooltip: "Controla el nivel de brillo (solo si tu tira lo permite)."
        },
        {
            id: "updateInterval",
            name: "Intervalo de actualización (ms)",
            type: "number",
            value: 50,
            min: 10,
            max: 1000,
            tooltip: "Frecuencia con la que se actualizan los LEDs (en milisegundos)."
        }
    ];
}
