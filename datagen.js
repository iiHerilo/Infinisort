// assumes it is running in a context with config.json

function DataGen() {
    this.getColorArray = function(length) {
        // This is used as the maximum number a color channel can reach
        function rgb() {
            return Math.floor(length / 3);
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
            // Return the hex value of the color
            return "#" + ns(r.toString(16)) + ns(g.toString(16)) + ns(b.toString(16));
        }
        var cols = [];
        for (let i = 0; i < length; i++) {
            cols[i] = color(i + 1);
        }
        return cols;
    };

    this.getArray = function(length) {
        var data = [];
        for (let i = 0; i < length; i++) {
            data[i] = i + 1;
        }
        return data;
    };
}