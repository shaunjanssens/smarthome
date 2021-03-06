# Smarthome server

## Prerequirements

* Git, Node & npm
* Mosquitto Broker

## Installation

* Open terminal
* Install Smart home with these commands

```
cd /home/pi
git clone https://github.com/shaunjanssens/smarthome Smarthome
cd Smarthome/server && npm install
```

* Setup Smart home server as a service with these commands

```
sudo cp smarthome.service /lib/systemd/system/smarthome.service
sudo chmod u+rwx /lib/systemd/system/smarthome.service
sudo systemctl daemon-reload
sudo systemctl enable smarthome # if you want to start the server at boot
```

## Config

Copy `config/config.json.example` to `config/config.json`. Fill in all fields
and add your devices and sensors.

## Usage

* Start service: `sudo service smarthome start`
* Stop service: `sudo service smarthome stop`
* Check status: `sudo service smarthome status`
