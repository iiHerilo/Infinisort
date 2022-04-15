function toggleMute() {
    audio.muted = !audio.muted;
    audio.context.resume();
    element(ID.mute).innerHTML = audio.muted ? "Unmute" : "Mute";
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
        if(CFG.sound_mode === SoundMode.frequency) 
            options.frequency = audio.frequency.lower + ((audio.frequency.upper - audio.frequency.lower) / max) * (values[i] + 1);

        audio.queue[i] = new Pizzicato.Sound({
            source: 'wave',
            options,
        })
        audio.group.addSound(audio.queue[i]);
    }
    audio.group.play();
    }
}


function stopAllSounds() {
    audio.group.stop();
    for(w of audio.queue) {
        audio.group.removeSound(w);
    }
    audio.queue = [];
}

$(window).blur(function(e) {
    stopAllSounds();
});
