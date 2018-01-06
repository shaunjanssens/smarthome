# Smart home

With Smart home you can turn on your lights, close your blinds and control the
inside temperature.

[Live version](https://smarthome-9d4f6.firebaseapp.com/)

## Components

Smart home consists of four parts. The Arduino nodes, the central hub, the React
app and the iOS app.

### Nodes (/nodes)

Each node consists of a NodeMCU microcontroller and platform dependent outputs
or inputs such as relays, motors, pushbuttons, temperature and humidity sensors
and more. There is a separate Arduino IDE file for each type.

### Central hub (/server)

Every change in Firebase is detected by a central hub. This hub will identify
the change and process it correctly. Automations are also controlled by this
hub.

### React app (/react-app)

The React web app is connected to the Firebase database. Each output is
controlled by changing it's value in Firebase and sensors are read every time
there is a change. Automations are also managed by the app.

### iOS app (/ios-app)

There is a basic iOS app that loads the webapp in a Webkit webview.
