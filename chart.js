// assumes it is running in a context with config.json

function PieChart() {
    this.draw = function (ctx, d) {
        if(d.max === null || d.max < 0) d.max = d.data.length;
        //console.log("Drawing pie chart with ctx " + ctx.toString());
        ctx.clearRect(0, 0, d.dimensions.width, d.dimensions.height);
        // Render a pieslice
        function slice(index, fill) {
            arc(rotate(index, 0), rotate(index, 1), fill);
        }
        // Render an arc
        function arc(rotateA, rotateB, fill) {
            ctx.beginPath();
            ctx.fillStyle = fill;
            ctx.moveTo(d.center.x, d.center.y);
            ctx.arc(d.center.y, d.center.y, d.radius, rotateA, rotateB, config.counterclockwise);
            ctx.moveTo(d.center.x, d.center.y);
            ctx.fill();
        }

        function rotate(index, wide = 0) {
            return ((3 * Math.PI) / 2) + (theta() * (index + wide));
        }
        // Get the angle of a slice (only dependant on number of items)
        function theta() {
            return (2 * Math.PI) / d.max;
        }
        for (let i = 0; i < d.max; i++) {
            slice(i, d.colors[d.data[i]]);
        }
        if (d.toggles !== null && d.toggles.length !== 0 && !config.disable_toggles) {
            for (let i = 0; i < d.toggles.length; i++) {
                if(d.toggles[i] >= 0 && d.toggles[i] < d.max)
                    slice(d.toggles[i], "#000000");
            }
        }
        if (d.singletog !== null && d.singletog >= 0 && d.singletog < d.max) {
            slice(d.singletog, "#000000");
        }

    }
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