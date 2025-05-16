import QtQuick 2.15
import QtQuick.Controls 2.15

Item {
    id: root
    width: 600
    height: 800
    visible: true

    Rectangle {
        anchors.fill: parent
        color: "#1e1e1e"

        Column {
            anchors.centerIn: parent
            spacing: 20

            Text {
                text: "¡Interfaz cargada correctamente!"
                font.pixelSize: 20
                color: "white"
            }

            Button {
                text: "Probar"
                onClicked: console.log("Botón presionado")
            }
        }
    }
}
