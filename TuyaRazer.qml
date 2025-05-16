import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.15

Item {
    width: 400
    height: 300

    property alias ledCount: ledSlider.value
    property color selectedColor: Qt.rgba(redSlider.value / 255, greenSlider.value / 255, blueSlider.value / 255, 1)

    ColumnLayout {
        anchors.centerIn: parent
        spacing: 20

        Text {
            text: "Configuración de Tira LED"
            font.bold: true
            font.pixelSize: 20
            Layout.alignment: Qt.AlignHCenter
        }

        // Slider para cantidad de LEDs
        RowLayout {
            spacing: 10
            Layout.alignment: Qt.AlignLeft

            Text {
                text: "Cantidad de LEDs:"
                width: 140
            }

            Slider {
                id: ledSlider
                from: 1
                to: 100
                stepSize: 1
                value: 4
                Layout.fillWidth: true
            }

            Text {
                text: ledSlider.value.toFixed(0)
                width: 30
                horizontalAlignment: Text.AlignHCenter
            }
        }

        // Sliders de color (R, G, B)
        ColumnLayout {
            spacing: 5

            RowLayout {
                Text { text: "Rojo:"; width: 50 }
                Slider {
                    id: redSlider
                    from: 0; to: 255; value: 255
                    Layout.fillWidth: true
                }
                Text { text: redSlider.value.toFixed(0); width: 30 }
            }

            RowLayout {
                Text { text: "Verde:"; width: 50 }
                Slider {
                    id: greenSlider
                    from: 0; to: 255; value: 255
                    Layout.fillWidth: true
                }
                Text { text: greenSlider.value.toFixed(0); width: 30 }
            }

            RowLayout {
                Text { text: "Azul:"; width: 50 }
                Slider {
                    id: blueSlider
                    from: 0; to: 255; value: 255
                    Layout.fillWidth: true
                }
                Text { text: blueSlider.value.toFixed(0); width: 30 }
            }
        }

        Rectangle {
            width: 100
            height: 40
            color: selectedColor
            border.color: "black"
            border.width: 1
            radius: 4
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
                console.log("Color seleccionado: " + selectedColor)
                console.log("Cantidad de LEDs: " + ledSlider.value)
                // Aquí se puede emitir una señal o actualizar el backend JS
            }
        }
    }
}
