import QtQuick 2.15
import QtQuick.Controls 2.15
import QtQuick.Layouts 1.15

ApplicationWindow {
    visible: true
    width: 360
    height: 320
    title: "Tuya Razer Settings"
    color: "#1e1e1e"

    property string lightingMode: "Canvas"
    property string forcedColor: "#009bde"
    property string turnOff: "Turn device off"
    property string shutDownColor: "#8000FF"
    property int ledCount: 4

    ColumnLayout {
        anchors.centerIn: parent
        spacing: 16

        // MODO DE ILUMINACIÓN
        RowLayout {
            spacing: 10
            Label {
                text: "Modo de iluminación:"
                color: "#ffffff"
                font.pointSize: 11
            }
            ComboBox {
                Layout.fillWidth: true
                model: ["Canvas", "Forced"]
                currentIndex: lightingMode === "Canvas" ? 0 : 1
                onCurrentIndexChanged: lightingMode = currentIndex === 0 ? "Canvas" : "Forced"
            }
        }

        // COLOR FORZADO
        RowLayout {
            visible: lightingMode === "Forced"
            spacing: 10
            Label {
                text: "Color forzado:"
                color: "#ffffff"
                font.pointSize: 11
            }
            Rectangle {
                width: 24
                height: 24
                color: forcedColor
                border.color: "#888"
                border.width: 1
                MouseArea {
                    anchors.fill: parent
                    onClicked: colorDialog.open()
                }
            }
            ColorDialog {
                id: colorDialog
                title: "Selecciona un color forzado"
                currentColor: forcedColor
                onAccepted: forcedColor = colorDialog.color
            }
        }

        // NÚMERO DE LEDS
        RowLayout {
            spacing: 10
            Label {
                text: "Número de LEDs:"
                color: "#ffffff"
                font.pointSize: 11
            }
            SpinBox {
                id: ledCountSpinBox
                from: 1
                to: 120
                value: ledCount
                stepSize: 1
                onValueChanged: ledCount = value
            }
        }

        // COMPORTAMIENTO AL APAGAR
        RowLayout {
            spacing: 10
            Label {
                text: "Al apagar:"
                color: "#ffffff"
                font.pointSize: 11
            }
            ComboBox {
                id: shutdownSelector
                Layout.fillWidth: true
                model: ["Do nothing", "Single color", "Turn device off"]
                currentIndex: model.indexOf(turnOff)
                onCurrentIndexChanged: turnOff = model[currentIndex]
            }
        }

        // COLOR DE APAGADO
        RowLayout {
            visible: shutdownSelector.currentText === "Single color"
            spacing: 10
            Label {
                text: "Color de apagado:"
                color: "#ffffff"
                font.pointSize: 11
            }
            Rectangle {
                width: 24
                height: 24
                color: shutDownColor
                border.color: "#888"
                border.width: 1
                MouseArea {
                    anchors.fill: parent
                    onClicked: shutdownColorDialog.open()
                }
            }
            ColorDialog {
                id: shutdownColorDialog
                title: "Selecciona un color de apagado"
                currentColor: shutDownColor
                onAccepted: shutDownColor = shutdownColorDialog.color
            }
        }
    }
}
