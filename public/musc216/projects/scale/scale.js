// The frequnecy for the notes, tuning: A4=440.
const C4_HZ = 261.63; // "Middle C"
const D4_HZ = 293.66;
const E4_HZ = 329.63;
const F4_HZ = 349.23;
const G4_HZ = 392.00;
const A4_HZ = 440.00;
const B4_HZ = 493.88;

// Create an array of pitches with the notes.
const PITCH_HZ = [
    C4_HZ,
    D4_HZ,
    E4_HZ,
    F4_HZ,
    G4_HZ,
    A4_HZ,
    B4_HZ,
];

// Capture the length of the pitch array.
const NOTES = PITCH_HZ.length;

// The possible color combinations from rgb(red, green, blue) being a 32 bit color.
const COLOR_COMBINATIONS = 16777215;

// The audio context.
let audioContext;

// The oscillator to make the frequency.
let oscillator;

// The gain nodes.
let gainNode;

// Is the audio system built?
let audioBuilt = false;

// Is the audio playing? Default: false.
let audioPlaying = false;

// Save the n number of oscillators in an array.
const oscNotes = [];

// Array of gain nodes.
const gainNodes = [];

// The array of button(s).
const buttons = [];

// Get the start button.
const startButton = document.getElementById('start_button');

// Get the drop down menu.
const dropMenu = document.getElementById('click-option');

// Generate a pseudo random color.
function randomColor() {
    return `#${Math.floor(Math.random() * COLOR_COMBINATIONS).toString(16)}`;
}

// Create an anonymous function on the start button click.
startButton.onclick = () => {
    if (!audioBuilt) {
        audioContext = new AudioContext();
        for (let i = 0; i < NOTES; i += 1) {
            // Create gain and oscillator nodes.
            gainNode = audioContext.createGain();
            oscillator = audioContext.createOscillator();

            // Set the oscillator frequency to the notes and set them to 0 (off).
            oscillator.frequency.value = PITCH_HZ[i];
            gainNode.gain.value = 0.0;

            // Connect the oscillator and gain node each other and then the output device.
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Put the oscillators and the gain nodes into an array to be used later.
            oscNotes.push(oscillator);
            gainNodes.push(gainNode);
        }

        // Start all the oscillators once they have been constructed.
        for (let j = 0; j < NOTES; j += 1) {
            oscNotes[j].start();
        }
        audioBuilt = true;
    }

    if (!audioPlaying) {
        for (let j = 0; j < NOTES; j += 1) {
            // Make sure all the nodes are off before starting again.
            gainNodes[j].gain.value = 0;
            oscNotes[j].connect(gainNodes[j]);
        }
        audioPlaying = true;
        startButton.className = 'on';
        startButton.value = 'Stop';
    } else {
        // Disconnect all the oscillators by the gain nodes.
        for (let j = 0; j < NOTES; j += 1) {
            oscNotes[j].disconnect(gainNodes[j]);
        }
        audioPlaying = false;
        startButton.className = 'off';
        startButton.value = 'Start';
    }
};

// Capture each button.
for (let j = 0; j < NOTES; j += 1) {
    buttons[j] = document.getElementById(j); // Capture based on a number index.

    const buttonID = buttons[j].id; // Get the ID of the current button.

    buttons[j].addEventListener('mousedown', () => {
        startNote(buttonID);
    });
    buttons[j].addEventListener('mouseup', () => {
        endNote(buttonID);
    });
}

// Wait until the gain volume is 0 to change it back to normal color.
function noSound(id) {
    if (!gainNodes[id].gain.value === 0) {
        setTimeout(noSound, 100, id);
    } else {
        document.getElementById(id).style.backgroundColor = '#cdcccc';
    }
}

// On press button start the oscillators.
function startNote(id) {
    // Change the color of the background when clicking it to a random color.
    document.getElementById(id).style.backgroundColor = randomColor();

    // If no audio device is found exit out of function.
    if (audioContext == null) { return; }

    // Based on the drop down menu option either the user can hold or click the button.
    // The user is holding the button.
    if (dropMenu.value === 'on-hold') {
        gainNodes[id].gain.setTargetAtTime(1.0, audioContext.currentTime + 0.15, 1);
    } else {
        // Disable the button once clicked.
        document.getElementById(id).disable = true;

        // Schedule the start of a gradual change to the gain node. (Stops clipping from happening.)
        gainNodes[id].gain.setValueAtTime(gainNodes[id].gain.value, audioContext.currentTime);
        gainNodes[id].gain.linearRampToValueAtTime(1.0, audioContext.currentTime + 1);

        // Wait for 15 milliseconds before allowing the user to press the button again.
        setTimeout(() => { document.getElementById(id).disable = false; }, 15);
    }
}

// On button release set the gain to near zero to stop from clipping.
function endNote(id) {
    // If no audio device is found exit out of function.
    if (audioContext == null) {
        // Reset the color back to normal once click is released. (Normal human interaction)
        document.getElementById(id).style.backgroundColor = '#cdcccc';
        return;
    }

    // Wait until the audio stops playing to change the color back to default.
    noSound(id);

    // Schedule the start of a gradual change to the gain node. (Stops clipping from happening.)
    gainNodes[id].gain.setValueAtTime(gainNodes[id].gain.value, audioContext.currentTime);
    gainNodes[id].gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);
}
