// assumes it is running in a context with config.json

function Processor() {
    function debug(s) {
        //console.debug(s);
    }
    this.fluorish = function(data) {
        this.funcs = {
            addSwitch: function() {
                data.task.push({
                    type: "switch"
                });
                debug("Adding a SWITCH task");
            },
            aux: function(index, single, subtitle) {
                var f = [];
                try {
                    index[1];
                    f = index;
                } catch (error) {
                    f[0] = index;
                }
                if (config.show_aux) {
                    data.task.push({
                        type: "aux",
                        index: f, // the color indexes of each value
                        sing: single, // whether the aux is a single color
                        text: subtitle // The subtitle that will be displayed above the aux visualization
                    });
                }
                debug("Adding a AUX task");
            },
            auxmulti: function(arr, subtitle) {
                if (config.show_aux) {
                    var f = [];
                    for (let i = 0; i < arr.length; i++) {
                        try {
                            for (let j = 0; j < arr[i].length; j++) {
                                f.push(arr[i][j]);
                            }
                        } catch (err) {};
                    }
                    data.task.push({
                        type: "aux",
                        index: f,
                        sing: false, // the aux shouldn't be a single color with this function
                        text: subtitle
                    });
                }
                debug("Adding a AUXMULTI task");
            },
            fill: function(array) {
                data.task.push({
                    type: "fill",
                    array: array, // the data that will be filled
                    whole: array.length === data.d.length // if the data is equal in length to prev
                });
                debug("Adding a FILL task");
            },
            fix: function() {
                data.task.push({
                    type: "fill",
                    array: data.d, // fills the array with itself to fix lost or extra points
                    whole: true // the data is whole
                });
                debug("Adding a FIX task");
            },
            toggle: function(index, shrink, single = false) {
                data.task.push({
                    type: "toggle",
                    index: index, // Index of the toggle
                    shrink: shrink, // Whether the processor should increment
                    single: single // Whether the toggle is to be single
                });
                debug("Adding a TOGGLE task");
            },
            detog: function() {
                data.task.push({
                    type: "detog"
                });
                debug("Adding a DETOG task");
            },
            hop: function(length = 1) {
                data.task.push({
                    type: "hop",
                    length: length // How many processor clocks will be skipped
                });
                debug("Adding a HOP task");
            },
            swap: function(a, b) {
                a = Math.floor(a);
                b = Math.floor(b);
                var temp = data.d[a];
                data.d[a] = data.d[b];
                data.d[b] = temp;
                data.task.push({
                    type: "swap",
                    a: a, // loccation a that will be swapped with b
                    b: b // location b that will be swapped with a
                });
                debug("Adding a SWAP task");
            },
            log: function(s) {
                if (s !== "Shuffling...") console.log("Animating " + s);
                data.task.push({
                    type: "report",
                    sort: s // a string holding the name of the sort
                });
                debug("Adding a LOG task");
            },
            insert: function(index, value) {
                data.d[index] = value;
                data.task.push({
                    type: "jenga",
                    index: index, // index of point that will be replaced
                    value: value // value that will take its place
                });
                debug("Adding a INSERT task");
            },
            halt: function(length = config.wait_time) {
                data.task.push({
                    type: "wait",
                    length: length // wait time, in frames
                });
                debug("Adding a HALT task");
            },
            sound: function(index) {
                // To be implemented...
            }
        };
        var stuff = {
            f: this.funcs,
            d: data.d,
            max: data.max
        };
        // REQUIRES THE SORTER MODULE TO BE LOADED WHEREVER THE PROCSESOR IS CALLED
        var sorter = new Sorter(stuff);
        switch (config.auto_mode) {
            case 0:
                sorter.allfuncs[config.auto_manual]();
                break;
            case 1:
                sorter.addRandomSorts(config.amnt_per_random_cycle);
                break;
            case 2:
                sorter.addAllSorts();
                break;

        }
    };

    this.process = function(data) {
        //console.log("tasks being processed.");
        var frames = 0;
        for (let i = 0; i < (config.processor_speed * Math.ceil(data.max / config.processor_threshold)); i++) {
            frames++;
            if (data.task.length > 0) {
                var tsk = data.task.shift();
                // Process the data within
                switch (tsk.type) {
                    case "swap": {
                        var temp = data.v[tsk.a];
                        data.v[tsk.a] = data.v[tsk.b];
                        data.v[tsk.b] = temp;
                    }
                    break;
                case "report": {
                    setCurrentText(tsk.sort);
                    if (tsk.sort !== "Shuffling...")
                        console.log("Playing " + tsk.sort);
                    //console.log(data.v.length);
                }
                break;
                case "toggle": {
                    if (tsk.single)
                        data.stog = tsk.index;
                    else
                        data.togs.push(tsk.index);
                }
                break;
                case "detog": {
                    data.detog = true;
                    break;
                }
                break;
                case "jenga": {
                    data.v[tsk.index] = tsk.value;
                }
                break;
                case "aux": {
                    getElement(config.ID.auxsub).innerHTML = tsk.text;
                    if (tsk.sing)
                        data.auxd = [tsk.index];
                    else
                        data.auxd = tsk.index;
                }
                break;
                case "fill": {
                    if (tsk.whole)
                        data.v = tsk.array;
                    else
                        for (let j = 0; j < tsk.array.length && j < data.max; j++)
                            data.v[j] = tsk.array[j];
                }
                break;
                case "wait": {
                    if (tsk.length > 0) {
                        data.task.unshift({
                            type: "wait",
                            length: tsk.length - 1
                        });
                        i = 9999;
                    }
                }
                break;
                default:
                    break;
                }
                // Manipulate the processor task limit depending on certain variables
                switch (tsk.type) {
                    case "toggle":
                        if (config.disable_toggles || tsk.shrink) i--;
                        break;
                    case "aux":
                        i--;
                        break;
                    case "hop":
                        i -= tsk.length;
                        break;
                }
            } else {
                console.warn("No data in the task array! Fluorishing...")
                this.fluorish(data);
                i = 9999;
                console.info(data.task.length + " tasks added total.");
            }
        }
        console.debug(frames + " tasks processed this frame.");
    };
}

