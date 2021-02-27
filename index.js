#!/usr/bin/env node

const fs = require('fs');
const pkg = require('./package.json');
const log = require('yalm');
const environmentVariablesPrefix = pkg.name.replace(/[^a-zA-Z\d]/, '_').toUpperCase();
const config = require('yargs')
    .env(environmentVariablesPrefix)
    .usage(pkg.name + ' ' + pkg.version + '\n' + pkg.description + '\n\nUsage: $0 [options]')
    .describe('verbosity', 'Possible values: "error", "warn", "info", "debug"')
    .describe('prefix', '')
    .describe('mqtt-url', 'mqtt broker url. See https://github.com/mqttjs/MQTT.js#connect-using-a-url')
    .describe('alsa-card')
    .describe('alsa-mixer')
    .alias({
        h: 'help',
        v: 'verbosity',
        u: 'mqtt-url'
    })
    .default({
        prefix: 'dersimn/SoundPi',
        'mqtt-url': 'mqtt://127.0.0.1',
        'alsa-card': 'default'
    })
    .demandOption([
        'alsa-mixer'
    ])
    .version()
    .help('help')
    .argv;
const Yatl = require('yetanothertimerlibrary');
const MqttSmarthome = require('mqtt-smarthome-connect');
const alsaMonitor = require('alsa-monitor');
const alsaVolume = require('alsa-volume');

// Parse arguments
log.setLevel(config.verbosity);
log.info(pkg.name + ' ' + pkg.version + ' starting');
log.debug('loaded config:', config);
log.debug('ENV Prefix:', environmentVariablesPrefix);

log.info('mqtt trying to connect', config.mqttUrl);

const mqtt = new MqttSmarthome(config.mqttUrl, {
    logger: log,
    will: {topic: config.prefix + '/online', payload: 'false', retain: true}
});
mqtt.connect();

mqtt.on('connect', () => {
    log.info('mqtt connected', config.mqttUrl);
    mqtt.publish(config.prefix + '/online', true, {retain: true});
});

mqtt.on('close', () => {
    log.warn('mqtt closed ' + config.mqttUrl);
});

mqtt.on('error', error => {
    log.error('mqtt error', error);
});

alsaMonitor.volume.on('change', () => {
    const volume = alsaVolume.getVolume(config.alsaCard, config.alsaMixer);

    log.debug('alsa <', volume);
    mqtt.publish(config.prefix + '/status/volume', volume);
});

mqtt.subscribe(config.prefix + '/set/volume', (_, payload) => {
    if (typeof payload === 'object') {
        if ('val' in payload && typeof payload.val === 'number') {
            const volume = payload.val;

            log.debug('mqtt <', volume);
            setVolume(volume);
        }
    } else if (typeof payload === 'number') {
        const volume = payload;

        log.debug('mqtt <', volume);
        setVolume(volume);
    }
});

function setVolume(volume) {
    log.debug('alsa >', volume);
    alsaVolume.setVolume(config.alsaCard, config.alsaMixer, volume);
}
