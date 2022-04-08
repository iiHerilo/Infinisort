var debugItems = [
    
]

function average(arr) {
    console.log(arr);
    t = 0;
    for(let i = 0; i < arr.length; i++) 
        t += arr[i];
    console.log("total:" + t);
    return parseFloat(t / arr.length).toFixed(2);
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
            label: "Show Aux Visual",
            value: CFG.show_aux,
        },
        {
            label: "Time Between Frames",
            value: average(DBG.frame_time) + "ms",
        },
        {
            label: "Amount of toggles",
            value: togs.length + (sing != -1 ? 1 : 0),
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