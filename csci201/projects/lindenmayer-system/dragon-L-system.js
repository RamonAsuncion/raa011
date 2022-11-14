
/* 
* Alphabet : set of symbols 
* Axiom : initial state
* Rules: replace the symbols
*/ 

const NUM_GENERATIONS = 6; // Amount of generations. 
const ANGLE = 90; // Angle  of the shape.
const LEN = 50; // Length of the each branch
const DELAY = 1000 // ms

// CANVAS SIZE
const X = 1200;
const Y = 550;


let sentence = "F"; // Axiom
let graphicalRules;
let currentGeneration = 1;

// Set the rules for the L-System 
let rules = {
  F: ["F-H"],
  H: ["F+H"]
}

// Color Generation
let red;
let green;
let blue;

function colorGeneration() {
  // Random color.
  red = random(10, 255);
  green = random(10, 255); 
  blue = random(10, 255); 

  // The color of the line.
  stroke(red, green, blue);

  // The line thickness.
  strokeWeight(3);
}


function setup() {
  // Define the size and background color of the cavas.
  createCanvas(X, Y);

  // Create the graphical rules (the alphabet).
  graphicalRules = {
    // Create the line for F (move foward).
    "F": () => {
      colorGeneration();
      line(0, 0, 0, -LEN);
      translate(0, -LEN);
    },
    // Create the line for H (move foward).
    "H": () => {
      colorGeneration();
      line(0, 0, 0, -LEN);
      translate(0, -LEN);
    },
    // Move right.
    "+" : () => {
      rotate(radians(ANGLE));
    },
    // Move left.
    "-": () => {
      rotate(radians(-ANGLE));
    },
    // Save the previous state onto stack.
    "[": () => {
      push();
    },
    // Restore the previous state from the stack.
    "]": () => {
      pop();
    }
  };

  // No looping the setup function.
  noLoop();
}

async function draw() {  
  // Set the font size of the text.
  textSize(20);

  for (let i = 1; i <= NUM_GENERATIONS; i++) {
    // Generate the first one, then generate each generation after step by step.
    if (i != 1) await new Promise(r => setTimeout(r, DELAY)); 
     
    // Clear background. up to the last element.
    if (i <= NUM_GENERATIONS) clear();

    // Generate the generation based on the current index.]
    text('Generation ' + i, X / 2, 25);

    // Generate the new generation.
    sentence = generate();

    push();
    
    // Draw the L-system relative to the middle.
    translate(width / 2 - 50 * 5, height / 2 - 50);

    // Call the appropriate drawing functions based on the rules.
    for (let i = 0; i < sentence.length; i++) {
      let c = sentence[i]
      // The user given rules is in the graphical rules.
      if (c in graphicalRules)  {
        graphicalRules[c]();
      }
    }
  
    pop(); 
  }
}

function generate() {
  let rule = "" // Empty new rule.
  for(let i = 0; i < sentence.length; i++) {
    let c = sentence[i];
    // The user given sentence is in the computation rules.
    if(c in rules) {
      // Assign the defined rule.
      rule += rules[c];
    } else {
      // Add the current sentence again.
      rule += c;
    }
  }
  return rule;
}