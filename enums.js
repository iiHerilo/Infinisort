class AutoMode {
    static manual = new AutoMode("manual");
    static linear = new AutoMode("linear");
    static random = new AutoMode("random");

    constructor(name) {
        this.name = name;
    }
}

class SoundMode {
    static frequency = new SoundMode("frequency");
    static equalizer = new SoundMode("equalizer");

    constructor(name) {
        this.name = name;
    }
}
