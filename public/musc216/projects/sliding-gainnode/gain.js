// Initlaize a AudoContext variable.
let audioContext = null;

// Keep track if the audio is playing.
let playSound = false;

// The amount of harmonic frequency sliders there are.
const SLIDER_COUNT = 1;

// Oscillator and Gain node
const osc = new Array(SLIDER_COUNT);
const gain = new Array(SLIDER_COUNT);

// Capture the document ID's used for the sliders and labels.
const frequencyLabels = new Array(SLIDER_COUNT);
const gainLabels = new Array(SLIDER_COUNT);

const frequencySliders = new Array(SLIDER_COUNT);
const gainSliders = new Array(SLIDER_COUNT);

const oscillatorDropDown = new Array(SLIDER_COUNT);
const oscillatorWave = new Array(SLIDER_COUNT);

// Capture the button ID
const playButton = document.getElementById('start-button');

// Capture the ID's and add them to their respective array.
for (let i = 1; i <= SLIDER_COUNT; i += 1) {
    // Frequency labels
    frequencyLabels.push(document.getElementById(`frequency-text_${i}`));
    // Frequency sliders
    frequencySliders.push(document.getElementById(`frequency-slider_${i}`));
    // Gain labels
    gainLabels.push(document.getElementById(`gain-text_${i}`));
    // Gain sliders
    gainSliders.push(document.getElementById(`gain-slider_${i}`));
    // The oscillator drop down selector.
    oscillatorDropDown.push(document.getElementById(`oscillator-selector_${i}`));
    // Default value for oscillator wave.
    oscillatorWave.push('sine');
}

function updateHarmonicSliders(frequencyValue) {
    for (let k = 1; k <= SLIDER_COUNT; k += 1) {
        frequencySliders[k].value = frequencyValue * k;
        frequencyLabels[k].innerHTML = frequencySliders[k].value;
    }
}

// If user moves the sider update the label values.
for (let j = 1; j <= SLIDER_COUNT; j += 1) {
    // If the slider is moved change the value on the label.
    frequencySliders[j].oninput = () => {
        frequencyLabels[j].innerHTML = frequencySliders[j].value;
        updateHarmonicSliders(frequencySliders[j].value / j);
    };

    let onClick = false;
    gainSliders[j].oninput = () => {
        gainLabels[j].innerHTML = parseFloat(gainSliders[j].value) / 100.0;
        onClick = true;
    };

    if (onClick) {
        gain[j].gain.setValueAtTime(
            parseFloat(gainSliders[j].value) / 100.0,
            audioContext.currentTime,
        );
        onClick = false;
    }

    oscillatorDropDown[j].onchange = () => {
        oscillatorWave[j] = oscillatorDropDown[j].value;
        osc[j].type = oscillatorWave[j];
    };
}

// When the user presses the play button.
playButton.onclick = () => {
    if (!playSound) {
        audioContext = new AudioContext(); // Create when the user wants to play sound.

        // Create an audio context oscillator and gain node for each slider.
        for (let k = 1; k <= SLIDER_COUNT; k += 1) {
            osc[k] = audioContext.createOscillator();
            osc[k].frequency.value = 440;
            osc[k].type = oscillatorWave[k];
            osc[k].start();

            gain[k] = audioContext.createGain();
            gain[k].connect(audioContext.destination);
            gain[k].gain.setValueAtTime(0, audioContext.currentTime);

            // Conenct the gain to the oscillators.
            osc[k].connect(gain[k]);
        }

        playSound = true;
    }
};
