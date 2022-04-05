/*** GLOBAL CONFIG ***/
const CFG = {
    version: "v1.2.2a",
    debug_enabled: false,
    show_globals: false,
    detailed_console: true,
    show_aux: true,
    enable_repeats: false,
    enable_backtoback: false,
    disable_toggles: false,
    auto_mode: AutoMode.random,
    auto_manual: 1,
    wait_time: 75,
    amnt_per_cycle: 10,
    processor_speed: 6,
    processor_threshold: 250,
    aux_dimensions: {
        height: 100,
        width: 100
    },
    aux_center: {
        x: 50,
        y: 50
    },
    rad_tolerance: 5,
    default_array_length: 126,
    counterclockwise: false,
    verify_after_sort: true,
    qs_directional: true,
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
var dimensions = {
    h: -1,
    w: -1,
    x: -1,
    y: -1,
    r: -1,
};
