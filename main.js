var config = {
    /* If the getJSON function isn't usable just paste the contents 
     * of the config.json file into this object.
     */
};

// The chart that will be used in the visualizer. Can be anything if it fits this format 
const chart = new PieChart();
// Generates data such as the array of numbers and colors
const datagen = new DataGen();
// Handles sorting algorithms
const sorter = new Sorter();
// Processes Animation tasks
const processor = new Processor();
// Loads the configuration file
$(document).ready(function() {
    $.getJSON('config.json', function(data) {
        config = data;
        checkModules();
        run();
    });
});
var data = {
    d: [], // main data array
    colors: [], // colors associated with values
    v: [], // visaul data 
    max: 0, // how big the data array is
    togs: [], // all toggled indexes
    sing: -1, // single-toggles
    aux: [], // auxiliary visual data array
    ctx: null, //  main canvas context
    atx: null, //  aux canvas context
    detog: false, // clear toggles on next frame
    task: [] // all animation tasks
};
var dim = {
    /*
     * h: height,
     * w: width,
     * x: center x,
     * y: center y,
     * r: radius
     */
};

function getElement(id) {
    return document.getElementById(id);
}

function setCurrentText(s) {
    getElement(config.ID.current).innerHTML = s;
}

function checkModules() {
    console.debug(PieChart);
    console.debug(DataGen);
    console.debug(Sorter);
    console.debug(Processor);
    console.debug(config);
}

function run() {
    console.log("run process started.");
    data.max = config.default_array_length;
    data.d = datagen.getArray(data.max);
    data.colors = datagen.getColorArray(data.max);
    data.v = data.d;
    data.ctx = getElement(config.ID.main).getContext('2d');
    data.atx = getElement(config.ID.aux).getContext('2d');
    console.info('Data initialized:')
    console.info(data);
    var _h = getElement(config.ID.main).getAttributeNode('height').value,
        _w = getElement(config.ID.main).getAttributeNode('width').value;
    dim = {
        h: _h,
        w: _w,
        x: _w / 2,
        y: _h / 2,
        r: ((_w / 2 + _h / 2) / 2) - config.rad_tolerance
    };
    //dim.r = (dim.w / 2 + dim.h / 2) / 2 - config.rad_tolerance;
    console.info('Dimensions initialized:');
    console.info(dim);
    getElement(config.ID.ver).innerHTML = config.version;
    
    console.log("LEN " + data.v.length );
    console.log("Initialization successful.");
    draw();
    
}
var ink = 0

function draw() {
    ink++;
    //console.log("Draw called");
    processor.process(data);
    chart.draw(data.ctx, {
        data: data.v,
        max: data.max,
        colors: data.colors,
        toggles: data.togs,
        singletog: data.sing,
        dimensions: {
            width: dim.w,
            height: dim.h
        },
        center: {
            x: dim.x,
            y: dim.y
        },
        radius: dim.r,
        cc: false
    });
    chart.draw(data.atx, {
        data: data.aux,
        max: -1,
        colors: data.colors,
        toggles: [],
        singletog: -1,
        dimensions: config.aux_dimensions,
        center: config.aux_center,
        radius: config.aux_dimensions.height - config.rad_tolerance,
        cc: false
    });
    if (data.detog) {
        data.detog = false;
        data.togs = [];
        data.sing = -1;
    }
    window.requestAnimationFrame(draw);
}