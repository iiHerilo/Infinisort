var ldmd = 0;
function PieChart(ctx, d) {
    if (d.max === null || d.max < 0) d.max = d.data.length;
    for(let i = 0; i < d.data.length; i++) {
        while(d.data[i] >= d.tru) {
            d.data[i] -= d.tru;
            console.warn(`${d.data[i] + d.tru} >= ${d.tru}! changed to ${d.data[i]}`)
        }
        while(d.data[i] < 0) {
            d.data[i] += d.tru;
            console.warn(`${d.data[i] - d.tru} < ${0}! changed to ${d.data[i]}`)
        }
    }
    //if(d.log) console.log("Drawing pie chart with data %o", d.data);
    ctx.clearRect(0, 0, d.dimensions.width, d.dimensions.height);
    if(d.nun) return false;
    // Get the angle of a slice (only dependant on number of items)
    function theta() {return (2 * Math.PI) / d.max;}
    // Render an arc
    function arc(rotateA, rotateB, fill) {
        ctx.beginPath();
        ctx.fillStyle = fill;
        ctx.moveTo(d.center.x, d.center.y);
        ctx.arc(d.center.y, d.center.y, d.radius, rotateA, rotateB, CFG.counterclockwise);
        ctx.moveTo(d.center.x, d.center.y);
        ctx.fill();
    }
    function rotate(index, wide = 0) {
        return ((3 * Math.PI) / 2) + (theta() * (index + wide));
    }
    // Render a pieslice
    function slice(index, fill) {
        arc(rotate(index, 0), rotate(index, 1), fill);
    }
    for (let i = 0; i < d.max; i++) 
        if (d.data[i] !== "F")
            slice(i, d.colors[d.data[i]]);
        else
            slice(i, "#FFFFFF")
    if (d.toggles !== null && d.toggles.length !== 0 && !CFG.disable_toggles) 
        for (let i = 0; i < d.toggles.length; i++) 
            if (d.toggles[i] >= 0 && d.toggles[i] < d.max)
                slice(d.toggles[i], "#000000");
    if (d.singletog !== null && d.singletog >= 0 && d.singletog < d.max) 
        slice(d.singletog, "#000000");
    
    //console.log("end of chart");
}

/*
{
    data: int array,
    max: int
    colors: string array,
    toggles: int array,
    singletog: int,
    dimensions: {width: number, height: number},
    center: {x: number, y: number},
    radius: number,
    cc: boolean
}
 */