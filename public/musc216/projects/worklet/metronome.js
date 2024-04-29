let audioContext;
let clockNode;
let started = false;
let isPlaying = false;

/*
Next:
The master function - test, do some actions whatever that means -> actions in the master function
I got through each array if the array value (module to step through it) if its 1 call a function
*/

const startButton = document.getElementById('start-button');

startButton.onclick = async () => {
    if (!started) {
        audioContext = new AudioContext();
        // Create the clock processor
        await audioContext.audioWorklet.addModule('clock-processor.js');
        clockNode = new AudioWorkletNode(audioContext, 'clock-processor');

        started = true;
    }

    // Connect the audio node.
    if (!isPlaying) {
        clockNode.connect(audioContext.destination);
        isPlaying = true;
    } else {
        clockNode.disconnect(audioContext.destination);
        isPlaying = false;
    }
};
