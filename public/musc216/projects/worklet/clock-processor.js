/*
* Clock Audio Worklet Metronome
* Parameter: Tempo (units per minute ~ 120)
* Parameter: The call back.
* 60 / temp = seconds is how long the pulse is.
* Assume quarter note for metronome.
* Quarter note = 120 what's the finest resolution. 16 notes or more specific to that.
*/

class ClockProcessor extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [
            {
                name: 'tempo',
                defaultValue: 120,
                maxValue: 250,
                minValue: 35,
            },
        ];
    }

    constructor() {
        super();

        this.secondsPerPulse = 0;
    }

    process(inputs, outputs, parameters) {
        const { tempo } = parameters;

        this.secondsPerPulse = 60.0 / tempo;

        // Keep the process alive.
        return true;
    }
}

registerProcessor('clock-processor', ClockProcessor);
