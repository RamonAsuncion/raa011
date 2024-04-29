// Slider library.
const swiper = new Swiper('.swiper-container', {
  slidesPerView: 1,
  centeredSlides: true,
  spaceBetween: 30,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    bulletClass: 'custom-swiper-pagination-bullet',
    renderBullet: function (index, className) {
      const labels = ['Random Questions', 'Calculator', 'Exam II Question'];
      return '<span class="' + className + '">' + labels[index] + '</span>';
    },
  },
});

// Rules
const MAX_ATTEMPTS = 5;

// Calculation for the System (Do not touch).
let attempts = MAX_ATTEMPTS;
let EXAM_QUESTION = false
let CALCULATOR_QUESTION = false
let clockCycleTime;
let clockSpeed
let averageCPI;
let executionTimeSeconds;
let AMAT;
let hitRate;
let cacheHitTime;
let CPI_nonMemory;
let cacheMissRate;
let memoryInstructions;
let totalInstructions;
let memoryAccessTime;

// Update the text based on the attemps.
document.getElementById('attempts').innerText = attempts;

function getValue(id) {
  const elem = document.getElementById(id);
  return parseFloat(CALCULATOR_QUESTION && elem.tagName === 'INPUT' ? elem.value : elem.innerText);
}

// eslint-disable-next-line no-unused-vars
function calculateValues() {
  if (attempts <= 0) {
    alert('You have no attempts left.');
    return;
  }

  clockSpeed = getValue('clockSpeedPlaceholder');
  memoryAccessTime = getValue('memoryAccessTimePlaceholder');
  totalInstructions = getValue('totalInstructionsPlaceholder');
  memoryInstructions = getValue('memoryInstructionsPlaceholder');
  cacheMissRate = getValue('cacheMissRatePlaceholder') / 100;
  cacheHitTime = getValue('cacheHitTimePlaceholder');
  CPI_nonMemory = Number(getValue('cpi'));

  clockCycleTime = 1 / clockSpeed; // 1/2GHz = 0.5 ns
  hitRate = 1 - cacheMissRate;
  AMAT = hitRate * cacheHitTime + cacheMissRate * memoryAccessTime;
  averageCPI = memoryInstructions * CPI_nonMemory + (1 - memoryInstructions) * AMAT * clockSpeed
  executionTimeSeconds = (totalInstructions * averageCPI) / clockSpeed

  checkAnswer('userClockCycleTime', formatNumber(clockCycleTime), 'clockCycleTime');
  checkAnswer('userAMAT', formatNumber(AMAT), 'AMAT');
  checkAnswer('userAverageCPI', formatNumber(averageCPI), 'averageCPI');
  checkAnswer('userTotalTime', formatNumber(executionTimeSeconds), 'totalTime');

  attempts -= 1;
  document.getElementById('attempts').innerText = attempts;
  if (attempts === 0) {
    if (EXAM_QUESTION) {
      showExamCorrectAnswers();
    } else  {
      showCorrectAnswers();
    }
  }
}

function formatNumber(num) {
  return num % 1 === 0 ? num : parseFloat(num.toFixed(1));
}

function checkAnswer(userInputId, correctAnswer, outputId) {
  let userAnswer = '';
  try {
    const userInput = document.getElementById(userInputId).value;
    userAnswer = parseFloat(userInput);
  } catch (error) {
    return;
  }

  if (userAnswer === '' || Number.isNaN(userAnswer)) {
    document.getElementById(userInputId).classList.remove('correct');
    document.getElementById(userInputId).classList.remove('incorrect');
    document.getElementById(outputId).innerText = '';
    return;
  }

  if (Math.abs(userAnswer - correctAnswer) >= 0.01) {
    document.getElementById(userInputId).classList.add('incorrect');
    document.getElementById(userInputId).classList.remove('correct');
    document.getElementById(outputId).innerText = 'Incorrect';
  } else {
    document.getElementById(userInputId).classList.add('correct');
    document.getElementById(userInputId).classList.remove('incorrect');
    document.getElementById(outputId).innerText = '';
  }
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function generateRandomValues() {
  document.getElementById('clockSpeedPlaceholder').innerText = (Math.random() * 2 + 1).toFixed(0);
  document.getElementById('memoryAccessTimePlaceholder').innerText = (Math.random() * 100 + 50).toFixed(0);
  document.getElementById('totalInstructionsPlaceholder').innerText = `${Math.floor(Math.random() * 2 + 1)} billion`;
  let randomValue = (Math.floor(getRandomArbitrary(0.1, 1) * 10) / 10).toFixed(1);
  document.getElementById('memoryInstructionsPlaceholder').innerText = `${randomValue} billion`;
  document.getElementById('cacheMissRatePlaceholder').innerText = (Math.random() * 10).toFixed(0);
  document.getElementById('cacheHitTimePlaceholder').innerText = (Math.random() * 5 + 1).toFixed(0);
}

function checkExamValues() {
  document.getElementById('clockSpeedPlaceholder').innerText = '2';
  document.getElementById('memoryAccessTimePlaceholder').innerText = '120'
  document.getElementById('totalInstructionsPlaceholder').innerText = '4 billion'
  document.getElementById('memoryInstructionsPlaceholder').innerText = '0.8 billion'
  document.getElementById('cacheMissRatePlaceholder').innerText = '5';
  document.getElementById('cacheHitTimePlaceholder').innerText = '0.5';
}


function showCorrectAnswers() {
  document.getElementById('clockCycleTime').innerText = `1/${clockSpeed}GHz\nCorrect answer: ${clockCycleTime.toFixed(1)} ns`;
  document.getElementById('AMAT').innerText = `AMAT = ${hitRate}*${cacheHitTime}+(${memoryAccessTime}+${cacheHitTime})*${cacheMissRate}\nCorrect answer: ${AMAT.toFixed(1)} ns`;
  document.getElementById('averageCPI').innerText = `average CPI = (${(totalInstructions - memoryInstructions)}/2)*${CPI_nonMemory}+(${(memoryInstructions).toFixed(1)}/2)*${AMAT.toFixed(1)}*${clockSpeed}\nCorrect answer: ${averageCPI.toFixed(1)} cycles`;
  document.getElementById('totalTime').innerText = `CPU time = ${totalInstructions}*${averageCPI.toFixed(1)}/${clockSpeed}\nCorrect answer: ${executionTimeSeconds.toFixed(1)} s`;
  if (EXAM_QUESTION) {
    checkExamValues();
  } else {
    generateRandomValues();
  }
  attempts = MAX_ATTEMPTS;
  document.getElementById('attempts').innerText = attempts;
}

function showExamCorrectAnswers() {
  document.getElementById('clockCycleTime').innerText = `1/${clockSpeed}GHz\nCorrect answer: ${clockCycleTime.toFixed(1)} ns`;
  document.getElementById('AMAT').innerText = `AMAT = ${hitRate}*${cacheHitTime}+(${memoryAccessTime}+${cacheHitTime})*${cacheMissRate}\nCorrect answer: ${AMAT.toFixed(1)} ns`;
  document.getElementById('averageCPI').innerText = `average CPI = ${memoryInstructions}*${CPI_nonMemory}+${(1-memoryInstructions).toFixed(1)}*(${AMAT.toFixed(1)}*${clockSpeed})\nCorrect answer: ${averageCPI.toFixed(1)} cycles`;
  document.getElementById('totalTime').innerText = `CPU time = ${totalInstructions}*${averageCPI.toFixed(1)}/${clockSpeed}\nCorrect answer: ${executionTimeSeconds.toFixed(1)} s`;
  if (EXAM_QUESTION) {
    checkExamValues();
  } else {
    generateRandomValues();
  }
  attempts = MAX_ATTEMPTS;
  document.getElementById('attempts').innerText = attempts;
}

const inputFields = document.querySelectorAll('input[type="text"]');

inputFields.forEach(input => {
  input.addEventListener('keydown', e => {
    if (e.code === 'Enter') {
      calculateValues();
    }
  });
});

function convertToInput(elements) {
  elements.forEach(elementId => {
    const element = document.getElementById(elementId);
    const value = element.value;
    const input = document.createElement('input');
    input.type = 'number';
    input.step = 'any';
    input.value = value;
    input.id = elementId;
    input.readOnly = false;
    element.replaceWith(input);
  });
}

function revertToText(elements) {
  elements.forEach(elementId => {
    const input = document.getElementById(elementId);
    const value = input.value;
    const span = document.createElement('span');
    span.innerText = value;
    span.id = elementId;
    input.replaceWith(span);
  });
}

function handleSlideChange(activeIndex) {
  const elementIds = [
    'clockSpeedPlaceholder',
    'memoryAccessTimePlaceholder',
    'totalInstructionsPlaceholder',
    'memoryInstructionsPlaceholder',
    'cacheMissRatePlaceholder',
    'cacheHitTimePlaceholder',
    'cpi'
  ];

  if (activeIndex === 1) {
    CALCULATOR_QUESTION = true
    convertToInput(elementIds);
  } else {
    revertToText(elementIds);
  }

  if (activeIndex === 0) {
    const randomNumber = Math.floor(Math.random() * 3) + 1;
    document.getElementById('cpi').innerText = randomNumber;
    generateRandomValues();
    EXAM_QUESTION = false;
    CALCULATOR_QUESTION = false
  } else if (activeIndex === 2) {
    document.getElementById('cpi').innerText = '1';
    EXAM_QUESTION = true;
    CALCULATOR_QUESTION = false
    checkExamValues();
  }
}

swiper.on('slideChange', () => {
  const activeIndex = swiper.activeIndex;
  handleSlideChange(activeIndex);
});

generateRandomValues();
