function init() {
    window.addEventListener('resize', clamp)
    clamp();
    resetAudio();
    console.info("CONFIG: %o", CFG);
    max = CFG.default_array_length;
    data = sequence(0, max);
    cols = colors(max);
    vdat = data;
    mainC = element(ID.main).getContext('2d');
    auxlC = element(ID.aux).getContext('2d');
    // these are different than the css/style attributes and are the actual dimensions of the canvas
    dimensions.h = element(ID.main).getAttributeNode('height').value,
    dimensions.w = element(ID.main).getAttributeNode('width').value;
    dimensions.x = dimensions.w/2;
    dimensions.y = dimensions.h/2;
    dimensions.r = ((dimensions.x + dimensions.y) / 2) - CFG.rad_tolerance;
    element("version").innerHTML = CFG.version;
    halt(CFG.wait_time);
    buildDebugMenu();
    draw();
}
var currentTime = Date.now();
var counter = 0;
var test = 0;
function draw() {
    counter++;
    dbgShiftInWindow(Date.now() - currentTime, 'frame_time');
    currentTime = Date.now();
    
    var good = process();
    PieChart(mainC, {
        data: vdat, // Data to be displayed
        max: null, // amount of items in the data (i dont use it)
        colors: cols, // the colors array
        toggles: togs, // the toggles array
        singletog: sing, // the singletog value
        dimensions: {width: dimensions.w, height: dimensions.h}, // chart dimensions
        center: {x: dimensions.x, y: dimensions.y}, // chart center
        radius: dimensions.r, // pie radius
        log: false, // whether the piechart should 
        nun: false, // Whether it should even be rendered
        tru: max, // true/global maximum
    })
    if(CFG.show_aux)
        PieChart(auxlC, {
            data: auxd,
            max: null,
            colors: cols,
            toggles: [],
            singletog: -1,
            dimensions: CFG.aux_dimensions,
            center: CFG.aux_center,
            radius: CFG.aux_dimensions.height/2 - CFG.rad_tolerance,
            log: false,
            nun: detaux,
            tru: max,
        })
    
    element(ID.auxzone).style.display = detaux ? "none" : "block";
    if(counter % 2 == 0) {
        updateDebugMenu();
        counter = 0;
    }

    
    playSound(snds);
    if(snds == []) {
        stopAllSounds();
    }

    if(detogg) {
        detogg = false;
        togs = [];
        sing = -1;
    }
    if(!good) {
        sort();
    }
    
    window.requestAnimationFrame(draw);
}

// makes sure the canvas is sized properly depending on the resolution and aspect ratio of its container window
function clamp() {
    var wh = window.innerHeight;
    var ww = window.innerWidth;
    var calcHeight = window.getComputedStyle(element(ID.main)).getPropertyValue('height');
    calcHeight = parseInt(calcHeight.substring(0, calcHeight.length-2)); // removes the unit (px) from the height

    if (wh < ww) {
        element(ID.main).style.height = `${wh - 325}px`;
        element(ID.main).style.width = `${wh - 325}px`;
    }
    else if (calcHeight > ww){
        element(ID.main).style.height = `auto`;
        element(ID.main).style.width = `auto`;
    }

    element();
}

window.onresize = clamp;

