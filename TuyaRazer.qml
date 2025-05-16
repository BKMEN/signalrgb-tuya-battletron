import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.15

Item {
    id: root
    width: 600
    height: 800

    property var controller: service.getController(service.currentDevice)
    property alias deviceType: deviceType.currentValue
    property alias localKey: localKey.text
    property alias enabled: enabled.checked

    Column {
        id: content
        anchors.fill: parent
        anchors.margins: 20
        spacing: 20

        Text {
            text: "Tuya Razer"
            font.pixelSize: 28
            font.bold: true
            color: "white"
        }

        Text {
            text: "Configuración de dispositivo Tuya Razer"
            font.pixelSize: 16
            color: "#cccccc"
        }

        Rectangle {
            width: parent.width
            radius: 10
            color: "#1e1e1e"
            border.color: "#444"
            border.width: 1
            padding: 20

            Column {
                spacing: 16
                width: parent.width

                Row {
                    spacing: 10
                    Switch {
                        id: enabled
                        checked: controller.tuyaDevice.enabled
                    }
                    Text {
                        text: enabled.checked ? "Activado" : "Desactivado"
                        color: "white"
                        font.pixelSize: 14
                    }
                }

                Text {
                    text: controller.tuyaDevice.name
                    font.bold: true
                    color: "white"
                    font.pixelSize: 16
                }

                Text {
                    text: "IP: " + controller.tuyaDevice.ip
                    color: "#cccccc"
                    font.pixelSize: 14
                }

                Text {
                    text: "Versión: " + controller.tuyaDevice.version
                    color: "#cccccc"
                    font.pixelSize: 14
                }

                Text {
                    text: "Tipo de dispositivo:"
                    color: "white"
                    font.pixelSize: 14
                }

                ComboBox {
                    id: deviceType
                    width: parent.width
                    model: controller.deviceList
                    textRole: "deviceName"
                    valueRole: "key"
                    currentIndex: controller.deviceList.findIndex(item => item.key === controller.tuyaDevice.deviceType)
                }

                Text {
                    text: "Clave local:"
                    color: "white"
                    font.pixelSize: 14
                }

                TextField {
                    id: localKey
                    width: parent.width
                    text: controller.tuyaDevice.localKey
                    color: "white"
                    background: Rectangle {
                        color: "#141414"
                        border.color: "#444"
                        radius: 5
                    }
                }

                Button {
                    text: "Actualizar"
                    width: 100
                    onClicked: {
                        controller.updateDevice(
                            enabled.checked,
                            deviceType.currentValue,
                            localKey.text
                        )
                    }
                }
            }
        }

        // -------- NUEVA SECCIÓN PARA LEDS Y COLOR --------
        Rectangle {
            width: parent.width
            radius: 10
            color: "#1e1e1e"
            border.color: "#444"
            border.width: 1
            padding: 20

            Column {
                spacing: 20
                width: parent.width

                Row {
                    spacing: 10
                    Text {
                        text: "Cantidad de LEDs:"
                        color: "white"
                    }
                    Slider {
                        id: ledCountSlider
                        from: 1
                        to: 50
                        value: 4
                        stepSize: 1
                        width: parent.width - 200
                    }
                    Text {
                        text: Math.round(ledCountSlider.value).toString()
                        color: "white"
                    }
                }

                Row {
                    spacing: 10
                    Text { text: "Rojo:"; color: "white" }
                    Slider { id: redSlider; from: 0; to: 255; value: 255; width: 300 }
                }

                Row {
                    spacing: 10
                    Text { text: "Verde:"; color: "white" }
                    Slider { id: greenSlider; from: 0; to: 255; value: 255; width: 300 }
                }

                Row {
                    spacing: 10
                    Text { text: "Azul:"; color: "white" }
                    Slider { id: blueSlider; from: 0; to: 255; value: 255; width: 300 }
                }

                Rectangle {
                    width: 100
                    height: 40
                    radius: 5
                    color: Qt.rgba(redSlider.value / 255, greenSlider.value / 255, blueSlider.value / 255, 1)
                    border.color: "#999999"
                }

                Button {
                    text: "Aplicar configuración"
                    width: 200
                    onClicked: {
                        service.log("LEDs: " + Math.round(ledCountSlider.value))
                        service.log("Color: R=" + redSlider.value + " G=" + greenSlider.value + " B=" + blueSlider.value)
                        // Aquí podrías enlazar con una función para enviar al dispositivo
                    }
                }
            }
        }
    }
}
