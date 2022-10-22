let audioContext;
let audioDevice;
let mediaSource;

let started = false;
let playing = false;

const convolver = [];
let response;
let arrayBuffer;
let gain;

const GAIN_VALUE = 0.3;

const samples = [
    'A-sharp-Bb4.wav',
    'A4.wav',
    'B4.wav',
    'C-sharp-Db4.wav',
    'C4.wav',
    'C5.wav',
    'D-sharp-Eb4.wav',
    'E4.wav',
    'E4.wav',
    'F-sharp-Gb4.wav',
    'F4.wav',
    'G-sharp-Ab4.wav',
    'G4.wav',
];

let randomNumber = 0;
let randomSample;

const startButton = document.getElementById('start_button');

function randomConvolver() {
    randomSample = setInterval(() => {
        randomNumber = Math.round(Math.random() * (samples.length - 1));
        gain.connect(convolver[randomNumber]);
    }, 1000);
}

// The start button has been pressed.
startButton.onclick = async () => {
    // Initialize the sound system once at the beginning.
    if (!started) {
        // Create an audio context.
        audioContext = new AudioContext();

        // Create a gain node.
        gain = audioContext.createGain();

        // Get microphone input.
        try {
            audioDevice = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false,
            });
        } catch {
            alert('Microphone input denied.');
        }

        for (let i = 0; i < samples.length; i += 1) {
            // Create a convolver.
            convolver.push(audioContext.createConvolver());

            // Audio file for convolver impulse.
            response = await fetch(`${window.location.origin}/musc216/projects/convolution/string_samples/${samples[i]}`);

            // Convert convolver impluse to an array buffer.
            arrayBuffers = await response[i].arrayBuffer();

            // Set the convolver to the array buffer.
            convolver[i].buffer = await audioContext.decodeAudioData(arrayBuffers);

            // Connect the convolvers to the audio destination (e.g. speakers).
            convolver[i].connect(audioContext.destination);
        }

        // Create an audio node from the microphone input.
        mediaSource = audioContext.createMediaStreamSource(audioDevice);

        // Connect the gain node to the source.
        mediaSource.connect(gain);

        // Set the gain value.
        gain.gain.value = GAIN_VALUE;

        // Sound has started.
        started = true;
    }

    // Play the audio stream to the speakers.
    if (!playing) {
        gain.connect(convolver[0]);
        playing = true;
        randomConvolver();
    } else {
        playing = false;
        clearInterval(randomSample);
        gain.disconnect(convolver);
    }
};
