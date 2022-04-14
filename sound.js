function toggleMute() {
    audio.muted = !audio.muted;
    audio.context.resume();
}

function playSound(values) {
    stopAllSounds();
    if(!audio.muted && audio.focus) {
    for(let i = 0; i < values.length; i++) {
        if(values[i] < 0) continue;
        var options = {
            volume: audio.muted ? 0 : audio.volume,
            type: audio.oscillator,
            frequency: audio.frequency.lower,
            attack: 0,
            release: 0,
        }
        // This makes sure the volume remains consistent, no matter how many sounds are being played at once
        if(CFG.compress_sound) 
            options.volume /= values.length;
        if(CFG.sound_mode === SoundMode.frequency) {
            var f = (audio.frequency.upper - audio.frequency.lower) / max;
            f = f / max;
            options.frequency = audio.frequency.lower + ((audio.frequency.upper - audio.frequency.lower) / max) * values[i];
        }

        audio.queue[i] = new Pizzicato.Sound({
            source: 'wave',
            options,
        })
        audio.queue[i].play();
    }
    }
}


function stopAllSounds() {
    for(w of audio.queue) w.stop();
    audio.queue = [];
}

$(window).blur(function(e) {
    stopAllSounds();
});
