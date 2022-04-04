function init() {
    element(ID.main).style.height = element(ID.main).getAttributeNode('height').value;
    element(ID.main).style.width = element(ID.main).getAttributeNode('width').value;
    window.addEventListener('resize', clamp)
    clamp();
    console.info("CONFIG: %o", CFG);
    max = CFG.default_array_length;
    data = sequence(0, max);
    cols = colors(max);
    vdat = data;
    mainC = element(ID.main).getContext('2d');
    auxlC = element(ID.aux).getContext('2d');
    auxlC.moveTo(0,0);
    auxlC.lineTo(100, 100);
    auxlC.stroke();
    dimensions.h = element(ID.main).getAttributeNode('height').value,
    dimensions.w = element(ID.main).getAttributeNode('width').value;
    dimensions.x = dimensions.w/2;
    dimensions.y = dimensions.h/2;
    dimensions.r = ((dimensions.x + dimensions.y) / 2) - CFG.rad_tolerance;
    element("version").innerHTML = CFG.version;
    halt(CFG.wait_time);
    draw();
    console.info(window.innerHeight);
    console.info(window.innerWidth)
}

function draw() {
    var good = process();
    PieChart(mainC, {
        data: vdat,
        max: null,
        colors: cols,
        toggles: togs,
        singletog: sing,
        dimensions: {width: dimensions.w, height: dimensions.h},
        center: {x: dimensions.x, y: dimensions.y},
        radius: dimensions.r,
        log: false,
        nun: false,
        tru: max,
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
            log: true,
            nun: detaux,
            tru: max,
        })

    element(ID.auxzone).style.display = detaux ? "none" : "block";

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

function clamp() {
    var wh = window.innerHeight;
    var ww = window.innerWidth;
    var calcHeight = window.getComputedStyle(element(ID.main)).getPropertyValue('height');
    calcHeight = parseInt(calcHeight.substring(0, calcHeight.length-2));

    if (wh < ww) {
        element(ID.main).style.height = `${wh - 300}px`;
        element(ID.main).style.width = `${wh - 300}px`;
        console.log(`${wh - 300}px`)
    }
    else if (calcHeight > ww){
        element(ID.main).style.height = `auto`;
        element(ID.main).style.width = `auto`;
    }

    element();
}

window.onresize = clamp;