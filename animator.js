function process() {
    for(let i = 0; i < (CFG.processor_speed * Math.ceil(max / CFG.processor_threshold)); i++) {
        if(task.length > 0) {
            var tsk = task.shift();
            switch(tsk.type) {
                case "swap": 
                    var temp = vdat[tsk.a];
                    vdat[tsk.a] = vdat[tsk.b];
                    vdat[tsk.b] = temp;
                    break;
                case "report": 
                    setCurrentText(tsk.sort);
                    if(tsk.sort !== "Shuffling...")
                        console.log(`Playing ${tsk.sort}`);
                    break;
                case "toggle": 
                    if(tsk.single) 
                        sing = tsk.index;
                    else
                        togs.push(tsk.index);
                    break;
                case "detog": 
                    detogg = true;
                    break;
                case "jenga": 
                    vdat[tsk.index] = tsk.value;
                    break;
                case "aux": 
                    element(ID.auxsub).innerHTML = tsk.text;
                    if(tsk.sing) {
                        auxd = [];
                        auxd.push(tsk.index);
                    }
                    else if(tsk.nun) 
                        auxd = [-1];
                    else 
                        auxd = tsk.index;
                    
                    break;
                case "slide": 
                    function s(a,b) {
                        var t = vdat[a];
                        vdat[a] = vdat[b];
                        vdat[b] = t;
                    }
                    var b = (tsk.oi <= tsk.ni);
                    for(let i = tsk.oi; b ? (i < tsk.ni) : (i > tsk.ni); b ? i++ : i--) 
                        s(i, b ? (i + 1) : (i - 1));
                    break;
                case "fill": 
                    if(tsk.whole) 
                        vdat = tsk.array;
                    else
                        for(let j = 0; j < tsk.array.length  && j < data.max; j++)
                            vdat[j] = tsk.array[j];
                    break;
                case "wait": 
                    if(tsk.length > 0) {
                        task.unshift({type: "wait", length: tsk.length-1});
                        i = 9999;
                    }
                    break;
                case "sound": break;
            }
            switch(tsk.type) {
                case "toggle" :
                    if(CFG.disable_toggles || tsk.shrink) --i;
                    break;
                case "aux":
                    i--;
                    break;
                case "hop":
                    i -= tsk.length;
                    break;
            }
        }
        else return false
    }
    return true;
}