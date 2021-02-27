#!/bin/ash

# Allow further customization via ENV variables
: ${MQTT_BASETOPIC:="SoundPi"}
: ${MQTT_STATUS_TOPIC:="${MQTT_BASETOPIC}/status"}
: ${MQTT_MAINTENANCE_TOPIC:="${MQTT_BASETOPIC}/maintenance"}
: ${MQTT_USER:=""}
: ${MQTT_PASSWORD:=""}
: ${MQTT_ID:="${MQTT_BASETOPIC}"}

DEFAULT_MQTT_SERVER="10.1.1.50"
DEFAULT_LAST_SEEN_UPDATE_PERIOD_S=2

MQTT_SERVER=$DEFAULT_MQTT_SERVER
LAST_SEEN_UPDATE_PERIOD_S=$DEFAULT_LAST_SEEN_UPDATE_PERIOD_S

while true
do
  CURRENT_TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")

  mosquitto_pub -u $MQTT_USER -P $MQTT_PASSWORD -h $MQTT_SERVER -i $MQTT_BASETOPIC -t "SoundPi/maintenance/Livingroom/lastseen" -m "$(date -d "${CURRENT_TIMESTAMP}" +%s)" -r
  mosquitto_pub -u $MQTT_USER -P $MQTT_PASSWORD -h $MQTT_SERVER -i $MQTT_BASETOPIC -t "SoundPi/status/Livingroom/asound" -m "$(cat /proc/asound/card1/pcm0p/sub0/status)"

  sleep $LAST_SEEN_UPDATE_PERIOD_S
done