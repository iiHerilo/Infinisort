// These are all of the available sorting algorithms
const include = [selection, dualselect, insertion, binaryins, bubble, optbubble,
    cocktail, qsmax, qsmin, qsmed, qsran, qsdual, qstable, maxheap, minheap,
    ternheap, oddeven, gnome, optgnome, comb, circle, cycle, shell,
    counting, mergesort, mergeip, lsdten,
];
// These algorithms are to be excluded. 
// Will cause a reroll when in random order, and will be skipped in linear order.
// Ignored in manual mode.
var exclude = [cycle];
// This is the index current sorting algorithm in the linear automode.
var currentSort = 0;

// 
function sort() {
    try {
        
    if (CFG.auto_mode === AutoMode.random) {
        var applied = []; // Here to stop repeats if disabled
        var prv = -1; // Here to stop back-to-backs if disabled
        var neu = -1; // ditto
        for (let i = 0; i < CFG.amnt_per_cycle; i++) {
            
            shuffle();
            halt(CFG.wait_time);
            do neu = Math.floor(Math.random() * include.length)
            while ((!CFG.enable_backtoback && neu === prv) || exclude.includes(include[neu]) || (applied.includes(neu) && !CFG.enable_repeats));
            prv = neu;
            include[prv]();
            if (!CFG.enable_repeats) applied.push(prv);
            detog();
            halt(CFG.wait_time);
        }
    }
    else if (CFG.auto_mode === AutoMode.linear) {
        shuffle();
        halt(CFG.wait_time);
        for(let i = 0; i < CFG.amnt_per_cycle; i++) {
            if (currentSort >= include.length) 
                currentSort = 0;
            if (!exclude.includes(include[currentSort])) 
                include[currentSort]();
            currentSort++;
        }
        halt(CFG.wait_time);
    }
    else if (CFG.auto_mode === AutoMode.manual) {
        shuffle();
        halt(CFG.wait_time);
        include[CFG.auto_manual]();
        halt(CFG.wait_time);
    }
    
    }
    catch(e) {console.error(e)} // This is here so that the whole page & animation doesn't stop in the event of an exception.
}

function testzone() {
    log("THE TESTING ZONE"); // it tests the things
    halt(100);
    for (let i = 0; i < max; i++) {
        swap(i, i - (i % 4 + 1));
    }
    for (let i = 0; i < max / 4; i++) {
        toggle(i + i * 1, true, false);
        toggle(i + i * 2, false, true);
        toggle(i + i * 4, false, false);
        detog();
    }
    for (let i = max - 1; i >= 0; i--) {
        slide(0, i);
    }
    for (let i = max; i >= 0; i--) {
        insert(i, max - i);
    }
    fix();

}

function shuffle(asMode = true) {
    // asMode should be false if this is being called in the context of another algorithm
    if (asMode) 
        reset(), log("Shuffling...", false), aux('F', true, "", true);

    for (let i = 0; i < max; i++) {
        var ran = Math.floor(Math.random() * max);
        toggle(i, false);
        toggle(ran, false);
        sound(i, 0);
        sound(ran, 1);
        swap(i, ran);
        if (i % 2 === 0) detog();
    }
    detog();
}

function reverse(asMode = true) {
    // asMode should be false if this is being called in the context of another algorithm
    if (asMode) 
        reset(), log("Reversing..."), aux('F', true, "", true);
    
    for (let i = 0; i < Math.floor(max / 2); i++) {
        detog();
        swap(i, max - i - 1);
        sound(i, 0);
        sound(max - i, 1);
        toggle(i);
        toggle(max - i - 1);
    }
    detog();
}

function verify() {
    // ill implement this later
}

// im not gonna comment on the algorithms, if you wanna learn about them use google


function selection() {
    log("Selection Sort");
    var a, b, c;
    for (a = 0; a < max; a++) {
        toggle(a);
        b = a;
        for (c = a; c < max; c++) {
            toggle(a, true)
            if (data[b] > data[c]) {
                detog();
                toggle(a);
                b = c;
                toggle(b, true, false);
                aux(b, true, "Selection")
            }
            toggle(c, false, true);
            sound(c, 0);
        }
        swap(a, b);
        detog();
    }
}

function dualselect() {
    log("Dual Selection Sort")
    for (let i = 0, j = max - 1; i < j; i++, j--) {
        detog();
        toggle(i, true);
        toggle(j, true);
        var minv = data[i];
        var maxv = data[i];
        var mini = i;
        var maxi = i;

        for (var k = i; k <= j; k++) {
            sound(k);
            toggle(k, !(k % 3 == 2), true);
            if (data[k] > maxv) {
                maxv = data[k];
                maxi = k;
            } else if (data[k] < minv) {
                minv = data[k];
                mini = k;
            }
            detog();
            toggle(mini, true);
            toggle(maxi, true);
            aux([mini, maxi], false, "Selections")
        }
        swap(i, mini);
        if (data[mini] === maxv) {
            swap(j, mini);
        } else {
            swap(j, maxi);
        }
    }
}

function insertion() {
    log("Insertion Sort")
    var a, b;
    for (a = 0; a < max; a++) {
        toggle(a);
        for (b = a; b > 0 && data[b - 1] > data[b]; b--) {
            sound(b, 0);
            sound(b-1, 1);
            swap(b, b - 1);
            detog();
            toggle(a);
            toggle(b, true);
            aux([b - 1, b], false, "Comparison");
        }
    }
    detog();
}

function binaryins() {
    log("Binary Insertion Sort")

    function search(item, low, high) {
        if (high <= low)
            return (item >= data[low]) ? (low + 1) : low;
        var mid = Math.floor((low + high) / 2);
        toggle(mid);
        sound(mid, 1);
        if (item == data[mid])
            return mid + 1;
        if (item > data[mid])
            return search(item, mid + 1, high);
        return search(item, low, mid - 1);
    }
    for (let i = 1; i < max; i++) {
        detog();
        let j = i - 1;
        let x = data[i]

        let pos = search(x, 0, j);
        toggle(i);
        while (j >= pos) {
            insert(j + 1, data[j]);
            toggle(j, true, true);
            sound(j);
            aux([x, j], false, "Comparison")
            j--;
        }
        insert(j + 1, x);
    }
    detog();
}

function bubble() {
    log("Bubble Sort");
    var a, b, c;
    a = max;
    do {
        b = 0;
        for (c = 1; c < a; c++) {
            if (data[c - 1] > data[c]) {
                sound(c);
                sound(c-1, 1);
                swap(c - 1, c);
                //hop((c % 3 === 0 ? 0 : 3)); // shortens the animation time
                //console.log("c%3=" + c%3 + " so hop " + (c % 3 === 0 ? 0 : 1))
                detog();
                b = c;
                toggle(c, true);
            }
        }
        a = b;
    } while (a > 1);
    detog();
}

function optbubble() {
    log("Optimized Bubble Sort");
    var swapped;
    for (let i = 0; i < max; i++) {
        swapped = false;
        for (let j = 0; j < max - i - 1; j++) {
            if (data[j] > data[j + 1]) {
                sound(j);
                sound(j+1, 1);
                swap(j, j + 1);
                //hop((j % 3 === 0 ? 0 : 3));
                swapped = true;
                detog();
                toggle(j, true);
            }
        }
        if (!swapped) break;
    }
    detog();
}

function cocktail() {
    log("Cocktail Sort")
    var dir = true,
        swapped = true,
        start = 0,
        end = max - 1;

    while (swapped) {
        swapped = false;
        for (let i = start; i < end; i++) {
            if (data[i] > data[i + 1]) {
                swapped = true;
                sound(i);
                sound(i+1, 1);
                swap(i, i + 1);
                hop((i % 3 === 0 ? 0 : 3));
                detog();
                toggle(i, true);
            }
        }
        if (!swapped) break;
        end--;
        for (let i = end; i >= start; i--) {
            if (data[i] > data[i + 1]) {
                swapped = true;
                sound(i);
                sound(i+1, 1);
                swap(i, i + 1);
                hop((i % 3 === 0 ? 0 : 3));
                detog();
                toggle(i, true);
            }
        }
        start++;
    }
    detog();
}

function quicksort(mode = 0) {
    // if the mode is -1 itll pick a random pivot
    mode = mode == -1 ? Math.round(Math.random() * 4) : mode;

    function partition(low, high) {
        var pivot;
        switch (mode) {
            case 1:
                swap(low, high);
                break;
            case 2:
                swap(Math.round((high - low) / 2.0) + low, high);
                break;
            case 3:
                swap(Math.round(Math.random() * (high - low)) + low, high);
                break;
        }
        pivot = high;
        var i = (low - 1);
        aux(pivot, true, "Pivot");
        //halt(100);

        for (let j = low; j <= high - 1; j++) {
            if (data[j] < data[pivot]) {
                i++;
                toggle(i, false);
                toggle(j, false);
                sound(i);
                sound(j, 1)
                swap(i, j);
                detog();
            }
        }
        swap(i + 1, high);
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
    var b = CFG.qs_directional;
    switch (mode) {
        case 1:
            piv = b ? "Left" : "Minimum";
            break;
        case 2:
            piv = b ? "Middle" : "Median";
            break;
        case 3:
            piv = "Random";
            break;
        default:
            piv = b ? "Right" : "Maximum";
            break;
    }
    log(`Quicksort ${piv} Pivot`);
    quick(0, max - 1);
    detog();
}

function qsmax() {
    quicksort(0);
}

function qsmin() {
    quicksort(1);
}

function qsmed() {
    quicksort(2);
}

function qsran() {
    quicksort(3);
}

function qsany() {
    quicksort(-1);
}

function qsdual() {
    log("Quicksort Dual Pivot")

    function partition(low, high) {
        if (data[low] > data[high]) swap(low, high);
        var j = low + 1;
        var g = high - 1;
        var k = low + 1;
        var p = data[low];
        var q = data[high];

        aux([low, high], false, "Pivots");

        while (k <= g) {
            detog();
            toggle(j, false);
            toggle(g);
            sound(j, 0);
            sound(g, 1);
            sound(k, 2);
            toggle(k, false);
            if (data[k] < p) {
                swap(k, j);
                j++;
            } else if (data[k] >= q) {
                while (data[g] > q && k < g)
                    g--;
                swap(k, g);
                g--;
                if (data[k] < p) {
                    swap(k, j);
                    j++;
                }
            }
            k++;
        }
        j--;
        g++;

        swap(low, j);
        swap(high, g);

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
    quick(0, max);
    detog();
}

function qstable() {
    // i know this code looks bad this took me forever to do
    log("Stable Quicksort");

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
            detog();
            toggle(low + i);
            var val = arr[i];
            toggle(val, true);
            soundmulti([low + i, val]);
            if (val < piv)
                sml.push(val);
            else if (val > piv)
                grt.push(val);
            auxmulti([sml, grt], "Partitions");
        }

        var ans = [];
        var s1 = sml.slice();
        var g1 = grt.slice();
        var lft = [];
        var rgt = [];

        var j = low;
        for (let i = 0; i < sml.length; i++) {
            toggle(j, true, true);
            sound(j);
            insert(j++, sml[i]);
            s1.shift();
            auxmulti([s1, g1], "Partitions");
        }
        insert(j++, piv);
        for (let i = 0; i < grt.length; i++) {
            toggle(j, true, true);
            sound(j)
            insert(j++, grt[i]);
            g1.shift();
            auxmulti([s1, g1], "Partitions");
        }
        if (sml.length > 1) 
            lft = quick(sml, low, sml.length);
        for (let i = 0; i < lft.length; i++) 
            ans.push(lft[i]);
        ans.push(piv);
        if (grt.length > 1) 
            rgt = quick(grt, low + sml.length + 1, high);
        for (let i = 0; i < rgt.length; i++) 
            ans.push(rgt[i]);
        

        return ans;
    }
    quick(data, 0, max);
    detog();
}

function heapsort(b = true) {
    function heap(n, i, b = true) {
        var tar = i;
        var lft = 2 * i + 1;
        var rgt = 2 * i + 2;
        toggle(lft, false);
        toggle(rgt, false);

        if (lft < n && data[lft] > data[tar] == b)
            tar = lft;
        if (rgt < n && data[rgt] > data[tar] == b)
            tar = rgt;

        toggle(tar, false);

        if (tar != i) {
            soundmulti([i, tar])
            swap(i, tar);
            detog();
            heap(n, tar, b);
        }
    }
    log(b ? "Max Heap Sort" : "Min Heap Sort");
    for (let i = Math.floor(max / 2) - 1; i >= 0; i--) {
        toggle(i, false);
        heap(max, i, b);
    }
    for (let i = max - 1; i >= 0; i--) {
        swap(0, i);
        heap(i, 0, b);
    }
    if (!b)
        reverse(false);

    detog();
}

function maxheap() {
    heapsort(true);
}

function minheap() {
    heapsort(false);
}

function anyheap() {
    heapsort(2 * Math.random() > 1);
}

function ternheap() {
    log("Ternary Heap Sort")

    function heap(i, n) {
        var top;
        var l = 3 * i + 1;
        var m = 3 * i + 2;
        var r = 3 * i + 3;
        if (l < n && data[l] > data[i])
            top = l;
        else
            top = i;
        if (m < n && data[m] > data[top])
            top = m;
        if (r < n && data[r] > data[top])
            top = r;
        detog();
        toggle(l);
        toggle(m);
        toggle(r);
        toggle(i);
        soundmulti([i, l, m, r]);
        if (top !== i) {
            swap(i, top);
            heap(top, n);
        }
    }
    for (let i = Math.floor(max / 3); i >= 0; i--)
        heap(i, max);
    var n = max;
    for (let i = n - 1; i > 0; i--) {
        swap(0, i);
        heap(0, --n);
    }
    detog();
}

function oddeven() {
    log("Odd-Even Sort")
    var srtd = false;
    while (!srtd) {
        srtd = true;
        for (let i = 1; i <= max - 2; i += 2) {
            if (data[i] > data[i + 1]) {
                toggle(i, true);
                sound(i)
                swap(i, i + 1);
                srtd = false;
                detog();
            }
        }
        for (let i = 0; i <= max - 2; i += 2) {
            if (data[i] > data[i + 1]) {
                toggle(i, true);
                sound(i);
                swap(i, i + 1);
                srtd = false;
                detog();
            }
        }
    }
}

function gnome() {
    log("Gnome Sort")
    var i = 0;
    // these two are here because for some reason this algorithm goes into an infinite loop sometimes.
    // the worst commplexity for this algorithm is O(n^2) so if it iterates that many times, it must be done
    // I would fix the problem at its root but i dont feel like doing that
    var iterations = 0;
    var cieling = max * max;
    while (i < max && iterations++ <= cieling) {
        sound(i);
        if (i === 0 || data[i] >= data[i - 1]) {
            toggle(i, false, true);
            i++;
            aux(data[i], true, "Comparison");
        } else {
            toggle(i, true, true);
            swap(i, i - 1);
            i--;
            aux([data[i], data[i - 1]], false, "Comparison");
        }
    }
    if(iterations++ <= cieling) {console.warn("Gnome Sort got stuck in an infinite loop! The algorithm has stopped.")}
    detog();
}

function optgnome() {
    log("Optimized Gnome Sort")

    function gno(bound) {
        for (let i = bound; i > 0 && data[i - 1] > data[i]; i--) {
            toggle(bound, true);
            soundmulti([i, i-1]);
            swap(i - 1, i);
            toggle(i - 1, false, true);
        }
    }
    for (let i = 0; i < max; i++) {
        toggle(i);
        gno(i);
        detog();
    }

}

function comb() {
    log("Comb Sort")

    function gap(g) {
        g = parseInt((g * 10) / 13, 10);
        if (g < 1)
            return 1;
        return g;
    }
    var g = max;
    var swp = true;

    while (g != 1 || swp) {
        g = gap(g);
        swp = false;

        for (let i = 0; i < max - g; i++) {
            toggle(i);
            toggle(i + g);
            soundmulti([i, i+g])
            if (data[i] > data[i + g]) {
                swap(i, i + g);
                swp = true;
            }
            detog();
        }
    }
}

function circle() {
    log("Circle Sort");

    function csort(low, high) {
        var swp = false;
        if (low == high) return false;

        var lo = low,
            hi = high;

        while (lo < hi) {
            toggle(lo);
            toggle(hi);
            soundmulti([lo, hi])
            if (data[lo] > data[hi]) {
                swap(lo, hi);
                swp = true;
            }
            lo++;
            hi--;
            detog();
        }

        if (lo == hi)
            if (data[lo] > data[hi + 1]) {
                swap(lo, hi + 1);
                swp = true;
            }

        var mid = Math.floor((high - low) / 2);
        var fH = csort(low, low + mid);
        var sH = csort(low + mid + 1, high);

        return swp || fH || sH;
    }
    while (csort(0, max - 1)) {
        ;
    }
}

function cycle() {
    log("Cycle Sort")
    // I copied this from geeks for geeks because I couldn't get it to work properly otherwise
    function cycleSort(arr, n) {
        for (let cycle_start = 0; cycle_start <= n - 2; cycle_start++) {
            let item = cycle_start;
            let pos = cycle_start;
            for (let i = cycle_start + 1; i < n; i++)
                if (arr[i] < arr[item]) {
                    detog();
                    pos++;
                    toggle(pos, i % 2 !== 0);
                }
            if (pos === cycle_start)
                continue;
            while (arr[item] === arr[pos]) {
                pos += 1;
            }
            if (pos !== cycle_start)
                swap(pos, item);
            var l = -1;
            while (pos !== cycle_start) {
                pos = cycle_start;
                for (let i = cycle_start + 1; i < n; i++)
                    if (arr[i] < arr[item]) {
                        detog();
                        pos += 1;
                        toggle(pos, i % 4 !== 0);
                    }
                while (item === arr[pos]) {
                    pos++;
                }
                if (item !== arr[pos])
                    swap(pos, item);
                if (pos === l) {
                    console.log("breakout!");
                    break;
                }
                l = pos;
            }
        }
    }
    cycleSort(data, max);
    detog();
}

function lsd(base) {
    log(`Radix LSD Sort Base ${base}`)
    var buckets = [];

    var sorted = false;
    var expo = 1;
    while (!sorted) {
        halt(1);
        for (let i = 0; i < base; i++)
            buckets[i] = [];

        sorted = true;
        for (i = 0; i < max; i++) {
            toggle(i, false);
            sound(i);
            var b = Math.floor(Math.floor((data[i] / expo)) % base);
            if (b > 0) sorted = false;
            buckets[b].push(i);
            detog();
            auxmulti(buckets, "Buckets");
        }
        expo *= base;
        var index = -1;
        var solid = 0;
        var filled = false;
        while (!filled) {
            detog();
            solid = ++index;
            filled = true;
            for (let i = 0; i < buckets.length; i++) {
                auxmulti(buckets, "Buckets");
                if (buckets[i].length !== 0) {
                    insert(solid, buckets[i].shift());
                    filled = false;
                    toggle(solid, true);
                    sound(solid);
                }

                solid += index + buckets[i].length;
            }
        }
    }

    detog();
}

function lsdten() {
    lsd(10);
}

function lsdany() {
    // this should choose a random number but ehh
}

function shell() {
    log("Shell Sort")
    var n = max;
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < n; i++) {
            detog();
            toggle(i, false, false);
            var temp = data[i];
            var m = 0;
            sound(i);
            for (j = i; j >= gap && data[j - gap] > temp; j -= gap) {
                insert(j, data[j - gap]);
                //detog();
                toggle(j, true, false);
                sound(j, 1);
                //toggle(data[j-gap]);
                toggle(j - gap, m++);
            }
            insert(j, temp);
        }
    }
    detog();
}

function counting() {
    log("Counting Sort")
    var n = max;

    var out = [];
    var count = [];
    for (let i = 0; i < n; i++) {
        count[i] = 0;
    }

    for (let i = 0; i < n; i++) {
        count[data[i] - 1]++;
        toggle(i, false, true);
        toggle(i, false, true);
        toggle(i, false, true);
        sound(i);
    }
    for (let i = 1; i < count.length; i++) {
        count[i] += count[i - 1];
        toggle(i, false, true);
        toggle(i, false, true);
        toggle(i, false, true);
        sound(i);
    }
    for (let i = n - 1; i >= 0; i--) {
        out[count[data[i]] - 1] = data[i];
        count[data[i]]--;
    }
    for (let i = 0; i < n; i++) {
        insert(i, out.shift());
        toggle(i, false, true);
        toggle(i, false, true);
        sound(i);
    }
}

function mergesort() {
    function merge(l, m, r) {
        var n1 = m - l + 1;
        var n2 = r - m;

        var L = new Array(n1);
        var R = new Array(n2);

        for (var i = 0; i < n1; i++) {
            L[i] = data[l + i];
            detog();
            toggle(l + i);
            sound(l + i);
        }
        for (var j = 0; j < n2; j++) {
            R[j] = data[m + 1 + j];
            detog();
            toggle(m + l + j);
            sound(m + l + j)
        }

        var i = 0;
        var j = 0;
        var k = l;
        while (i < n1 && j < n2) {
            detog();
            toggle(k);
            if (L[i] <= R[j]) {
                insert(k, L[i]);
                sound(k);
                i++;
            } else {
                insert(k, R[j]);
                sound(k);
                j++;
            }
            k++;
        }

        while (i < n1) {
            toggle(k);
            insert(k, L[i]);
            i++;
            k++;
        }
        detog();
        while (j < n2) {
            toggle(k);
            insert(k, R[j]);
            j++;
            k++;
        }

    }

    function sort(l, r) {
        if (l >= r) {
            return;
        }
        var m = l + Math.floor((r - l) / 2);
        sort(l, m);
        sort(m + 1, r);
        merge(l, m, r);
    }
    log("Merge Sort");
    sort(0, max);
}

function mergeip() {
    function merge(start, mid, end) {
        let start2 = mid + 1;
        if (data[mid] <= data[start2]) return;
        while (start <= mid && start2 <= end) {
            detog();
            toggle(start, true);
            toggle(start2, true);
            if (data[start] <= data[start2]) {
                start++;
            } else {
                let value = data[start2];
                let index = start2;

                while (index !== start) {
                    detog();
                    toggle(start, true);
                    toggle(start2, true);
                    toggle(index, true, true);
                    soundmulti([index, index-1]);
                    insert(index, data[index - 1]);
                    hop(index % 3 === 2 ? 3 : 2);
                    index--;
                }
                insert(start, value);

                start++;
                mid++;
                start2++;
            }
        }
    }

    function sort(l, r) {
        if (l >= r) {
            return;
        }
        var m = l + Math.floor((r - l) / 2);
        sort(l, m);
        sort(m + 1, r);
        merge(l, m, r);
    }
    log("In-Place Merge Sort");
    sort(0, max);
}