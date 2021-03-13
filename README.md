
- Syncs ALSA volume (same volume slider as in `alsamixer`) with MQTT
- Publishes state of device to MQTT usually from `/proc/asound/card0/pcm0p/sub0/status`

Use this to react to changes in volume or to change the ALSA volume by external events.

## Topics

```
dersimn/SoundPi/online → true

dersimn/SoundPi/status/device-in-use → {
      "val": true,
      "state": "RUNNING"
    }

dersimn/SoundPi/status/volume → 21

dersimn/SoundPi/set/volume ← 42
```

## Install

    apt install build-essential git libasound2-dev

    git clone https://github.com/dersimn/alsa2mqtt
    cd alsa2mqtt
    npm i


## Usage

See `node index --help`

```
alsa2mqtt 0.0.2
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

Example:

    node index -v debug -u mqtt://10.1.1.100 -m Line -s /proc/asound/card1/pcm0p/sub0/status


### Install as systemd service

Copy [`alsa2mqtt.service`](rootfs/etc/systemd/system/alsa2mqtt.service) to `/etc/systemd/system/alsa2mqtt.service`, and edit parameters in `ExecStart`, then:

    systemctl daemon-reload
    systemctl enable alsa2mqtt.service 
    systemctl start alsa2mqtt.service


## Credits

- [alsa-monitor](https://github.com/mlaurijsse/alsa-monitor-node)