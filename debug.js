var debugItems = [
    
]

function average(arr, fixed = true) {
    t = 0;
    for(let i = 0; i < arr.length; i++) 
        t += arr[i];
    t = parseFloat(t / arr.length);
    return fixed ? t.toFixed(2) : t;
}

function buildDebugMenu() {
    updateDebugInfo();
    var s = "<h2>DEBUG</h2>\n<table>";
    for(let i = 0; i < debugItems.length; i++) {
        s += `<tr><th id="dbgLabel${i}"></th><td id="dbgValue${i}"></td></tr>\n`;
    }
    s += "</table>"
    element(ID.debug).innerHTML = s;
    updateDebugMenu();
}

function updateDebugInfo() {
    debugItems = [
        {
            label: "Time Between Frames",
            value: average(DBG.frame_time, true) + "ms",
        },
        {
            label: "Framerate",
            value: (1000/average(DBG.frame_time, false)).toFixed(2) + "FPS",
        },
        {
            label: "Amount of toggles",
            value: togs.length + (sing < 0 ? 0 : 1),
        },
        {
            label: "Singletog Location",
            value: sing,
        },
        {
            label: "Tasks in queue",
            value: task.length,
        },
        {
            label: "Tasks per frame",
            value: average(DBG.tasks_per_frame),
        },
        {
            label: "Current Sort",
            value: DBG.current,
        },
        {
            label: "Sound Values",
            value: DBG.sounds.join("<br>")
        },
        {
            label: "",
            value: "",
        },
        {
            label: "",
            value: "",
        },
        {
            label: "",
            value: "",
        },
    ]
    
}
function updateDebugMenu() {
    for(let i = 0; i < debugItems.length; i++) {
        element(`dbgLabel${i}`).innerHTML = debugItems[i].label;
        element(`dbgValue${i}`).innerHTML = debugItems[i].value;
    }
    updateDebugInfo();
}

/*
        {
            label: ,
            value: ,
        },
*/
