let audioContext;
let audioSource;
let mediaSource;
let masterGain;

let started = false;
let playing = false;

// Project: create delay nodes that pan "throught ouut space".
// They should be all played at different pans between [-1, 1]
// Each of the delay nodes should have a feedback gain.
// This feedback gain can be controlled with a slider.
// The delay node should also have a time at which the audio is delayed.
// To set the time you should use a slider as well.
// In the end you should have an audiosource, a N number of delay nodes,
// a N number of feedback gains with sliders based on delay nodes,
// and a master gain with everything that connects with it. Of course
// I will have the pam auto generation, but that's just setting the pan value
// from a number between [-1, 1] as stated earlier with most likely a
// setinterval that's async.

const delayInput = document.getElementById('number_of_delays');

const startButton = document.getElementById('start_button');

let panL;
let panR;

let panLValue;
let panRValue;

const MAX_DELAYS = 20;
const DEFAULT_DELAYS = 1; // Make value between [MIN, MAX].
const MIN_DELAYS = 0;

let delay;
let numberOfDelays;
let delayIndex = 0;

// Keep track of how many containers there are.
const stackTables = [];

// Show the user the range that they can input.
document.getElementById('maximum').innerHTML = MAX_DELAYS;
document.getElementById('minimum').innerHTML = MIN_DELAYS + 1;

function createDelay() {
    // First call of the generate html function.
    if (!numberOfDelays) { numberOfDelays = DEFAULT_DELAYS; }

    // Generate one delay container based on the default delay.
    const table = document.createElement('table');
    const tag = document.createElement('p');
    const textNode = document.createTextNode(`Container-${delayIndex + 1}`);
    tag.appendChild(textNode);
    table.appendChild(tag);

    delayIndex += 1;

    table.setAttribute('id', `table_${delayIndex}`);
    table.setAttribute('style', 'border: 1px solid black; ');

    const delayTimeTableRow = document.createElement('tr');
    const delayTimeTableCell = document.createElement('td');

    // Create the delay time slider for the left speaker.
    const delayTimeSlider = document.createElement('input');
    delayTimeTableCell.textContent = 'delay time: ';

    // Set the attributes of the slider.
    delayTimeSlider.setAttribute('type', 'range');
    delayTimeSlider.setAttribute('id', `pan_delay_slider_${delayIndex}`);
    delayTimeSlider.setAttribute('min', 0);
    delayTimeSlider.setAttribute('max', 3000);
    delayTimeSlider.setAttribute('value', 250);
    delayTimeSlider.setAttribute('style', 'width: 300px;');

    // Create the delay time slider label for the left speaker.
    const delayTimeLabel = document.createElement('span');

    // Set the attribute of the slider.
    delayTimeLabel.setAttribute('id', `pan_delay_slider_label_${delayIndex}`);

    // Set the value of the label to the current value of the slider.
    delayTimeLabel.innerHTML = `${delayTimeSlider.value} ms`;

    // Dynamically change the value of the label with the new value.
    delayTimeSlider.oninput = () => {
        delayTimeLabel.innerHTML = `${delayTimeSlider.value} ms`;
    };

    const feedbackGainTableRow = document.createElement('tr');
    const feedbackGainTableCell = document.createElement('td');

    // Create the delay time slider for the left speaker.
    const feedbackGainSlider = document.createElement('input');
    feedbackGainTableCell.textContent = 'feedback gain: ';

    // Set the attributes of the slider.
    feedbackGainSlider.setAttribute('type', 'range');
    feedbackGainSlider.setAttribute('id', `feedback_gain_slider_${delayIndex}`);
    feedbackGainSlider.setAttribute('min', 0);
    feedbackGainSlider.setAttribute('max', 20000);
    feedbackGainSlider.setAttribute('value', 5000);
    feedbackGainSlider.setAttribute('style', 'width: 300px;');

    // Create the feq gain slider label.
    const feedbackGainSliderLabel = document.createElement('span');

    // Set the attribute of the slider.
    feedbackGainSliderLabel.setAttribute('id', `feedback_gain_label_${delayIndex}`);

    // Set the value of the label to the current value of the slider.
    feedbackGainSliderLabel.innerHTML = feedbackGainSlider.value;

    // Dynamically change the value of the label with the new value.
    feedbackGainSlider.oninput = () => {
        feedbackGainSliderLabel.innerHTML = feedbackGainSlider.value;
    };

    const filterFreqTableRow = document.createElement('tr');
    const filterFreqTableCell = document.createElement('td');

    // Create the filter freq slider.
    const filterFreqSlider = document.createElement('input');
    filterFreqTableCell.textContent = 'filter freq: ';

    // Set the attributes of the slider.
    filterFreqSlider.setAttribute('type', 'range');
    filterFreqSlider.setAttribute('id', `filter_freq_slider_${delayIndex}`);
    filterFreqSlider.setAttribute('min', 0);
    filterFreqSlider.setAttribute('max', 20000);
    filterFreqSlider.setAttribute('value', 5000);
    filterFreqSlider.setAttribute('style', 'width: 300px;');

    // Create the delay time slider label for the left speaker.
    const filterFreqSliderLabel = document.createElement('span');

    // Set the attribute of the slider.
    filterFreqSliderLabel.setAttribute('id', `filter_freq_slider_label_${delayIndex}`);

    // Set the value of the label to the current value of the slider.
    filterFreqSliderLabel.innerHTML = `${filterFreqSlider.value} Hz`;

    // Dynamically change the value of the label with the new value.
    filterFreqSlider.oninput = () => {
        filterFreqSliderLabel.innerHTML = `${filterFreqSlider.value} Hz`;
    };

    const filterGainTableRow = document.createElement('tr');
    const filterGainTableCell = document.createElement('td');

    // Create the filter freq slider.
    const filterGainSlider = document.createElement('input');
    filterGainTableCell.textContent = 'filter freq: ';

    // Set the attributes of the slider.
    filterGainSlider.setAttribute('type', 'range');
    filterGainSlider.setAttribute('id', `filter_gain_slider_${delayIndex}`);
    filterGainSlider.setAttribute('min', -50);
    filterGainSlider.setAttribute('max', 50);
    filterGainSlider.setAttribute('value', -5);
    filterGainSlider.setAttribute('style', 'width: 300px;');

    // Create the delay time slider label for the left speaker.
    const filterGainSliderLabel = document.createElement('span');

    // Set the attribute of the slider.
    filterGainSliderLabel.setAttribute('id', `filter_gain_slider_label_${delayIndex}`);

    // Set the value of the label to the current value of the slider.
    filterGainSliderLabel.innerHTML = filterGainSlider.value;

    // Dynamically change the value of the label with the new value.
    filterGainSlider.oninput = () => {
        filterGainSliderLabel.innerHTML = filterGainSlider.value;
    };

    // Add the pan delay slider to the table.
    delayTimeTableCell.append(delayTimeSlider, delayTimeLabel);
    delayTimeTableRow.appendChild(delayTimeTableCell);
    table.appendChild(delayTimeTableRow);

    table.appendChild(document.createElement('br'));

    // Add a feedback gain slider
    feedbackGainTableCell.append(feedbackGainSlider, feedbackGainSliderLabel);
    feedbackGainTableRow.appendChild(feedbackGainTableCell);
    table.appendChild(feedbackGainTableRow);

    table.appendChild(document.createElement('br'));

    // Add a frequency filter slider
    filterFreqTableCell.append(filterFreqSlider, filterFreqSliderLabel);
    filterFreqTableRow.appendChild(filterFreqTableCell);
    table.appendChild(filterFreqTableRow);

    table.appendChild(document.createElement('br'));

    // Add a filter gain slider
    filterGainTableCell.append(filterGainSlider, filterGainSliderLabel);
    filterGainTableRow.appendChild(filterGainTableCell);
    table.appendChild(filterGainTableRow);

    stackTables.push(table.id);

    // Add the code to the empty div in the html file.
    document.getElementById('main').appendChild(table);
}

function deleteDelay(numberOfDeleteElements) {
    for (let i = 0; i < numberOfDeleteElements; i += 1) {
        document.getElementById(stackTables.pop()).remove();
        delayIndex -= 1;
    }
}

function addContainerElements(difference) {
    for (let i = 0; i < difference; i += 1) {
        createDelay();
    }
}

// Generate random numbers in space for the speakers to play.
function panValueGenerator() {
    // Generate a random value from [0, 1] for the right speaker.
    panRValue = Number(setInterval(() => {
        Math.random();
    }, 1000));

    // Generate a random value from [-1, 0] for the left speaker.
    panLValue = Number(setInterval(() => {
        Math.floor(Math.random());
    }, 1000));

    panL.pan.value = panLValue;
    panR.pan.value = panRValue;
}

// Check if the user updated the number of delays.
delayInput.addEventListener('change', (updated) => {
    // Keep track of a temporary number of array.
    const tempNumberOfDelays = Number(numberOfDelays);

    // Update the number of variables with the new input.
    numberOfDelays = Number(updated.target.value);

    // Make sure the number of delays is between 1 and 20.
    if (numberOfDelays <= MIN_DELAYS) {
        alert(`Number of delays has to be ${MIN_DELAYS} or more!`);
        // Resetting the values to their default stages.
        numberOfDelays = DEFAULT_DELAYS;
        delayInput.value = numberOfDelays;
    }

    if (numberOfDelays > MAX_DELAYS) {
        alert(`Too many delays! Max: ${MAX_DELAYS}.`);
        // Resetting the values to their default stages
        numberOfDelays = MAX_DELAYS;
        delayInput.value = numberOfDelays;
    }

    // Difference in distance from new updated number from previous old number.
    const difference = Math.abs(numberOfDelays - tempNumberOfDelays);
    // console.log(difference);

    // A higher number has been inputted to text field.
    if (numberOfDelays >= tempNumberOfDelays) {
        // Regenerate the HTML file based on the updated number of delays.
        addContainerElements(difference);
    } else {
        deleteDelay(difference);
    }
});

startButton.onclick = async () => {
    if (!started) {
        audioContext = new AudioContext();

        masterGain = audioContext.createGain();
        masterGain.connect(audioContext.destination);

        masterGain.gain.value = 0.5;

        // Get the microphone audio.
        try {
            const rules = { audio: true, video: false };
            audioSource = await navigator.mediaDevices.getUserMedia(rules);
        } catch {
            alert('No microphone input!');
            return;
        }

        // Connect the microphone audio to the main source.
        mediaSource = audioContext.createMediaStreamSource(audioSource);

        // TODO: This has to be updated based on the slider.
        delay = audioContext.createDelay(5);
        delay.delayTime.value = 1;

        // Create the pams.
        panL = audioContext.createStereoPanner();
        panR = audioContext.createStereoPanner();

        // Generate the pam values.
        panValueGenerator();

        // Connect the audio devices to the speakers.
        panL.connect(audioContext.destination);
        panR.connect(audioContext.destination);

        delay.connect(panR);

        started = true;
    }

    if (!playing) {
        mediaSource.connect(panL);
        mediaSource.connect(delay);
        playing = true;
    } else {
        mediaSource.disconnect(panL);
        mediaSource.disconnect(delay);
        playing = false;
    }
};

// Load in the base html tags based on the default sizes.
createDelay();
