/*** GLOBAL CONFIG ***/
const CFG = {
    version: "v1.2.3",
    debug_enabled: false,
    show_globals: false,
    detailed_console: true,
    show_aux: true,
    enable_repeats: false,
    enable_backtoback: false,
    disable_toggles: false,
    auto_mode: AutoMode.random,
    auto_manual: 15, // index of the sort that will be played in manual mode
    wait_time: 75, // in frames
    amnt_per_cycle: 10, // amount of sorts
    processor_speed: 6, // determines how many tasks get processed in any given frame
    processor_threshold: 250, // does something similar i think
    aux_dimensions: {
        height: 100,
        width: 100
    },
    aux_center: {
        x: 50,
        y: 50
    },
    rad_tolerance: 5, // How many pixels shorter the radius should be to not be cut off by canvas edges
    default_array_length: 126,
    counterclockwise: false,
    verify_after_sort: true,
    qs_directional: true, // true: Right, Middle, Left     false: Maximum, Median, Minimum     (related to quicksort)
    log_all_tasks: false,
    sound_mode: SoundMode.frequency,
    compress_sound: true, // i wouldnt reccomend turning this off
};
const DBG = {
    frame_time: [],
    tasks_per_frame: [],
    current: "None",
};
/*** ELEMENT IDS ***/
const ID = {
    main: "maincanv",
    aux: "auxcanv",
    current: "current",
    auxsub: "auxsub",
    ver: "version",
    auxzone: "auxiliary",
    debug: "debugmnu",
    title: "title",
    copyright: "copyright",
};
/*** AUDIO SETTINGS ***/
const audio = {
    context: Pizzicato.context,
    muted: true, // audio must be muted as the page loads or the audio will not work
    frequency: {
        lower: 146.83,
        upper: 1174.66,
    },
    volume: 0.5,
    oscillator: "square",
    queue: [],
    focus: true, // whether the tab is currently focused, so that the sound doesnt break when you click off the tab
}

var mainC; // Main Canvas
var auxlC; // Auxiliary Canvas
var cols = []; // Available Colors
var data = []; // Main Data
var vdat = []; // Visual Data
var auxd = []; // Auxiliary Data
var max; // n; array size
var togs = []; // Toggled indexes
var sing = -1; // Singular Toggles
var detaux = false; // Whether the aux should be drawn when enabled
var detogg = false; // Whether the toggles should be cleared
var task = []; // Task Queue
var snds = []; // Sounds in a frame
var dimensions = {
    h: -1, // height
    w: -1, // width
    x: -1, // center x
    y: -1, // center y
    r: -1, // radius
};

function dbgShiftInWindow(index, key, range = CFG.processor_speed * 10) {
    DBG[key].push(index);
    if(DBG[key].length >= range)
        DBG[key].shift();
}