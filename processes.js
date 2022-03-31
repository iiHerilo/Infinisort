let g = 0;

function addSwitch() {
    task.push({
        type: "switch"
    });
}

function aux(index, single, subtitle, nun = false) {
    var f = [];
    try {
        index[1];
        f = index;
    } catch (error) {
        f[0] = index;
    }
    for(let i = 0; i < f.length; i++) 
        f[i] = data[f[i]];
    
    if (CFG.show_aux) {
        task.push({
            type: "aux",
            index: f, // the color indexes of each value
            sing: single, // whether the aux is a single color
            text: subtitle, // The subtitle that will be displayed above the aux visualization
            nun: nun,
        });
    }
    debug("Adding a AUX task");
}

function auxmulti(arr, subtitle) {
    if (CFG.show_aux) {
        var f = [];
        for (let i = 0; i < arr.length; i++) {
            try {
                for (let j = 0; j < arr[i].length; j++) {
                    f.push(arr[i][j]);
                }
            } catch (err) {};
        }
        aux(f, false, subtitle);
    }
    debug("---- aux was auxmulti ----");
}

function fill(array) {
    task.push({
        type: "fill",
        array: array, // the data that will be filled
        whole: array.length === data.length // if the data is equal in length to prev
    });
    debug("Adding a FILL task");
}

function fix() {
    task.push({
        type: "fill",
        array: data, // fills the array with itself to fix lost or extra points
        whole: true // the data is whole
    });
    debug("Adding a FIX task");
}

function toggle(index, shrink = false, single = false) {
    if (index > max || index < 0) return false;
    task.push({
        type: "toggle",
        index: index, // Index of the toggle
        shrink: shrink, // Whether the processor should increment
        single: single // Whether the toggle is to be single
    });
    debug("Adding a TOGGLE task");
}

function detog() {
    task.push({
        type: "detog"
    });
    debug("Adding a DETOG task");
}

function hop(length = 1) {
    task.push({
        type: "hop",
        length: length // How many processor clocks will be skipped
    });
    debug("Adding a HOP task");
}

function swap(a, b) {
    if (a > max || a < 0 || b > max || b < 0) return false;
    a = Math.floor(a);
    b = Math.floor(b);
    var temp = data[a];
    data[a] = data[b];
    data[b] = temp;
    task.push({
        type: "swap",
        a: a, // loccation a that will be swapped with b
        b: b // location b that will be swapped with a
    });
    debug("Adding a SWAP task");
}

function log(s) {
    g = 0;
    if (s !== "Shuffling...") console.log(`Animating ${s}`);
    task.push({
        type: "report",
        sort: s // a string holding the name of the sort
    });
    debug("Adding a LOG task");
}

function insert(index, value) {
    if (index > max || index < 0) return false;
    data[index] = value;
    task.push({
        type: "jenga",
        index: index, // index of point that will be replaced
        value: value // value that will take its place
    });
    debug("Adding a INSERT task");
}

function slide(index, newdex) {
    if (index > max || index < 0 || newdex > max || index < 0) return false;
    function s(a,b) {
        var t = data[a];
        data[a] = data[b];
        data[b] = t;
    }
    var b = (index <= newdex);
    for(let i = index; b ? (i < newdex) : (i > newdex); b ? i++ : i--) 
        s(i, b ? (i + 1) : (i - 1));
    task.push({type:"slide",oi:index,ni:newdex})
    debug("Adding a SLIDE task");
}

function halt(length = CFG.wait_time) {
    task.push({
        type: "wait",
        length: length // wait time, in frames
    });
    debug("Adding a HALT task");
}

function sound(index) {
    // To be implemented...
}


function debug(txt) {
    //console.log(`${g++}: ${txt}`)
}