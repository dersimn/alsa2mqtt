
- Syncs ALSA volume with MQTT
- Publishes state of device to MQTT usually from `/proc/asound/card0/pcm0p/sub0/status`

## Install

    apt install build-essential git libasound2-dev

    git clone
    cd alsa2mqtt
    npm i

## Usage

    node index --help

Example:

    node index -v debug -u mqtt://10.1.1.100 -m Line -s /proc/asound/card1/pcm0p/sub0/status

```
alsa2mqtt 0.0.1
Control ALSA volume from MQTT

Usage: index [options]

Options:
      --prefix                                      [default: "dersimn/SoundPi"]
      --alsa-card                                           [default: "default"]
      --polling-interval  polling interval (in ms) for status updates
                                                                 [default: 3000]
      --version           Show version number                          [boolean]
  -h, --help              Show help                                    [boolean]
  -v, --verbosity         Possible values: "error", "warn", "info", "debug"
  -u, --mqtt-url          mqtt broker url. See
                          https://github.com/mqttjs/MQTT.js#connect-using-a-url
  -m, --alsa-mixer                                                    [required]
  -s, --alsa-status-file                                              [required]
```

## Install as systemd service

Copy [`alsa2mqtt.service`](rootfs/etc/systemd/system/alsa2mqtt.service) to `/etc/systemd/system/alsa2mqtt.service`, and edit parameters in `ExecStart`, then:

    systemctl daemon-reload
    systemctl enable alsa2mqtt.service 
    systemctl start alsa2mqtt.service
