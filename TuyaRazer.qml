import QtQuick.Layouts 1.15
import QtQuick 2.15
import QtQuick.Controls 2.15

Item {
    width: 400
    height: 600

    signal configApplied(int ledCount, color color)
    signal updateRequested(bool enabled, int deviceType, string localKey)

    property int redValue: 255
    property int greenValue: 255
    property int blueValue: 255

    property color selectedColor: Qt.rgba(redValue / 255, greenValue / 255, blueValue / 255)

    Column {
        spacing: 12
        anchors.centerIn: parent
        width: parent.width * 0.9

        // Campo: Device Type
        ComboBox {
            id: deviceType
            width: parent.width
            model: controller.deviceList
            textRole: "deviceName"
            valueRole: "key"
            currentIndex: controller.deviceList.findIndex(x => x.key === controller.tuyaDevice.deviceType)
            font.pixelSize: 14
            color: "white"
        }

        // Campo: Local Key
        TextField {
            id: localKey
            placeholderText: "Local Key"
            text: controller.tuyaDevice.localKey
            font.pixelSize: 14
            color: "white"
            background: Rectangle {
                color: "#2a2a2a"
                radius: 4
            }
        }

        // Slider: Cantidad de LEDs
        Row {
            spacing: 10
            Label {
                text: "Cantidad de LEDs:"
                color: "white"
            }
            Slider {
                id: ledSlider
                width: 200
                from: 1
                to: 50
                stepSize: 1
                value: 4
            }
            Label {
                text: ledSlider.value
                color: "white"
            }
        }

        // Sliders RGB
        Column {
            spacing: 6

            Row {
                spacing: 10
                Label { text: "Rojo:"; color: "white" }
                Slider {
                    id: redSlider
                    from: 0
                    to: 255
                    value: 255
                    onValueChanged: redValue = value
                    width: 200
                }
                Label { text: redValue; color: "white" }
            }

            Row {
                spacing: 10
                Label { text: "Verde:"; color: "white" }
                Slider {
                    id: greenSlider
                    from: 0
                    to: 255
                    value: 255
                    onValueChanged: greenValue = value
                    width: 200
                }
                Label { text: greenValue; color: "white" }
            }

            Row {
                spacing: 10
                Label { text: "Azul:"; color: "white" }
                Slider {
                    id: blueSlider
                    from: 0
                    to: 255
                    value: 255
                    onValueChanged: blueValue = value
                    width: 200
                }
                Label { text: blueValue; color: "white" }
            }

            Rectangle {
                width: 80
                height: 40
                color: selectedColor
                radius: 4
                border.color: "white"
                border.width: 1
                anchors.horizontalCenter: parent.horizontalCenter
            }
        }

        // Botón: Aplicar configuración
        Button {
            text: "Aplicar configuración"
            onClicked: configApplied(ledSlider.value, selectedColor)
            anchors.horizontalCenter: parent.horizontalCenter
            font.pixelSize: 14
        }

        // Botón: Actualizar dispositivo
        Button {
            text: "Actualizar dispositivo"
            onClicked: updateRequested(true, deviceType.currentValue, localKey.text)
            anchors.horizontalCenter: parent.horizontalCenter
            font.pixelSize: 14
        }
    }
}
