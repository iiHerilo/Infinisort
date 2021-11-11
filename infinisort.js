// The ID of the canvas objcet which will hold the visualizer
const canvasID = 'canv'; 
// The radius of the circle (should be relative to canvas height &/or width
const radius = 575;
const currentID = 'current';

var sortcount = 5;
var max;
var spd;
var cx;
var cy;
var ctx;
var data; // Data that is sorted
var vdat; // Data that is displayed on screen
var cols; // Color codes for each data value
var task; // Queue of animation tasks
var mode; // Queue of modes
var togs; // All toggled slice positions
var sing; // Seperate single toggle position.

function init(amount, speed) {
    // Set the number of items & the visualization speed
    max = amount;
    spd = speed;
    // Initialize all of the arrays
    data = [];
    vdat = [];
    cols = [];
    task = []; 
    mode = []; 
    togs = [];
    // Fill the data, visual data, and color arrays.
    for (var i = 0; i < max; i++) {
        // data and vdata should be identical at first.
        data[i] = i + 1;
        vdat[i] = i + 1;
        // This array is filled before anything happens so the draw function
        // doesn't have to get every single color every time it's called, 
        // especially since the method to do so is probably inneficient.
        cols[i] = color(i + 1);
    }
    // Get the X & Y values of the center of the circle
    cx = document.getElementById('canv').getAttributeNode('width').value / 2;
    cy = document.getElementById('canv').getAttributeNode('height').value / 2;
    // Draw on the next animation frame
    window.requestAnimationFrame(draw);
}
// Draw a pie chart consisting of each point in the vdat array to the canvas.
function draw() {
    // Get a boolean for detoggling failsafe.
    boal = false;
    // Get the contxet of the canvas object
    ctx = document.getElementById(canvasID).getContext('2d');
    // Repeat as many times as the speed calls for (adaptive depending on the 
    // number of items.)
    for (let i = 0; i < (spd * Math.ceil(max / 250)); i++) {
        // Process the first task in the array.
        process(task[0]);
        // Toggle tasks have a "shrink" boolean, which keeps the iterator of
        // this loop from incrementing, slightly shrinking the sort time.
        if (task[0].type === "toggle") 
            if (task[0].shrink === true) 
                i--;
        // If a detog has happened, activate the failsafe variable
        if (task[0].type === "detog") 
            boal = true;
        // Remove the first item from the task list.
        task.shift();
        
    }
    // Render every pieslice from the visual data array.
    for (let j = 0; j < vdat.length; j++) {
        ctx.beginPath();
        ctx.fillStyle = cols[vdat[j]];
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, rotateA(j), rotateB(j), false);
        ctx.lineTo(cx, cy);
        ctx.fill();
    }
    // Render every toggled location in the toggles array.
    for (let i = 0; i < togs.length; i++) {
        ctx.beginPath();
        ctx.fillStyle = "#000000";
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, rotateA(togs[i]), rotateB(togs[i]), false);
        ctx.moveTo(cx, cy);
        ctx.fill();
    }
    // Render the toggled location from the single-toggle variable
    if (sing >= 0) {
        ctx.beginPath();
        ctx.fillStyle = "#000000";
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, rotateA(sing), rotateB(sing), false);
        ctx.moveTo(cx, cy);
        ctx.fill();
    }
    // If a detog has been processed, force the toggle variables to clear.
    if (boal) cleartogs();
    // Draw again on the next animation frame.
    window.requestAnimationFrame(draw);
}
// Process a task object.
function process(obj) {
    try {
        switch (obj.type) {
            case "swap": // Swap tasks swap vdat positions.
                var temp;
                temp = vdat[obj.a];
                vdat[obj.a] = vdat[obj.b];
                vdat[obj.b] = temp;
                break;
            case "switch": // Switch tasks run new algorithms based on the mode
                sing = -1; // Also clear potential toggles
                switch (mode.shift()) {
                    default:
                    case 0:
                        halt(250);
                        break;
                    case 1:
                        shuffle();
                        break;
                    case 2:
                        selection();
                        break;
                    case 3:
                        insertion();
                        break;
                    case 4:
                        bubble();
                        break;
                    case 5:
                        cocktail();
                        break;
                    case 6:
                        quicksort();
                        break;
                }
                break;
            case "report": // Report to the console and designated spot in the 
                           // document which algorithm is being run 
                console.log(obj.sort);
                document.getElementById(currentID).innerHTML = obj.sort;
                break;
            case "toggle": // Toggle a slice, making it appear selected
                if (obj.single) 
                    sing = obj.index;
                else 
                    togs.push(obj.index);
                break;
            case "detog": // Clear the array of toggled slices
                togs = [];
                break;
            case "wait": // Wait a few frames.
            case "default":
                break;
        }
    } catch (error) { // Catch an error if there is no more tasks to process
        // Shuffle the array.
        addMode(1);
        detog();
        // Momentarily wait.
        addMode(0);
        //addMode(6); /* For debugging specific algorithms */
        // Sort the array with a random sorting algorithm.
        addMode(2 + Math.floor(Math.random() * sortcount));
        detog();
        // Momentarily wait.
        addMode(0);

    }
}

// Get the rotations of various parts of a given slice position
function rotateA(index) {
    return ((3 * Math.PI) / 2) + (theta() * index);
}
function rotateB(index) {
    return rotateA(index) + theta();
}
// Get the angle of a slice (only dependant on number of items)
function theta() {
    return (2 * Math.PI) / max;
}

// This is used as the maximum number a color channel can reach
function rgb() {return Math.floor(max / 3);}
// Get the color of a value
function color(n) {
    // Get variables to represent the values of the red green and blue channels
    var r = rgb(),
        g = 0,
        b = 0;
    // Cycle through each color in the Hue circle
    for (var i = 0; i < n * 2; i++) {
             if (r === rgb() && g  <  rgb() && b === 0)     g++;
        else if (r  >  0     && g === rgb() && b === 0)     r--;
        else if (r === 0     && g === rgb() && b  <  rgb()) b++;
        else if (r === 0     && g  >  0     && b === rgb()) g--;
        else if (r  <  rgb() && g === 0     && b === rgb()) r++;
        else if (r === rgb() && g === 0     && b  >  0)     b--;
        
    }
    // Divide each channel by the max, then multiply it by 255 (max in hex)
    r = Math.floor((r / rgb()) * 255);
    g = Math.floor((g / rgb()) * 255);
    b = Math.floor((b / rgb()) * 255);
    // Return the hex value of the color
    return "#" + ns(r.toString(16))+ns(g.toString(16))+ns(b.toString(16));
}
// makes sure a string has 2 characters, adding a 0 if it only has 1
function ns(s) {switch (s.length) {case 1:return "0" + s;case 2:return s;default:return ns(s.substr(0, 1));}}

// Add a switch task
function addSwitch() {
    task.push({
        "type": "switch"
    });
}
// Add a mode change
function addMode(a) {
    mode.push(a);
    addSwitch();
}
// Add a toggle task
function toggle(index, shrink, single = false) {
    task.push({
        "type": "toggle",
        "index": index,
        "shrink": shrink,
        "single": single
    });
}
// Add a detoggle task
function detog() {
    task.push({
        "type": "detog"
    });
}
// Clear all toggles
function cleartogs() {
    togs = [];
    sing = -1;
}
// I might use this later idk
function skip(length) {
    task.push({
        "type": "skip",
        "length": length
    });
}
// Swap two items in the data array, then add a swap task.
function swap(a, b) {
    a = Math.floor(a);
    b = Math.floor(b);
    var temp = data[a];
    data[a] = data[b];
    data[b] = temp;
    task.push({
        "type": "swap",
        "a": a,
        "b": b
    });
}
// Add a report task
function log(s) {
    task.push({
        "type": "report",
        "sort": s
    });
}
// Add a certain number of wait tasks
function halt(length) {
    for (var i = 0; i < length; i++) {
        task.push({
            "type": "wait"
        });
    }
}
// Shuffle the array.
function shuffle() {
    log("Shuffling...");
    addSwitch();
    for (var i = 0; i < data.length; i++) {
        var ran = Math.floor(Math.random() * data.length);
        toggle(i, false);
        toggle(ran, false);
        swap(i, ran);
        if (i % 2 === 0) detog();
    }
    detog();
}
// Sort Via Selection Sort.
function selection() {
    log("Selection Sort");
    var a, b, c;
    for (a = 0; a < max; a++) {
        toggle(a);
        b = a;
        for (c = a; c < max; c++) {
            if (data[b] > data[c]) {
                detog();
                b = c;
                toggle(b, true);
            }
            toggle(c, false, true);

        }
        swap(b, a);
        detog();
    }
}
function insertion() {
    log("Insertion Sort");
    var a, b;
    for (a = 0; a < max; a++) {
        for (b = a; b > 0 && data[b - 1] > data[b]; b--) {
            swap(b, b - 1);
            detog();
            toggle(b, true);
        }
    }
    detog();
}
function bubble() {
    log("Bubble Sort");
    var a, b, c;
    a = max;
    do {
        b = 0;
        for (c = 1; c < a; c++) {
            if (data[c - 1] > data[c]) {
                swap(c - 1, c);
                detog();
                b = c;
                toggle(c, true);
            }
        }
        a = b;
    } while (a > 1);
}
function cocktail() {
    log("Cocktail Shaker Sort");
    var dir = true,
        swapped = true,
        start = 0,
        end = max - 1;

    while (swapped) {
        swapped = false;
        for (let i = start; i < end; i++) {
            if (data[i] > data[i + 1]) {
                swapped = true;
                swap(i, i + 1);
                detog();
                toggle(i, true);
            }
        }
        if (!swapped) break;
        end--;
        for (let i = end; i >= start; i--) {
            if (data[i] > data[i + 1]) {
                swapped = true;
                swap(i, i + 1);
                detog();
                toggle(i, true);
            }
        }
        start++;
    }
    detog();
}
function quicksort(low, high) {
    function partition(low, high) {
        var pivot = data[high];
        var i = (low - 1);

        for (let j = low; j <= high - 1; j++) {
            if (data[j] < pivot) {
                i++;
                toggle(i, false);
                toggle(j, false);
                swap(i, j);
                detog();
            }
        }
        swap(i + 1, high);
        return i + 1;
    }

    function quick(low, high) {
        if (low < high) {
            var par = partition(low, high);
            quick(low, par - 1);
            quick(par + 1, high);
        }
    }
    log("Quicksort");
    quick(0, max - 1);
}