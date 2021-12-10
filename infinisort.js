// The radius of the circle (should be relative to canvas height &/or width
const rTolerance = 5;

const ID = {
    main: 'maincanv',
    aux: 'auxcanv',
    current: 'current',
    auxsub: 'auxsub',
    ver: 'version',
    auxzone: 'auxiliary',
    debug: 'debugmnu',
    title: 'title',
    copyright: 'copyright'
};

var debug = {
    version: "v1.0.6-DEV",
    enabled: false,
    show_globals: false,
    show_aux: true,
    tpf: 0,
    tasks_left: 0,
    auto_mode: "random",
    enable_repeats: false,
    enable_b2bs: false,
    disable_toggles: false
};
function toggleDebug() {
    debug.enabled = !debug.enabled;
}

var sortcount;
var max;
var spd;
var cx;
var cy;
var im = 0;
var aucx;
var aucy;
var aurad;
var ctx;
var aux;
var atx;
var radius;
var prev;
var tlast;
var autosort = true;
var gooah = false;
var data; // Data that is sorted
var vdat; // Data that is displayed on screen
var audt; // Data in auxiliary array(s).
var cols; // Color codes for each data value
var task; // Queue of animation tasks
var mode; // Queue of modes
var togs; // All toggled slice positions
var sing; // Seperate single toggle position.
function init(amount, speed) {
  sortcount = allfuncs.length;
  getElement(ID.ver).innerHTML = debug.version;
  ctx = getElement(ID.main).getContext('2d');
  atx = getElement(ID.aux).getContext('2d');
  clearTasks();
  setRadius(getCanvasWidth(ID.canv) / 2);
  setAuxRadius(getCanvasWidth(ID.aux) / 2);
  aucx = getCanvasWidth(ID.aux) / 2;
  aucy = getCanvasHeight(ID.aux) / 2;
  build(amount, speed);
}

function setRadius(rad) {
  radius = rad - rTolerance;
}

function setAuxRadius(rad) {
  aurad = rad - rTolerance;
}

function getElement(id) {
    return document.getElementById(id);
} 

function clearTasks() {
  task = [];
  mode = [];
  togs = [];
  sing = -1;
  tlast = 0;
}

function clearData() {
  data = [];
  vdat = [];
  cols = [];
  audt = [];
}

function setSpeed(speed) {
  spd = speed;
}

function getCanvasWidth(id = ID.main) {
  return getElement(id).getAttributeNode('width').value;
}

function getCanvasHeight(id = ID.main) {
  return getElement(id).getAttributeNode('height').value;
}


function fillData() {
  for (var i = 0; i < max; i++) {
    // data and vdata should be identical at first.
    data[i] = i + 1;
    vdat[i] = i + 1;
    // This array is filled before anything happens so the draw function
    // doesn't have to get every single color every time it's called, 
    // especially since the method to do so is probably inneficient.
    cols[i] = color(i + 1);
  }
}

function setAutoSort(bool) {
  autosort = bool;
}

function build(amount, speed) {
  // Set the number of items & the visualization speed
  max = amount;
  setSpeed(speed);
  // Initialize all of the arrays
  clearData();
  // Fill the data, visual data, and color arrays.
  fillData();
  // Get the X & Y values of the center of the circle
  cx = getCanvasWidth() / 2;
  cy = getCanvasHeight() / 2;
  // Draw on the next animation frame
  window.requestAnimationFrame(draw);
}
// Draw a pie chart consisting of each point in the vdat array to the canvas.
function draw() {
  debug.tpf = 0;
  // Clear the main canvas before rendering anything.
  ctx.clearRect(0, 0, getCanvasWidth(), getCanvasHeight());
  // Get a boolean for detoggling failsafe.
  boal = false;
  // Repeat as many times as the speed calls for (adaptive depending on the 
  // number of items.)
  for (let i = 0; i < (spd * Math.ceil(max / 250)); i++) {
      debug.tpf++;
    // Process the first task in the array.
    process(task[0]);
    try {
        if(task[0].type === "toggle" && debug.disable_toggles)
            i--;
      // Toggle tasks have a "shrink" boolean, which keeps the iterator of
      // this loop from incrementing, slightly shrinking the sort time.
      if (task[0].type === "aux" || (task[0].type === "toggle" && (!debug.disable_toggles) && task[0].shrink ))
        i--;
      // If a detog has happened, activate the failsafe variable
      if (task[0].type === "detog")
        boal = true;
      if (task[0].type === "hop") {
        i -= task[0].length;
        //console.log(i + " hop f " + task[0].length)
            }
    } catch (error) {
        console.log(error);
    }
    // Remove the first item from the task list.
    task.shift();
  }
  // Render every pieslice from the visual data array.
  for (let j = 0; j < vdat.length; j++) {
    slice(j, cols[vdat[j]]);
  }
  // Render every toggled location in the toggles array.
  for (let i = 0; i < togs.length && (!debug.disable_toggles); i++) {
    slice(togs[i], "#000000");
  }
  // Render the toggled location from the single-toggle variable
  if (sing >= 0 && (!debug.disable_toggles)) {
    slice(sing, "#000000");
  }
  // If a detog has been processed, force the toggle variables to clear.
  if (boal) cleartogs();
  // Render everything in the aux pie.
  for (let i = 0; i < audt.length; i++) {
    // Clear the context before rendering any slices.
    if (i === 0) atx.clearRect(0, 0, getCanvasWidth(ID.aux), getCanvasHeight(ID.aux));
    slice(i, i === -1 ? "#000000" : cols[vdat[audt[i]]], false, atx, audt.length, aucx, aucy, aurad);
  }
  audt = [];
  while(vdat.length > max) vdat.pop();
  // Draw again on the next animation frame.
  window.requestAnimationFrame(draw);
}
// Render a pieslice
function slice(index, fill, cc = false, canv = ctx, amnt = max, cenx = cx, ceny = cy, rad = radius) {
  arc(cenx, ceny, rad, rotateA(index, amnt), rotateB(index, amnt), fill, cc, canv);
}
// Render an arc
function arc(centerX, centerY, radius, rotateA, rotateB, fill, cc = false, canv = ctx) {
  canv.beginPath();
  canv.fillStyle = fill;
  canv.moveTo(centerX, centerY);
  canv.arc(centerX, centerY, radius, rotateA, rotateB, cc);
  canv.moveTo(centerX, centerY);
  canv.fill();
}
// Process a task object.
function process(obj) {
  try {
    switch (obj.type) {
      case "swap": // Swap tasks swap vdat positions.
        var temp;
        temp = vdat[obj.a];
        vdat[obj.a] = vdat[obj.b];
        vdat[obj.b] = temp;
        break;
      case "switch": // Switch tasks run new algorithms based on the mode
        sing = -1; // Also clear potential toggles
        tlast = task.length;
        sp = mode.shift();
        switch (sp) {
          case 0:
            halt(250);
            break;
          case 1:
            shuffle();
            break;
          default:
			if(sp > 0) {
				allfuncs[sp - 2]();
			}

        }
        //console.log((task.length - tlast) + " tasks added.");
        break;
      case "report": // Report to the console and designated spot in the 
        // document which algorithm is being run 
        setCurrentText(obj.sort);
		if(obj.sort !== "Shuffling...") {
			console.log("Playing " + obj.sort);
		}
        break;
      case "toggle": // Toggle a slice, making it appear selected
        if (obj.single)
          sing = obj.index;
        else
          togs.push(obj.index);
        break;
      case "detog": // Clear the array of toggled slices
        //togs = [];
        break;
      case "jenga": // Insert a number into the array
        vdat[obj.index] = obj.value;
        break;
      case "aux":
        getElement(ID.auxsub).innerHTML = obj.text;
        if (obj.sing) {
          audt = [];
          audt.push(obj.index);
        } else
          audt = obj.index;

      case "wait": // Wait a few frames.
      case "default":
        break;
    }
  } catch (error) { // Catch an error if there is no more tasks to process
    //console.log(error);
    if (error.message != "Cannot read properties of undefined (reading 'type')") console.log(error);
    else if (autosort) {
      console.log("Adding new sorts...");
      setCurrentText("Adding new sorts...");
	  applied = [];
      for (let i = 0; i < 10; i++) {
        addMode(1);
        detog();
        addMode(0);
        if(debug.auto_mode === "ordered")
            addNextMode();
        else if(debug.auto_mode === "random")
            addRandomMode();
        else
            addMode(5);
        detog();
        addMode(0);
        //addMode(3); /* For debugging specific algorithms */
      }
      // Momentarily wait.
      addMode(0);
    }
  }
}

function update() {
    
}

function addRandomMode() {
  var neu = prev;
  do neu = Math.floor(Math.random() * sortcount);
  while (neu === prev || exclude.includes(allfuncs[neu]) || applied.includes(neu));
  prev = neu;
  addMode(prev+2);
  if(debug.enable_repeats) applied.push(neu);
  detog();
}

function addNextMode() {
  addMode(2 + im++);
  im = im >= allfuncs.length ? 0 : im;
}

// Get the rotations of various parts of a given slice position
function rotateA(index, amnt = max) {
  return ((3 * Math.PI) / 2) + (theta(amnt) * index);
}

function rotateB(index, amnt = max) {
  return rotateA(index, amnt) + theta(amnt);
}
// Get the angle of a slice (only dependant on number of items)
function theta(amnt = max) {
  return (2 * Math.PI) / amnt;
}

// This is used as the maximum number a color channel can reach
function rgb() {
  return Math.floor(max / 3);
}
// Get the color of a value
function color(n) {
  // Get variables to represent the values of the red green and blue channels
  var r = rgb(),
    g = 0,
    b = 0;
  // Cycle through each color in the Hue circle
  for (var i = 0; i < n * 2; i++) {
    if (r === rgb() && g < rgb() && b === 0) g++;
    else if (r > 0 && g === rgb() && b === 0) r--;
    else if (r === 0 && g === rgb() && b < rgb()) b++;
    else if (r === 0 && g > 0 && b === rgb()) g--;
    else if (r < rgb() && g === 0 && b === rgb()) r++;
    else if (r === rgb() && g === 0 && b > 0) b--;

  }
  // Divide each channel by the max, then multiply it by 255 (max in hex)
  r = Math.floor((r / rgb()) * 255);
  g = Math.floor((g / rgb()) * 255);
  b = Math.floor((b / rgb()) * 255);
  // Return the hex value of the color
  return "#" + ns(r.toString(16)) + ns(g.toString(16)) + ns(b.toString(16));
}
// makes sure a string has 2 characters, adding a 0 if it only has 1
function ns(s) {
  switch (s.length) {
    case 1:
      return "0" + s;
    case 2:
      return s;
    default:
      return ns(s.substr(0, 1));
  }
}
function setCurrentText(s) {
     getElement(ID.current).innerHTML = s;
}

// Add a switch task
function addSwitch() {
  task.push({
    type: "switch"
  });
}
// Add a mode change
function addMode(a) {
  mode.push(a);
  addSwitch();
}

function aux(index, single, subtitle = "AUX") {
  var f = [];
  try {
    index[1];
    f = index;
  } catch (error) {
    f[0] = index;
  }
  if(debug.show_aux) {
    task.push({
        type: "aux",
        index: f,
        sing: single,
        text: subtitle
    });
  }
}

function auxmulti(arr, subtitle = "AUX") {
  var f = [];
  for (let i = 0; i < arr.length; i++) {
    try {
      for (let j = 0; j < arr[i].length; j++) {
        f.push(arr[i][j]);
      }
      //f.push(-1);
    } catch (err) {}
  }
  //console.log(f);
  aux(f, false, subtitle);
}
// Add a toggle task
function toggle(index, shrink, single = false) {
  task.push({
    type: "toggle",
    index: index,
    shrink: shrink,
    single: single
  });
}
// Add a detoggle task
function detog() {
  task.push({
    type: "detog"
  });
}
// Clear all toggles
function cleartogs() {
  togs = [];
  sing = -1;
}
// Boost or throttle a frame's animation count by a number of tasks.
function hop(length = 1) {
  task.push({
    type: "hop",
    length: length
  });
}
// Swap two items in the data array, then add a swap task.
function swap(a, b) {
  a = Math.floor(a);
  b = Math.floor(b);
  var temp = data[a];
  data[a] = data[b];
  data[b] = temp;
  task.push({
    type: "swap",
    a: a,
    b: b
  });
}
// Add a report task
function log(s) {
    while(vdat.length > max) vdat.pop();
  if(s !== "Shuffling...") console.log("Running " + s);
  task.push({
    type: "report",
    sort: s
  });
}

function insert(index, value) {
  data[index] = value;
  task.push({
    type: "jenga",
    index: index,
    value: value
  });
}
// Add a certain number of wait tasks
function halt(length) {
  for (var i = 0; i < length; i++) {
    task.push({
      type: "wait"
    });
  }
}
// Shuffle the array.
function shuffle() {
  log("Shuffling...");
  aux(-1, true, "No Aux");
  addSwitch();
  for (var i = 0; i < data.length; i++) {
    var ran = Math.floor(Math.random() * data.length);
    toggle(i, false);
    toggle(ran, false);
    swap(i, ran);
    if (i % 2 === 0) detog();
  }
  detog();
}

function reverse(asMode = true) {
  if (asMode) {
    log("Reversing...");
    addSwitch();
  }
  for (let i = 0; i < Math.floor(max / 2); i++) {
    detog();
    swap(i, max - i - 1);
    toggle(i);
    toggle(max - i - 1);
  }
  detog();
}
// Sort Via Selection Sort.
function selection() {
  log("Selection Sort");
  var a, b, c;
  for (a = 0; a < max; a++) {
    toggle(a);
    b = a;
    for (c = a; c < max; c++) {
      if (data[b] > data[c]) {
        detog();
        b = c;
        toggle(b, true);
        aux(b, true, "Selection");
      }
      toggle(c, !(c % 4 === 1), true);

    }
    swap(b, a);
    detog();
  }
}

function dualselect() {
  log("Dual Selection Sort");
  for (let i = 0, j = max - 1; i < j; i++, j--) {
    detog();
    toggle(i, true);
    toggle(j, true);
    var minv = data[i];
    var maxv = data[i];
    var mini = i;
    var maxi = i;

    for (var k = i; k <= j; k++) {
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
  log("Insertion Sort");
  var a, b;
  for (a = 0; a < max; a++) {
    for (b = a; b > 0 && data[b - 1] > data[b]; b--) {
      swap(b, b - 1);
      detog();
      toggle(b, true);
      aux([b - 1, b], false, "Comparison");
    }
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
        swap(c - 1, c);
        hop((c % 3 === 0 ? 0 : 3));
        //console.log("c%3=" + c%3 + " so hop " + (c % 3 === 0 ? 0 : 1))
        detog();
        b = c;
        toggle(c, true);
      }
    }
    a = b;
  } while (a > 1);
}

function optbubble() {
  log("Optimized Bubble Sort");
  var swapped;
  for (let i = 0; i < max; i++) {
    swapped = false;
    for (let j = 0; j < max - i - 1; j++) {
      if (data[j] > data[j + 1]) {
        swap(j, j + 1);
        hop((j % 3 === 0 ? 0 : 3));
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
  log("Cocktail Shaker Sort");
  var dir = true,
    swapped = true,
    start = 0,
    end = max - 1;

  while (swapped) {
    swapped = false;
    for (let i = start; i < end; i++) {
      if (data[i] > data[i + 1]) {
        swapped = true;
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
  log("Quicksort " + piv + " Pivot");
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
      insert(j++, sml[i]);
      s1.shift();
      auxmulti([s1, g1], "Partitions");
    }
    insert(j++, piv);
    for (let i = 0; i < grt.length; i++) {
      toggle(j, true, true);
      insert(j++, grt[i]);
      g1.shift();
      auxmulti([s1, g1], "Partitions");
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
  heapsort(Math.random() * 2 > 1);
}

function ternheap() {
    log("Ternary Heap Sort");
    function heap(i, n) {
        var top;
        var l = 3 * i + 1;
        var m = 3 * i + 2;
        var r = 3 * i + 3;
        if(l < n && data[l] > data[i]) 
            top = l;
        else 
            top = i;
        if(m < n && data[m] > data[top])
            top = m;
        if(r < n && data[r] > data[top])
            top = r;
        detog();
        toggle(l);
        toggle(m);
        toggle(r);
        toggle(i);
        if(top !== i) {
            swap(i, top);
            heap(top, n);
        }
    }
    for(let i = Math.floor(max/3); i >= 0; i--)
        heap(i, max);
    var n = max;
    for(let i = n-1; i > 0; i--) {
        swap(0, i);
        heap(0, --n);
    }
    detog();
}

function oddeven() {
  log("Odd-Even Sort");
  var srtd = false;
  while (!srtd) {
    srtd = true;
    for (let i = 1; i <= max - 2; i += 2) {
      if (data[i] > data[i + 1]) {
        toggle(i, true);
        swap(i, i + 1);
        srtd = false;
        detog();
      }
    }
    for (let i = 0; i <= max - 2; i += 2) {
      if (data[i] > data[i + 1]) {
        toggle(i, true);
        swap(i, i + 1);
        srtd = false;
        detog();
      }
    }
  }
}

function gnome() {
  log("Gnome Sort");
  var i = 0;
  while (i < max) {
    toggle(i, false, true);
    if (i === 0 || data[i] >= data[i - 1]) {
      i++;
      aux(data[i], true, "Comparison");
    } else {
      swap(i, i - 1);
      i--;
      aux([data[i], data[i - 1]], false, "Comparison");
    }
  }
  detog();
}

function optgnome() {
  log("Optimized Gnome Sort");

  function gno(bound) {
    for (let i = bound; i > 0 && data[i - 1] > data[i]; i--) {
      toggle(bound, true);
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
  log("Comb Sort");

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
  log("Cycle Sort");
  // I copied this from geeks for geeks because I couldn't get it to work properly otherwise
  function cycleSort(arr, n) {
    for (let cycle_start = 0; cycle_start <= n - 2; cycle_start++) {
      let item = cycle_start;
      let pos = cycle_start;
      for (let i = cycle_start + 1; i < n; i++)
        if (arr[i] < arr[item]) {
          detog();
          pos++;
          toggle(pos, i % 2 != 0);
        }
      if (pos == cycle_start)
        continue;
      while (arr[item] == arr[pos])
        pos += 1;
      if (pos != cycle_start)
        swap(pos, item);
      while (pos != cycle_start) {
        pos = cycle_start;
        for (let i = cycle_start + 1; i < n; i++)
          if (arr[i] < arr[item]) {
            detog();
            pos += 1;
            toggle(pos, i % 4 != 0);
          }
        while (item == arr[pos])
          pos += 1;
        if (item != arr[pos])
          swap(pos, item);

      }
    }
  }
  cycleSort(data, max);
  detog();
}

function lsd(base = -1) {
  if (base == -1) {
    base = Math.pow(2, Math.round(Math.random() * 5) + 1);
  }
  if (base > 32) base = 10;
  log("Radix LSD Sort Base " + base);
  var buckets = [];


  var sorted = false;
  var expo = 1;
  var b;
  while (!sorted) {
    for (let i = 0; i < base; i++)
      buckets[i] = [];

    sorted = true;
    for (i = 0; i < max; i++) {
      toggle(i);
      var b = Math.floor(Math.floor((data[i] / expo)) % base);
      if (b > 0) sorted = false;
      buckets[b].push(i);
      detog();
      auxmulti(buckets, "Buckets");
    }
    expo *= base;
    var index = 0;
    var tc = 0;
    for (var i = 0; i < buckets.length; i++) {
      aux(buckets[i], false, "Bucket");
      while (buckets[i].length !== 0) {
        var u = buckets[i].shift();
        toggle(data[u], true);
        toggle(index, false, true);
        insert(index++, u);
        if (sorted || ++tc > base / 2) {
          detog();
          tc = 0;
        }
        auxmulti(buckets, "Buckets");
      }
      /*for (let j = 0; j < b.length; j++) {
				toggle(b[j], true);
				toggle(index, false, true);
				insert(index++, b[j]);
				if (sorted || ++tc > base / 2) {
					detog();
					tc = 0;
				}
                                if (!sorted) auxmulti(b, false, "Bucket");
			}*/
      detog();
      buckets[i] = [];
    }
  }

  detog();
}

function lsdany() {
  lsd();
}

function lsdtwo() {
  lsd(2);
}

function lsdfor() {
  lsd(4);
}

function lsdate() {
  lsd(8);
}

function lsdten() {
  lsd(10);
}

function lsdhex() {
  lsd(16);
}

function lsdtop() {
  lsd(32);
}


const allfuncs = [
  selection,
  dualselect,
  insertion,
  bubble,
  optbubble,
  cocktail,
  qsmax,
  qsmin,
  qsmed,
  qsran,
  qsdual,
  qstable,
  maxheap,
  minheap,
  ternheap,
  oddeven,
  gnome,
  optgnome,
  comb,
  circle,
  cycle,
  lsdtwo,
  lsdfor,
  lsdate,
  lsdten,
  lsdhex,
  lsdtop
];
const exclude = [
  qsany,
  anyheap,
  lsdate,
  lsdtwo,
  lsdhex,
  lsdtop
];
var applied = [];
