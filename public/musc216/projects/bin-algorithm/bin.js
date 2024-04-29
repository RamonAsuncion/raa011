let play = false;

let audioContext;
let mediaSource;
let analyser;

// USe an error rate of 2^1/24 distance away fro the frequencies.
// Instead of voice input do oscillator with a set frequency
// show array on text on page

// next prject delay nodes, delay nodes pant throght out space. (50 delays.. 56 delays) they should all be played throughout the space with a different delay t
// ime and a sliders that control the feedback GAINNN of each of them. each delay shold have a slider and each of them should be a echo delay
/// BUTTON FOR DESTROY WHERE THE FEEDBACK GAIN CAN GET AN EXPLOSION.
// THEY SHOULD BE AUDI SOURCE N DELAY AND N FEEDBACK GAIN and a MASTER GAIN A ND PAM AUTO GENERATION [-1, 1]  the feedback gain slider is going to be the destruction make a feedback gain slider for each of them.

const binAmps = [];
const binAmpsIndex = [];
const MAX_BIN_SIZE = 5;

const startButton = document.getElementById('startButton');

function binAlgorithm() {
    // BufferLength of the FFT size
    const bufferLength = analyser.fftSize;
    // Create the buffer.
    const buffer = new Float32Array(bufferLength);
    // Populate the buffer.
    analyser.getFloatTimeDomainData(buffer);

    let maxValue = -1;
    let topValue = -1;

    for (let i = 0; i < bufferLength.length; i += 1) {
        if (binAmps[i] > maxValue) {
            maxValue = binAmps[i];
            topValue = i;
        }
    }
}

function captureBinAmps() {
    analyser.fftSize = 2048;

    const fData = new Uint8Array(analyser.frequencyBinCount);

    analyser.getByteFrequencyData(fData);

    for (let i = 0; i < MAX_BIN_SIZE; i += 1) {
        // Push to the array the first N.
        binAmps[i] = fData[i];
        binAmpsIndex[i] = i;
    }

    // Sort the array.
    binAmps.sort();

    binAlgorithm();
}

startButton.onclick = async () => {
    if (!play) {
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();

        const rules = { audio: true, video: false };
        await navigator.mediaDevices.getUserMedia(rules)
            .then(
                (stream) => {
                // Connect the microhphone to the main audio source.
                    mediaSource = audioContext.createMediaStreamSource(stream);

                    // Connect the audio analyzer.
                    mediaSource.connect(analyser);

                    captureBinAmps();
                },
            )
            .catch(() => {
                alert('Error: Microphone permissions are required.)');
            });

        play = true;
    }
};
