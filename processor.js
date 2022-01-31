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

function Sorter(data) {
    this.shuffle = function() {
        data.f.log("Shuffling...");
        data.f.aux(-1, true, "No Aux");
        data.f.addSwitch();
        for (let i = 0; i < data.d.length; i++) {
            var ran = Math.floor(Math.random() * data.d.length);
            data.f.toggle(i, false);
            data.f.toggle(ran, false);
            data.f.swap(i, ran);
            data.f.sound(data.d[i]);
            if (i % 2 === 0) data.f.detog();
        }
        data.f.detog();
    };
    this.reverse = function(asMode = true) {
        if (asMode) {
            data.f.log("Reversing...");
            data.f.addSwitch();
        }
        for (let i = 0; i < Math.floor(data.length / 2); i++) {
            data.f.detog();
            data.f.swap(i, data.max - i - 1);
            data.f.sound(data.d[i]);
            data.f.sound(data.d[data.max - 1 - i]);
            data.f.toggle(i);
            data.f.toggle(data.max - i - 1);
        }
        data.f.detog();
    };
    this.verify = function() {
        data.f.detog();
        while (data.length > data.max) data.d.pop();
        for (let i = 0; i < data.max; i++) {
            data.f.toggle(i, false, true);
            data.f.insert(i, i + 1);
            if (i % 4 === 0) {
                data.f.hop(-1);
                data.sound(data.d[i]);
            } else {
                data.f.hop(0);
            }
        }
    };
    const bases = {
        quicksort: function(mode = 0) {
            mode = mode === -1 ? Math.round(Math.random() * 4) : mode;

            function partition(low, high) {
                var pivot;
                switch (mode) {
                    case 1:
                        data.f.swap(low, high);
                        break;
                    case 2:
                        data.f.swap(Math.round((high - low) / 2.0) + low, high);
                        break;
                    case 3:
                        data.f.swap(Math.round(Math.random() * (high - low)) + low, high);
                        break;
                }
                pivot = high;
                var i = (low - 1);
                data.f.aux(pivot, true, "Pivot");
                for (let j = low; j <= high - 1; j++) {
                    if (data.d[j] < data.d[pivot]) {
                        i++;
                        data.f.toggle(i, false);
                        data.f.toggle(j, false);
                        data.f.swap(i, j);
                        data.f.sound(i);
                        data.f.sound(j);
                        data.f.detog();
                    }
                }
                data.f.swap(i + 1, high);
                return i + 1;
            }

            function quick(low, high) {
                if (low < high) {
                    var par = partition(low, high);
                    quick(low, par - 1);
                    quick(par + 1, high);
                }
            }
            var piv;
            switch (mode) {
                case 1:
                    piv = "Left";
                    break;
                case 2:
                    piv = "Middle";
                    break;
                case 3:
                    piv = "Random";
                    break;
                default:
                    piv = "Right";
                    break;
            }
            data.f.log("Quicksort " + piv + " Pivot");
            quick(0, data.max - 1);
            data.f.detog();
        },
        heapsort: function(b) {},
        radixlsd: function(base) {}
    };
    this.sort = {
        selection: function() {
            data.f.log("Selection Sort");
            var a, b, c;
            for (a = 0; a < data.max; a++) {
                data.f.toggle(a);
                b = a;
                for (c = a; c < data.max; c++) {
                    if (data.d[b] > data.d[c]) {
                        data.f.detog();
                        b = c;
                        data.f.toggle(b, true);
                        data.f.aux(b, true, "Selection");
                    }

                    if (c % 4 === 1) {
                        data.f.sound(data.d[c]);
                        data.f.toggle(c, false, true);
                    }
                }
                data.f.swap(b, a);
                data.f.detog();
            }
        },
        dualselect: function() {
            data.f.log("Dual Selection Sort");
            for (let i = 0, j = data.max - 1; i < j; i++, j--) {
                data.f.detog();
                data.f.toggle(i, true);
                data.f.toggle(j, true);
                var minv = data.d[i];
                var maxv = data.d[i];
                var mini = i;
                var maxi = i;

                for (var k = i; k <= j; k++) {
                    data.f.toggle(k, !(k % 3 === 2), true);
                    if (data.d[k] > maxv) {
                        maxv = data.d[k];
                        maxi = k;
                    } else if (data.d[k] < minv) {
                        minv = data.d[k];
                        mini = k;
                    }
                    data.f.detog();
                    data.f.toggle(mini, true);
                    data.f.toggle(maxi, true);
                    data.f.sound(minv);
                    data.f.sound(maxv);
                    data.f.aux([mini, maxi], false, "Selections");
                }
                data.f.swap(i, mini);
                if (data.d[mini] === maxv)
                    data.f.swap(j, mini);
                else
                    data.f.swap(j, maxi);
            }
        },
        insertion: function() {
            data.f.log("Insertion Sort");
            var a, b;
            for (a = 0; a < data.max; a++) {
                for (b = a; b > 0 && data.d[b - 1] > data.d[b]; b--) {
                    data.f.swap(b, b - 1);
                    data.f.detog();
                    data.f.toggle(b, true);
                    data.f.sound(data.d[b]);
                    data.f.aux([b - 1, b], false, "Comparison");
                }
            }
            data.f.detog();
        },
        binaryins: function() {
            data.f.log("Binary Insertion Sort");

            function search(item, low, high) {
                if (high <= low)
                    return (item >= data.d[low]) ? (low + 1) : low;
                var mid = Math.floor((low + high) / 2);
                data.f.toggle(mid);
                data.f.sound(mid);
                if (item === data.d[mid])
                    return mid + 1;
                if (item > data.d[mid])
                    return search(item, mid + 1, high);
                return search(item, low, mid - 1);
            }
            for (let i = 1; i < data.max; i++) {
                data.f.detog();
                let j = i - 1;
                let x = data.d[i];

                let pos = search(x, 0, j);

                while (j >= pos) {
                    data.f.insert(j + 1, data.d[j]);
                    data.f.toggle(j, true, true);
                    j--;
                }
                data.f.insert(j + 1, x);
            }
            data.f.detog();
        },
        bubble: function() {
            data.f.log("Bubble Sort");
            var a, b, c;
            a = data.max;
            do {
                b = 0;
                for (c = 1; c < a; c++) {
                    if (data.d[c - 1] > data.d[c]) {
                        data.f.swap(c - 1, c);
                        data.f.sound(data.d[c]);
                        data.f.hop((c % 3 === 0 ? 0 : 3));
                        data.f.detog();
                        b = c;
                        data.f.toggle(c, true);
                    }
                }
                a = b;
            } while (a > 1);
        },
        optbubble: function() {
            data.f.log("Optimized Bubble Sort");
            var swapped;
            for (let i = 0; i < data.max; i++) {
                swapped = false;
                for (let j = 0; j < data.max - i - 1; j++) {
                    if (data.d[j] > data.d[j + 1]) {
                        data.f.swap(j, j + 1);
                        if (j % 3 === 0) {
                            data.f.sound(data.d[j]);
                            data.f.hop(0);
                        } else {
                            data.f.hop(3);
                        }
                        swapped = true;
                        data.f.detog();
                        data.f.toggle(j, true);
                    }
                }
                if (!swapped) break;
            }
            data.f.detog();
        },
        cocktail: function() {
            data.f.log("Cocktail Shaker Sort");
            var dir = true,
                swapped = true,
                start = 0,
                end = data.max - 1;

            while (swapped) {
                swapped = false;
                for (let i = start; i < end; i++) {
                    if (data.d[i] > data.d[i + 1]) {
                        swapped = true;
                        data.f.swap(i, i + 1);
                        if (i % 3 === 0) {
                            data.f.sound(data.d[i]);
                            data.f.hop(0);
                        } else {
                            data.f.hop(3);
                        }
                        data.f.detog();
                        data.f.toggle(i, true);
                    }
                }
                if (!swapped) break;
                end--;
                for (let i = end; i >= start; i--) {
                    if (data.d[i] > data.d[i + 1]) {
                        swapped = true;
                        data.f.swap(i, i + 1);
                        if (i % 3 === 0) {
                            data.f.sound(data.d[i]);
                            data.f.hop(0);
                        } else {
                            data.f.hop(3);
                        }
                        data.f.detog();
                        data.f.toggle(i, true);
                    }
                }
                start++;
            }
            data.f.detog();
        },
        quicksort: function() {
            bases.quicksort(-1);
        },
        quicksortMaxPivot: function() {
            bases.quicksort(0);
        },
        quicksortMinPivot: function() {
            bases.quicksort(1);
        },
        quicksortMedPivot: function() {
            bases.quicksort(2);
        },
        quicksortRanPivot: function() {
            bases.quicksort(3);
        },
        quicksortDualPivot: function() {
            data.f.log("Quicksort Dual Pivot");

            function partition(low, high) {
                if (data.d[low] > data.d[high]) data.f.swap(low, high);
                var j = low + 1;
                var g = high - 1;
                var k = low + 1;
                var p = data.d[low];
                var q = data.d[high];
                data.f.aux([low, high], false, "Pivots");
                while (k <= g) {
                    data.f.detog();
                    data.f.toggle(j, false);
                    data.f.toggle(g);
                    data.f.toggle(k, false);
                    if (data.d[k] < p) {
                        data.f.swap(k, j);
                        data.f.sound(data.d[k]);
                        data.f.sound(data.d[j]);
                        j++;
                    } else if (data.d[k] >= q) {
                        while (data.d[g] > q && k < g)
                            g--;
                        data.f.swap(k, g);
                        data.f.sound(data.d[k]);
                        data.f.sound(data.d[g]);
                        g--;
                        if (data.d[k] < p) {
                            data.f.swap(k, j);
                            data.f.sound(data.d[j]);
                            j++;
                        }
                    }
                    k++;
                }
                j--;
                g++;
                data.f.swap(low, j);
                data.f.swap(high, g);
                data.f.sound(data.d[low]);
                data.f.sound(data.d[high]);
                data.f.sound(data.d[j]);
                data.f.sound(data.d[g]);
                return [j, g];
            }

            function quick(low, high) {
                if (low < high) {
                    var piv = partition(low, high);
                    quick(low, piv[0] - 1);
                    quick(piv[0] + 1, piv[1] - 1);
                    quick(piv[1] + 1, high);
                }
            }
            quick(0, data.max);
            data.f.detog();
        },
        stableQuicksort: function() {
            // i know this code looks bad this took me forever to do
            data.f.log("Stable Quicksort");

            function quick(arr, low, high) {
                try {
                    if (arr === []) return arr;
                    if (arr.length <= 1) return arr;
                    arr[1];
                } catch (error) {
                    return arr;
                }
                var mid = Math.floor(arr.length / 2.0);
                var piv = arr[mid];
                var sml = [],
                    grt = [];
                for (let i = 0; i < arr.length; i++) {
                    data.f.detog();
                    data.f.toggle(low + i);
                    data.f.sound(data.d[low + i]);
                    var val = arr[i];
                    data.f.toggle(val, true);
                    if (val < piv)
                        sml.push(val);
                    else if (val > piv)
                        grt.push(val);
                    data.f.auxmulti([sml, grt], "Partitions");
                }
                var ans = [];
                var s1 = sml.slice();
                var g1 = grt.slice();
                var lft = [];
                var rgt = [];
                var j = low;
                for (let i = 0; i < sml.length; i++) {
                    data.f.toggle(j, true, true);
                    data.f.insert(j++, sml[i]);
                    data.f.sound(sml[i]);
                    s1.shift();
                    data.f.auxmulti([s1, g1], "Partitions");
                }
                data.f.insert(j++, piv);
                for (let i = 0; i < grt.length; i++) {
                    data.f.toggle(j, true, true);
                    data.f.insert(j++, grt[i]);
                    data.f.sound(grt[i]);
                    g1.shift();
                    data.f.auxmulti([s1, g1], "Partitions");
                }
                if (sml.length > 1) {
                    lft = quick(sml, low, sml.length);
                }
                for (let i = 0; i < lft.length; i++) {
                    ans.push(lft[i]);
                }
                ans.push(piv);
                if (grt.length > 1) {
                    rgt = quick(grt, low + sml.length + 1, high);
                }
                for (let i = 0; i < rgt.length; i++) {
                    ans.push(rgt[i]);
                }
                return ans;
            }
            quick(data.d, 0, data.max);
            data.f.detog();
        },
        heapsort: function() {},
        maxheap: function() {},
        minheap: function() {},
        ternaryheapsort: function() {},
        oddeven: function() {},
        gnome: function() {},
        optgnome: function() {},
        comb: function() {},
        circle: function() {},
        cycle: function() {},
        lsdRadixBase2: function() {},
        lsdRadixBase4: function() {},
        lsdRadixBase8: function() {},
        lsdRadixBase10: function() {},
        lsdRadixBase16: function() {},
        lsdRadixBase32: function() {},
        shell: function() {},
        counting: function() {},
        merge: function() {},
        mergeInPlace: function() {}
    };
    this.allfuncs = [
        this.sort.selection,
        this.sort.dualselect,
        this.sort.insertion,
        this.sort.binaryins,
        this.sort.bubble,
        this.sort.optbubble,
        this.sort.cocktail,
        this.sort.quicksort,
        this.sort.quicksortMaxPivot,
        this.sort.quicksortMinPivot,
        this.sort.quicksortMedPivot,
        this.sort.quicksortRanPivot,
        this.sort.quicksortDualPivot,
        this.sort.stableQuicksort
    ];
    this.exclude = [
        this.sort.quicksort,
        this.sort.heapsort,
        this.sort.lsdRadixBase2,
        this.sort.lsdRadixBase16,
        this.sort.lsdRadixBase32
    ];
    this.addRandomSorts = function(amnt) {
        var prv = -1;
        var neu;
        var applied = [];
        for (let i = 0; i < amnt; i++) {
            data.f.halt();
            this.shuffle();
            data.f.halt();
            do neu = Math.floor(Math.random() * this.allfuncs.length);
            while ((!config.enable_backtoback && neu === prv) ||
                this.exclude.includes(this.allfuncs[neu]) ||
                applied.includes[this.allfuncs[neu]]);
            prv = neu;
            this.allfuncs[prv]();
            if (!config.enable_repeats) applied.push(neu);
            data.f.detog();
        }
    };
    this.addAllSorts = function() {
        for (let i = 0; i < this.allfuncs.length; i++) {
            data.f.halt();
            this.shuffle();
            data.f.halt();
            if (!this.exclude.includes(this.allfuncs[i])) {
                this.allfuncs[i]();
            }
        }
    };
}