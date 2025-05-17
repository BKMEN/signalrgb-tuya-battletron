import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.15

Item {
    anchors.fill: parent

    property alias ledCount: ledSlider.value
    property color selectedColor: Qt.rgba(redSlider.value / 255, greenSlider.value / 255, blueSlider.value / 255, 1)

    Column {
        id: headerColumn
        anchors.margins: 10
        width: parent.width - 20
        spacing: 10

        Text {
            color: "#FFFFFF"
            text: "Configuración de dispositivo Tuya Razer"
            font.pixelSize: 18
            font.family: "Poppins"
            wrapMode: Text.WordWrap
        }
    }

    ListView {
        id: controllerList
        model: service.controllers
        width: parent.width
        height: parent.height - headerColumn.height - 380
        y: headerColumn.height + 20
        clip: true
        spacing: 20

        delegate: Item {
            id: root
            width: parent.width
            height: content.height

            property var controller: model.modelData.obj

            Rectangle {
                width: parent.width
                height: parent.height
                color: "#1a1a1a"
                radius: 6
            }

            Column {
                id: content
                width: parent.width
                anchors.margins: 15
                spacing: 12

                Row {
                    Switch {
                        id: enabled
                        text: "Activado"
                        checked: controller.tuyaDevice.enabled
                        onClicked: {
                            updateButton.enabled = controller.validateDeviceUpdate(
                                enabled.checked, deviceType.currentValue, localKey.text, ledSlider.value);
                        }
                    }
                }

                Row { Text { color: "#FFFFFF"; text: controller.tuyaDevice.name; font.pixelSize: 18; font.bold: true; font.family: "Poppins" } }
                Row { Text { color: "#CCCCCC"; text: "IP: " + controller.tuyaDevice.ip; font.pixelSize: 14; font.family: "Poppins" } }
                Row { Text { color: "#CCCCCC"; text: "Versión: " + controller.tuyaDevice.version; font.pixelSize: 14; font.family: "Poppins" } }

                Row { Text { color: "#CCCCCC"; text: "Tipo de dispositivo:"; font.pixelSize: 14; font.family: "Poppins" } }

                ComboBox {
                    id: deviceType
                    width: parent.width * 0.9
                    model: controller.deviceList
                    textRole: "deviceName"
                    valueRole: "key"
                    onActivated: updateButton.enabled = controller.validateDeviceUpdate(
                        enabled.checked, deviceType.currentValue, localKey.text, ledSlider.value)
                    Component.onCompleted: currentIndex = indexOfValue(controller.tuyaDevice.deviceType)
                }

                Row { Text { color: "#CCCCCC"; text: "Clave local:"; font.pixelSize: 14; font.family: "Poppins" } }

                TextField {
                    id: localKey
                    width: parent.width * 0.9
                    text: controller.tuyaDevice.localKey
                    color: "#FFFFFF"
                    font.pixelSize: 14
                    font.family: "Poppins"
                    onTextEdited: updateButton.enabled = controller.validateDeviceUpdate(
                        enabled.checked, deviceType.currentValue, localKey.text, ledSlider.value)
                }

                Row { Text { color: "#CCCCCC"; text: "Cantidad de LEDs:"; font.pixelSize: 14; font.family: "Poppins" } }

                Row {
                    Slider {
                        id: ledSlider
                        from: 1
                        to: 100
                        stepSize: 1
                        value: controller.tuyaDevice.ledCount !== null ? controller.tuyaDevice.ledCount : 4
                        width: parent.width * 0.7
                        onValueChanged: {
                            updateButton.enabled = controller.validateDeviceUpdate(
                                enabled.checked, deviceType.currentValue, localKey.text, ledSlider.value);
                        }
                    }
                    Text {
                        text: ledSlider.value.toFixed(0)
                        color: "#CCCCCC"
                        font.pixelSize: 14
                        width: 30
                        horizontalAlignment: Text.AlignHCenter
                    }
                }

                Rectangle {
                    width: 120; height: 36; radius: 6
                    color: updateButton.enabled ? "#007ACC" : "#555555"

                    ToolButton {
                        id: updateButton
                        enabled: false
                        anchors.fill: parent
                        text: "Actualizar"
                        onClicked: {
                            controller.updateDevice(enabled.checked, deviceType.currentValue, localKey.text, ledSlider.value)
                            updateButton.enabled = false
                        }
                    }
                }
            }
        }
    }

    ColumnLayout {
        anchors.bottom: parent.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.margins: 20
        spacing: 12

        Text {
            text: "Configuración de color"
            font.bold: true
            font.pixelSize: 16
            Layout.alignment: Qt.AlignHCenter
            color: "#FFFFFF"
        }

        RowLayout {
            spacing: 10
            Layout.alignment: Qt.AlignLeft

            Text { text: "Rojo:"; color: "#CCCCCC"; width: 50 }
            Slider {
                id: redSlider
                from: 0; to: 255; value: 255
                Layout.fillWidth: true
                onValueChanged: previewRect.color = selectedColor
            }
            Text { text: redSlider.value.toFixed(0); color: "#CCCCCC"; width: 30 }
        }

        RowLayout {
            spacing: 10
            Layout.alignment: Qt.AlignLeft

            Text { text: "Verde:"; color: "#CCCCCC"; width: 50 }
            Slider {
                id: greenSlider
                from: 0; to: 255; value: 255
                Layout.fillWidth: true
                onValueChanged: previewRect.color = selectedColor
            }
            Text { text: greenSlider.value.toFixed(0); color: "#CCCCCC"; width: 30 }
        }

        RowLayout {
            spacing: 10
            Layout.alignment: Qt.AlignLeft

            Text { text: "Azul:"; color: "#CCCCCC"; width: 50 }
            Slider {
                id: blueSlider
                from: 0; to: 255; value: 255
                Layout.fillWidth: true
                onValueChanged: previewRect.color = selectedColor
            }
            Text { text: blueSlider.value.toFixed(0); color: "#CCCCCC"; width: 30 }
        }

        Rectangle {
            id: previewRect
            width: 100; height: 40; radius: 4
            color: selectedColor
            border.color: "black"
            border.width: 1
            Layout.alignment: Qt.AlignHCenter

            Text {
                anchors.centerIn: parent
                text: "Color actual"
                font.pixelSize: 10
                color: "white"
            }
        }

        Button {
            text: "Aplicar configuración"
            Layout.alignment: Qt.AlignHCenter
            onClicked: {
                console.log("LEDs: " + ledSlider.value)
                console.log("Color: " + selectedColor)
                // Aquí puedes emitir una señal para enviar el color al backend
            }
        }
    }
}
