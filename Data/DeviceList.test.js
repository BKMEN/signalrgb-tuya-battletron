export default {
    // Dispositivos por defecto (comentados)
    // "083b8r848jmkevue": { leds: [1, 2, 3] },
    // "rgh3w8qrucy3ymcj": { leds: [1, 2, 3] },
    // "5ius1rttrbhkumek": { leds: [1, 2, 3] },
    // "jvmklygzo5yhmtjd": { leds: [1, 2, 3] },
    // "g3nrnczr4yyu5ku4": { leds: [1, 2, 3] },
    // "xiloacdtpbqo3mpw": { leds: [1, 2, 3] },
    // "qdltmkgvymznc2kb": { leds: [1, 2, 3] },
    // "x500axynheqmymbz": { leds: [1, 2, 3] },
    // "phaq47nqweuxkaub": { leds: [1, 2, 3] },
    // "dgybismvisv2gwwa": { leds: [1, 2, 3] },
    // "6jgfob7cjpbjk6xp": { leds: [1, 2, 3] },
    // "tdsur0drocyarioz": { leds: [1, 2, 3] },
    // "nbsdczusihusuvmo": { leds: [1, 2, 3] },
    // "fye9cxmhhifdk0jp": { leds: [1, 2, 3] },
    // "xgkubo8az1nwi3fk": { leds: [1, 2, 3] },
    // "8nakisygtewhlhre": { leds: [1, 2, 3] },
    // "mlye2ros6n7mxifj": { leds: [1, 2, 3] },
    // "4eabc54zwmptwxjc": { leds: [1, 2, 3] },
    // "dzumjluqapqxl7hg": { leds: [1, 2, 3] },
    // "rhx07fozmn1a7bie": { leds: [1, 2, 3] },
    // "qdakk2myuzx5znz6": { leds: [1, 2, 3] },
    // "mahtdjiswfxrvbw3": { leds: [1, 2, 3] },
    // "iz8s1xcud9uofdqm": { leds: [1, 2, 3] },
    // "x93ufxg0p91vefxy": { leds: [1, 2, 3] },
    // "gvfd5eddkouwpqot": { leds: [1, 2, 3] },
    // "g3fbuhw2nqv2itkl": { leds: [1, 2, 3] },
    // "rkm6jx8tkuqzwuyp": { leds: [1, 2, 3] },
    // "ar4owaspjdcnxjyb": { leds: [1, 2, 3] },
    // "dkg8z2bvjz9imahs": { leds: [1, 2, 3] },
    // "hirevagkjjq3abnn": { leds: [1, 2, 3] },
    // "mn60o1u7xv8qh8f1": { leds: [1, 2, 3] },

    // Dispositivos personalizados
    "bfafad43febddb888apxbj": {
        leds: Array.from({ length: 4 }, (_, i) => i + 1), // Monitor (90 cm ≈ 4 LEDs)
        name: "Monitor"
    },
    "bfbebb82be7220f985rawa": {
        leds: Array.from({ length: 15 }, (_, i) => i + 1), // Escritorio (3 m ≈ 15 LEDs)
        name: "Escritorio"
    },
    "bfde5007394a05833ahsda": {
        leds: Array.from({ length: 50 }, (_, i) => i + 1), // Habitación (10 m ≈ 50 LEDs)
        name: "Leds habitación 1"
    },
    "bfbe7bd231444751090bsq": {
        leds: Array.from({ length: 50 }, (_, i) => i + 1), // Habitación (segunda tira de 10 m)
        name: "Leds habitación 2"
    },
    "bfc51f8e2052b74f49nvd4": {
        leds: Array.from({ length: 4 }, (_, i) => i + 1), // Luces Ali (4 LEDs)
        name: "Luces Ali"
    },

    // Dispositivos previos del plugin original
    "stmkcsykq3kheboa": {
        leds: Array.from({ length: 16 }, (_, i) => i + 1),
        name: "Battletron Light Bar"
    },
    "yrg6a649fkozp1hw": {
        leds: [1],
        name: "Battletron Ball Light"
    }
};
