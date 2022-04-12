function toggleMute() {
    audio.muted = !audio.muted;
    audio.muted ? audio.context.resume() : audio.context.pause();
}

function playSound(values) {
    for(w of audio.queue) w.stop();
    audio.queue = [];

    for(let i = 0; i < values.length; i++) {
        if(values[i] < 0) continue;
        var options = {
            volume: audio.volume,
            type: audio.oscillator,
            frequency: audio.frequency.lower,
        }
        // This makes sure the volume remains consistent, no matter how many sounds are being played at once
        if(CFG.compress_sound) 
            options.volume /= i;
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

