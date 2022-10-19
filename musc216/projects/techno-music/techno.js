// "use strict";

// scale for our bass
const bassScale = [
    [35, 261.63 / 4.0],
    [15 + 35, 329.63 / 4.0],
    [30 + 50, 392 / 4.0],
    [20 + 80, 493.88 / 4.0],
];

let audioContext;
let osc;
let gain;
let masterGain;

let bassRepeat = 4;

let started = false;
let playing = false;

let effectThread;
let bassThread;
let randomNumber;

const startButton = document.getElementById('startButton');

const snare = document.getElementById('snare');
const beat = document.getElementById('beat');
const effect = document.getElementById('effect');

function playEffect(effects) {
    let count = 0;
    return setInterval(() => {
        randomNumber = Math.floor(Math.random() * 100);
        if (randomNumber < 50 && count >= 5) {
            effects.play();
        }

        if (count >= 50) {
            effects.pause();
            count = 0;
        }

        count += 1;
    }, 100);
}

function playBass(oscillator, gainValue) {
    return setInterval(() => {
        const distoration = gainValue;
        distoration.gain.value = 1; // gain volume
        randomNumber = Math.floor(Math.random() * 100); // pick a random number between 0 and 100

        if (bassRepeat >= 4) {
            for (let i = 0; i < bassScale.length; i += 1) {
                if (randomNumber < bassScale[i][0]) {
                    const [, value] = bassScale[i];
                    osc.frequency.value = value;
                    break;
                }
            }
            bassRepeat = 0;
        }
        bassRepeat += 1;
    }, 100);
}

// do this when the start button is clicked
startButton.onclick = () => {
    // if the sound system is not started, start the carrier and modulator osciallators
    if (!started) {
        audioContext = new AudioContext(); // create an audio context to host our sound making
        masterGain = audioContext.createGain();
        masterGain.connect(audioContext.destination);

        osc = audioContext.createOscillator(); // create an oscillator
        osc.type = 'sine'; // define oscillator type
        osc.frequency.value = 440; // set oscillator frequency
        osc.start(); // start oscillator processing

        gain = audioContext.createGain(); // create a gain
        gain.gain.value = 0; // set the gain's amplitude

        osc.connect(gain); // connect the oscillator to the gain
        gain.connect(masterGain); // connect the gain to our master gain

        started = true; // keep track that the sound system has started
    }

    // if we are starting playback
    if (!playing) {
        bassThread = playBass(osc, gain); // start the bass line

        // Start the beats.
        snare.play();
        beat.play();
        effectThread = playEffect(effect);

        playing = true; // keep track that we are playing
        startButton.value = 'Stop'; // change our start button label
        startButton.style.backgroundColor = 'red'; // change our start button color
    } else {
        // Stop the beats.
        snare.pause();
        beat.pause();
        effect.pause();

        clearInterval(bassThread); // stop the bass lined
        clearInterval(effectThread);

        gain.gain.value = 0;
        playing = false; // keep track that we are not playing
        startButton.value = 'Start'; // change our start button label
        startButton.style.backgroundColor = 'green'; // change our start button color
    }
};
