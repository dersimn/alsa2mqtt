const alsaMonitor = require("alsa-monitor");
const alsaVolume = require('alsa-volume');

alsaMonitor.volume.on("change", () => {
    console.log('New Volume', alsaVolume.getVolume('default', 'Line'));
});