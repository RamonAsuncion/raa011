const memory = [200, 300, 400, 500, 600];
let processSize = 0;

function displayMemoryBlocks() {
    const blocksContainer = document.querySelector('.blocks');
    blocksContainer.innerHTML = '';

    for (let i = 0; i < memory.length; i += 1) {
        const block = document.createElement('div');
        block.className = 'block';
        block.style.width = `${memory[i]}px`;
        block.style.backgroundColor = '#87CEEB';
        block.innerHTML = `<div>${memory[i]}</div><div>${memory[i]}</div>`;
        blocksContainer.appendChild(block);
    }
}

// eslint-disable-next-line no-unused-vars
function allocateMemory(strategy) {
    const processSizeInput = document.getElementById('processSize');
    processSize = parseInt(processSizeInput.value, 10);

    // eslint-disable-next-line no-restricted-globals
    if (isNaN(processSize) || processSize <= 0) {
        alert('Please enter a valid process size.');
        return;
    }

    if (strategy === 'firstFit') {
        allocateFirstFit();
    } else if (strategy === 'bestFit') {
        allocateBestFit();
    } else if (strategy === 'worstFit') {
        allocateWorstFit();
    }

    displayMemoryBlocks();
}

/**
 * Allocates the first hole that is big enough.
 * @returns {number} index of the memory block where the process was allocated
 */
// eslint-disable-next-line consistent-return
function allocateFirstFit() {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < memory.length; i++) {
        if (memory[i] >= processSize) {
            memory[i] -= processSize;
            return displayResult(i);
        }
    }
    displayResult(-1);
}

/**
 * Allocates the smallest hole that is big enough.
 * It must search the entire list, unless it is sorted by size.
 * Produces the smallest leftover hole.
 * @returns {number} index of the memory block where the process was allocated`
 * 
 */
// eslint-disable-next-line consistent-return
function allocateBestFit() {
    let bestFitIndex = -1;
    let bestFitSize = Number.POSITIVE_INFINITY;

    // go through each memory block and find the smallest one that can fit the process
    for (let i = 0; i < memory.length; i += 1) {
        if (memory[i] >= processSize && memory[i] < bestFitSize) {
            bestFitSize = memory[i];
            bestFitIndex = i;
        }
    }

    // if a memory block was found, allocate the process to it
    if (bestFitIndex !== -1) {
        memory[bestFitIndex] -= processSize;
        return displayResult(bestFitIndex);
    }

    displayResult(-1);
}

/**
 * Allocate the largest hole.
 * Must also search entire list.
 * @returns {number} index of the memory block where the process was allocated
 */
// eslint-disable-next-line consistent-return
function allocateWorstFit() {
    let worstFitIndex = -1;
    let worstFitSize = -1;

    for (let i = 0; i < memory.length; i += 1) {
        // go through each memory block and find the largest one that can fit the process
        if (memory[i] >= processSize && memory[i] > worstFitSize) {
            worstFitSize = memory[i];
            worstFitIndex = i;
        }
    }

    // if a memory block was found, allocate the process to it
    if (worstFitIndex !== -1) {
        memory[worstFitIndex] -= processSize;
        return displayResult(worstFitIndex);
    }

    displayResult(-1);
}

function displayResult(index) {
    const resultDisplay = document.getElementById('allocationResult');
    if (index !== -1) {
        resultDisplay.textContent = `Allocated at block ${index}.`;
    } else {
        resultDisplay.textContent = 'Memory allocation failed.';
    }
}

displayMemoryBlocks();
