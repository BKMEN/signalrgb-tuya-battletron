import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.15

Item {
    width: 600
    height: 800
    visible: true

    Rectangle {
        anchors.fill: parent
        color: "#1e1e1e"

        ScrollView {
            anchors.fill: parent
            clip: true

            ColumnLayout {
                width: parent.width
                spacing: 20
                padding: 20

                // Título
                Text {
                    text: "Configuración de dispositivo Tuya Razer"
                    color: "white"
                    font.pixelSize: 20
                    font.bold: true
                }

                // Verificación si hay controller disponible
                Component.onCompleted: {
                    if (!controller) {
                        console.log("Controller no está inicializado aún.");
                    }
                }

                // Mostrar info solo si controller existe
                Item {
                    visible: controller !== undefined
                    Layout.fillWidth: true

                    ColumnLayout {
                        spacing: 15
                        Layout.fillWidth: true

                        RowLayout {
                            spacing: 10
                            Switch {
                                checked: controller?.tuyaDevice?.enabled || false
                                onCheckedChanged: {
                                    updateButton.enabled = controller.validateDeviceUpdate(checked, deviceType.currentValue, localKey.text);
                                }
                            }
                            Text {
                                text: controller?.tuyaDevice?.enabled ? "Activado" : "Desactivado"
                                color: "white"
                                font.pixelSize: 16
                            }
                        }

                        Text {
                            text: controller?.tuyaDevice?.name
                            font.pixelSize: 18
                            color: "#ffffff"
                            font.bold: true
                        }

                        Text {
                            text: "IP: " + (controller?.tuyaDevice?.ip || "Desconocida")
                            color: "lightgray"
                        }

                        Text {
                            text: "Versión: " + (controller?.tuyaDevice?.version || "N/A")
                            color: "lightgray"
                        }

                        Text {
                            text: "Tipo de dispositivo:"
                            color: "white"
                        }

                        ComboBox {
                            id: deviceType
                            model: controller?.deviceList || []
                            textRole: "deviceName"
                            valueRole: "key"
                            currentIndex: controller ? deviceType.indexOfValue(controller.tuyaDevice.deviceType) : -1
                            onActivated: {
                                updateButton.enabled = controller.validateDeviceUpdate(enabled.checked, deviceType.currentValue, localKey.text);
                            }
                        }

                        Text {
                            text: "Clave local:"
                            color: "white"
                        }

                        TextField {
                            id: localKey
                            text: controller?.tuyaDevice?.localKey || ""
                            color: "white"
                            placeholderText: "Introduce la clave local"
                            onTextChanged: {
                                updateButton.enabled = controller.validateDeviceUpdate(enabled.checked, deviceType.currentValue, localKey.text);
                            }
                        }

                        Button {
                            id: updateButton
                            text: "Actualizar"
                            enabled: false
                            onClicked: {
                                controller.updateDevice(enabled.checked, deviceType.currentValue, localKey.text);
                                updateButton.enabled = false;
                            }
                        }
                    }
                }

                // Mensaje si no hay controller
                Item {
                    visible: controller === undefined
                    Layout.fillWidth: true

                    Text {
                        text: "Esperando conexión con el dispositivo..."
                        color: "gray"
                        font.pixelSize: 16
                    }
                }
            }
        }
    }
}
