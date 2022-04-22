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
    debug(`AUX array ${f}`);
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
    debug(`FILL array ${array}`);
}

function fix() {
    task.push({
        type: "fill",
        array: data, // fills the array with itself to fix lost or extra points
        whole: true // the data is whole
    });
    debug("FIX");
}

function toggle(index, shrink = false, single = false) {
    if (index > max || index < 0) return false;
    task.push({
        type: "toggle",
        index: index, // Index of the toggle
        shrink: shrink, // Whether the processor should increment
        single: single // Whether the toggle is to be single
    });
    debug(`TOGGLE index ${index} (${shrink ? "shrunk" : "unshrunk"}, ${single ? "single" : "stacked"})`);
}

function detog() {
    task.push({
        type: "detog"
    });
    debug("DETOG");
}

function hop(length = 1) {
    task.push({
        type: "hop",
        length: length // How many processor clocks will be skipped
    });
    debug(`HOP ${length} tasks`);
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
    debug(`SWAP ${a} (${data[b]}) with ${b} (${data[a]})`);
}

function log(s, isSort = true) {
    g = 0;
    if (isSort) console.log(`Animating ${s}`);
    task.push({
        type: "report",
        sort: s // a string holding the name of the sort
    });
    debug(`LOG ${s}`);
}

function reset() {
    data = sequence(0, max);
    task.push({
        type:"reset",
    })
    debug(`RESET`);
}

function insert(index, value) {
    if (index > max || index < 0) return false;
    data[index] = value;
    task.push({
        type: "jenga",
        index: index, // index of point that will be replaced
        value: value // value that will take its place
    });
    debug(`INSERT ${value} at ${index}`);
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
    debug(`SLIDE ${index} to ${newdex}`);
}

function halt(length = CFG.wait_time) {
    task.push({
        type: "wait",
        length: length // wait time, in frames
    });
    debug(`HALT ${length} frames`);
}

function sound(value, layer = 0, isIndex = true) {
    if(isIndex) value = data[value];
    task.push({
        type: "sound",
        value: value,
        layer: layer,
    })
}
function soundmulti(array, isIndex = true) {
    for(let i = 0; i < array.length; i++) {
        if(isIndex) array[i] = data[array[i]]
        task.push({
            type: "sound",
            value: array[i],
            layer: i,
        })
    }
}


function debug(txt) {
    if (CFG.log_all_tasks)
        console.log(`Task ${g++}: ${txt}`)
}
