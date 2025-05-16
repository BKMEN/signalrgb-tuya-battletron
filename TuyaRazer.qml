
import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.15

Item {
    id: root
    width: 600
    height: 500

    Rectangle {
        id: container
        anchors.fill: parent
        anchors.margins: 20
        color: "#1E1E1E"
        radius: 6

        ColumnLayout {
            id: layout
            anchors.fill: parent
            anchors.margins: 20
            spacing: 16

            Text {
                text: "Configuración de dispositivo Tuya Razer"
                font.pixelSize: 20
                font.bold: true
                color: "#ffffff"
            }

            Switch {
                id: enabledSwitch
                text: "Activado"
                checked: controller.tuyaDevice.enabled
                onClicked: {
                    updateButton.enabled = controller.validateDeviceUpdate(checked, deviceType.currentValue, localKey.text);
                }
            }

            Text {
                text: controller.tuyaDevice.name
                font.pixelSize: 18
                color: "#ffffff"
            }

            Text {
                text: "IP: " + controller.tuyaDevice.ip
                font.pixelSize: 14
                color: "#aaaaaa"
            }

            Text {
                text: "Versión: " + controller.tuyaDevice.version
                font.pixelSize: 14
                color: "#aaaaaa"
            }

            Text {
                text: "Tipo de dispositivo:"
                font.pixelSize: 14
                color: "#ffffff"
            }

            ComboBox {
                id: deviceType
                model: controller.deviceList
                textRole: "deviceName"
                valueRole: "key"
                Layout.fillWidth: true
                onActivated: {
                    updateButton.enabled = controller.validateDeviceUpdate(enabledSwitch.checked, deviceType.currentValue, localKey.text);
                }
                Component.onCompleted: currentIndex = indexOfValue(controller.tuyaDevice.deviceType)
            }

            Text {
                text: "Clave local:"
                font.pixelSize: 14
                color: "#ffffff"
            }

            TextField {
                id: localKey
                text: controller.tuyaDevice.localKey
                Layout.fillWidth: true
                color: "#ffffff"
                onTextEdited: {
                    updateButton.enabled = controller.validateDeviceUpdate(enabledSwitch.checked, deviceType.currentValue, text);
                }
            }

            Button {
                id: updateButton
                text: "Actualizar"
                enabled: false
                onClicked: {
                    controller.updateDevice(enabledSwitch.checked, deviceType.currentValue, localKey.text);
                    updateButton.enabled = false;
                }
            }
        }
    }
}
