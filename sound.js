function toggleMute() {
    audio.muted = !audio.muted;
    audio.context.resume();
    element(ID.mute).innerHTML = audio.muted ? "Unmute" : "Mute";
}



function playSound(values) {
    try {
        if(values.length == 0) {
            resetAudio();
        }
        else if(!audio.muted && values.length > 0) {
            for(let i = 0; i < audio.queue.length; i++) {
                    if(typeof values[i] !== "undefined") {
                        if (CFG.sound_mode === SoundMode.frequency) 
                            audio.queue[i].frequency = round(audio.frequency.lower + ((audio.frequency.upper - audio.frequency.lower) / max) * (values[i] + 1), values[i]);
                        audio.queue[i].volume = audio.volume;
                        audio.queue[i].play();
                    }
                    else {
                        audio.queue[i].volume = 0;
                        audio.queue[i].stop();
                    }
            }
            dbgShiftInWindow(`[${values.join(", ")}]`, "sounds", 6);
            console.log(values);
            //audio.group.play();
        }
        
    } catch (e) {
        console.error(e);
    }
}

function resetAudio() {
    audio.group.stop();
    audio.group = new Pizzicato.Group();
    audio.group.addEffect(new Pizzicato.Effects.Compressor());
    for(let i = 0; i < CFG.sound_queue_length; i++) {
        audio.queue[i] = new Pizzicato.Sound({
            source: 'wave',
            options: {
                volume: 0,
                type: audio.oscillator,
                frequency: audio.frequency.lower,
                attack: 0.0,
                release: 0.1,
            },
        });
        audio.group.addSound(audio.queue[i]);
    }
}


function stopAllSounds() {
    resetAudio();
}

$(window).blur(function(e) {
    stopAllSounds();
});


function round(i, j) {
    return i.toFixed(2);
}