function init() {
    console.info("CONFIG: %o", CFG);
    max = CFG.default_array_length;
    data = sequence(0, max);
    colors = colors(max);
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
}

function draw() {
    var good = process();
    PieChart(mainC, {
        data: vdat,
        max: null,
        colors: colors,
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
            colors: colors,
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
