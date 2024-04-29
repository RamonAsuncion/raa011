let audioContext; // declare our audio context to host our sound making

const NUM_OF_MODULATOR = 3; // number of modulators.

let masterGain; // declare our master gain
let carrierNode; // declare a gain for our carrier oscillator
const modulatorGainNode = new Array(NUM_OF_MODULATOR);

let carrier; // declare our carrier oscillator
const modulator = new Array(NUM_OF_MODULATOR); // declare our modulator oscillator

let started = false; // keep track if the javascript sound system has started
let playing = false; // keep track if sound is playing

const startButton = document.getElementById('start_button'); // our start button
const carrierFrequencySlider = document.getElementById('carrier_frequency_slider'); // our carrier frequency slider input
const carrierFrequencyLabel = document.getElementById('carrier_frequency_label'); // our carrier frequency label

// Instantiate an array of modulator frequency sliders and labels.
const modulatorFrequencySlider = new Array(NUM_OF_MODULATOR);
const modulatorFrequencyLabel = new Array(NUM_OF_MODULATOR);

// The oscillator table
const oscillatorWave = [];
const oscillatorSelect = document.getElementById('osc_select');

// Get all the modulator frequency sliders and labels from the document ID's.
for (let i = 0; i < NUM_OF_MODULATOR; i += 1) {
    // Add all the modulator frequency sliders into an array./
    modulatorFrequencySlider[i] = (document.getElementById(`modulator_frequency_slider_${i}`));
    // Add all the modulator frequency labels into an array./
    modulatorFrequencyLabel[i] = (document.getElementById(`modulator_frequency_label_${i}`));
}

// do this when the start button is clicked
startButton.onclick = () => {
    // if the sound system is not started, start the carrier and modulator osciallators
    if (!started) {
        audioContext = new AudioContext(); // create an audio context to host our sound making

        masterGain = audioContext.createGain(); // create our master gain
        carrierNode = audioContext.createGain(); // create a gain for our carrier oscillator

        carrier = audioContext.createOscillator(); // create our carrier oscillator

        masterGain.connect(audioContext.destination); // connect our master gain to our speakers
        masterGain.gain.value = 0.5; // set our master gain level really low

        carrier.connect(carrierNode); // connect our carrier oscillator to the carrier gain node
        carrier.frequency.value = 440; // set our default carrier oscillator frequency

        carrier.start(); // start processing of our carrier oscillator

        for (let k = 0; k < NUM_OF_MODULATOR; k += 1) {
            carrier.type = oscillatorWave[k]; // set our carrier oscillator type

            modulatorGainNode[k] = audioContext.createGain();
            modulator[k] = audioContext.createOscillator(); // Create our modulator oscillator.

            // TODO: I need to make more gains this is what I need to configure.
            modulatorGainNode[0].connect(carrierNode.gain);
            if (k > 0) { modulatorGainNode[1].connect(masterGain.gain); }

            modulator[k].connect(modulatorGainNode[k]);

            modulator[k].type = oscillatorWave[k]; // define oscillator type
            modulator[k].frequency.value = 0;

            modulator[k].start(); // start processing of our modulator oscillator
        }

        started = true; // keep track that the sound system has started
    }

    // if we are starting playback
    if (!playing) {
        carrierNode.connect(masterGain); // connect the carrier gain to the master gain
        playing = true; // keep track that we are playing
        startButton.value = 'Stop'; // change our start button label
        startButton.style.backgroundColor = 'red'; // change our start button color
    } else {
        carrierNode.disconnect(masterGain); // disconnect the carrier gain from the master gain
        playing = false; // keep track that we are not playing
        startButton.value = 'Start'; // change our start button label
        startButton.style.backgroundColor = 'green'; // change our start button color
    }
};

carrierFrequencySlider.oninput = () => {
    // Set the carrier frequency label to the slider value/
    carrierFrequencyLabel.innerHTML = carrierFrequencySlider.value;

    // Set the carrier frequency to the slider value only if it exist.
    if (!carrier) { return; }
    carrier.frequency.value = carrierFrequencySlider.value;
};

// Grab the value from our modulator frequency slider on input
// and set the modulator frequency label appropriately
for (let j = 0; j < NUM_OF_MODULATOR; j += 1) {
    // If the slider does not exist break off the for loop.
    if (!modulatorFrequencySlider[j]) break;

    modulatorFrequencySlider[j].oninput = () => {
        modulator[j].frequency.value = modulatorFrequencySlider[j].value;
        modulatorFrequencyLabel[j].innerHTML = modulatorFrequencySlider[j].value;
    };

    oscillatorSelect.onchange = () => {
        oscillatorWave[j] = oscillatorSelect[j].value;
        // osc[j].type = oscillatorWave[j];
    };
}
