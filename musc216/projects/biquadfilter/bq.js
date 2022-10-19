let audioContext;
let audioDevice;
let masterGain;
let mediaSource;

let analyzer;

let started = false;

const FREQ = 440;
const BANDS = 5;

// FOR THE NEXT PROJECT: TAKE INPUT ANALYIZE SOEM MICROPHONE SOUND AND N
// SAMPLES AND ANZY,E EACH OF THOS SAMES AND HARMONIZE THEM BY THERI
// EFREQUECY (CONVOLVER WALONG WITH YOUR NONCOLVER..)
// TEST HOW MUCH WOULD ITW ORK AND DISCONNENCT
// ANDCONNECTING CONNOVLVING NODES. WOULD IT BE
//  BETTER TO HAVE AN ARRAY FOR EACH OF THE CONVOLVER NODES

const filter = [];
// const midi = [];

// Canvas size
const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 300;

const startButton = document.getElementById('button');

function createWaveform() {
    // Grab the blank canvas from the web document.
    const canvas = document.getElementById('canvas');

    // Create a 2D canvas.
    const canvasContext = canvas.getContext('2d');

    // Set the canvas height and width.
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // Handle  browsers that don't fully clear the canvas.
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    // Set the canvas to a solid color.
    canvasContext.fillStyle = 'rgb(200, 200, 200)';

    // Set a line width and stroke color of the wave.
    canvasContext.lineWidth = 1;
    canvasContext.strokeStyle = 'rgb(252, 0, 0)';
    canvasContext.beginPath();

    // If the audio context does not exist exit.
    if (!audioContext) { return; }

    // Keep looping the drawing function once it has been started.
    requestAnimationFrame(createWaveform);

    // Set up a buffer
    const bufferLength = analyzer.frequencyBinCount; // The amount of data points we are collecting.
    const dataArray = new Uint8Array(bufferLength);

    // Retrieve the data and copy it into our array
    analyzer.getByteTimeDomainData(dataArray);

    // Reference: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API#creating_a_waveformoscilloscope
    // I have no clue from here.
    const sliceWidth = CANVAS_WIDTH / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i += 1) {
        const v = dataArray[i] / 128.0;
        const y = v * (CANVAS_HEIGHT / 2);

        if (i === 0) {
            canvasContext.moveTo(x, y);
        } else {
            canvasContext.lineTo(x, y);
        }

        x += sliceWidth;
    }

    canvasContext.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT / 2);
    canvasContext.stroke();
}

startButton.onclick = async () => {
    if (!started) {
        // Create our audio device where all our audio devices will connect to.
        audioContext = new AudioContext();

        // Create a main gain for the audio devices.
        masterGain = audioContext.createGain();

        masterGain.connect(audioContext.destination);

        // Check if site has microphone privellages.
        try {
            audioDevice = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        } catch {
            alert('Audio device denied.');
        }

        // Check if site can get access to MIDI access.
        if (!navigator.requestMIDIAccess) {
            alert('WebMIDI is not supported.');
        }

        // navigator.requestMIDIAccess()
        //     .then(onMIDISuccess, onMIDIFailure);

        // for (const input of midiAccess.inputs.values()) {
        //     input.onmidimessage = (msg) => {
        //         console.log(msg.data);
        //     };
        // }

        analyzer = audioContext.createAnalyser();

        // Connecting the audio device as a audioNode and connect it to the audio context.
        mediaSource = audioContext.createMediaStreamSource(audioDevice);

        // Create the cone filters
        for (let i = 0; i < BANDS; i += 1) {
            filter.push(audioContext.createBiquadFilter());
            filter[i].frequency.value = FREQ;
            filter[i].Q.value = 1;

            // Connect the audio analyzer.
            mediaSource.connect(analyzer);

            // Connect our audio node to our biquad filter.
            mediaSource.connect(filter[i]);

            // Connect our biquad filter to the master gain.
            filter[i].connect(masterGain);
        }

        started = true;
    }
    createWaveform();
};
