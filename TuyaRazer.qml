import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.15

Item {
    anchors.fill: parent

    Column {
        id: headerColumn
        y: 10
        width: parent.width - 20
        spacing: 0
        Text {
            color: "#FFFFFF"
            text: "Configuración de dispositivo Tuya Razer"
            font.pixelSize: 16
            font.family: "Poppins"
            bottomPadding: 10
            width: parent.width
            wrapMode: Text.WordWrap
        }
    }

    ListView {
        id: controllerList
        model: service.controllers
        width: parent.width
        height: parent.height - (headerColumn.height + 20)
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
                padding: 15
                spacing: 12

                Row {
                    Switch {
                        id: enabled
                        text: "Activado"
                        checked: controller.tuyaDevice.enabled
                        onClicked: {
                            updateButton.enabled = controller.validateDeviceUpdate(
                                enabled.checked, deviceType.currentValue, localKey.text);
                        }
                    }
                }

                Row {
                    Text {
                        color: "#FFFFFF"
                        text: controller.tuyaDevice.name
                        font.pixelSize: 18
                        font.bold: true
                        font.family: "Poppins"
                    }
                }

                Row {
                    Text {
                        color: "#CCCCCC"
                        text: "IP: " + controller.tuyaDevice.ip
                        font.pixelSize: 14
                        font.family: "Poppins"
                    }
                }

                Row {
                    Text {
                        color: "#CCCCCC"
                        text: "Versión: " + controller.tuyaDevice.version
                        font.pixelSize: 14
                        font.family: "Poppins"
                    }
                }

                Row {
                    Text {
                        color: "#CCCCCC"
                        text: "Tipo de dispositivo:"
                        font.pixelSize: 14
                        font.family: "Poppins"
                    }
                }

                ComboBox {
                    id: deviceType
                    width: parent.width * 0.9
                    model: controller.deviceList
                    textRole: "deviceName"
                    valueRole: "key"
                    onActivated: {
                        updateButton.enabled = controller.validateDeviceUpdate(
                            enabled.checked, deviceType.currentValue, localKey.text);
                    }
                    Component.onCompleted: currentIndex = indexOfValue(controller.tuyaDevice.deviceType)
                }

                Row {
                    Text {
                        color: "#CCCCCC"
                        text: "Clave local:"
                        font.pixelSize: 14
                        font.family: "Poppins"
                    }
                }

                TextField {
                    id: localKey
                    width: parent.width * 0.9
                    text: controller.tuyaDevice.localKey
                    color: "#FFFFFF"
                    font.pixelSize: 14
                    font.family: "Poppins"
                    onTextEdited: {
                        updateButton.enabled = controller.validateDeviceUpdate(
                            enabled.checked, deviceType.currentValue, localKey.text);
                    }
                }

                Rectangle {
                    width: 120
                    height: 36
                    radius: 6
                    color: updateButton.enabled ? "#007ACC" : "#555555"

                    ToolButton {
                        id: updateButton
                        enabled: false
                        anchors.fill: parent
                        text: "Actualizar"
                        onClicked: {
                            controller.updateDevice(enabled.checked, deviceType.currentValue, localKey.text);
                            updateButton.enabled = false;
                        }
                    }
                }
            }
        }
    }
}
