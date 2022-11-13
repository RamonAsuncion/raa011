
/* 
* Alphabet : set of symbols 
* Axiom : initial state
* Rules: replace the symbols
*/ 

const NUM_GENERATIONS = 6; // How many iterations 
const ANGLE = 90; // Angle  of the shape.
const LEN = 50; // Length of the each branch
let sentence = "F"; // Axiom
let graphicalRules;

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
  createCanvas(1000, 500);

  // Create the graphical rules (the alphabet).
  graphicalRules = {
    // Create the line for F.
    "F": () => {
      colorGeneration();
      line(0, 0, 0, -LEN);
      translate(0, -LEN);
    },
    // Create the line for H.
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

function draw() {
  // Create a text of what generation the l-system is on.
  textSize(20);
  text('Generation ' + NUM_GENERATIONS, 10, 30);

  // Draw the system in the middle.
  translate(width / 2, height / 2);
  
  // Generate the new string.
  for (let i = 1; i <= NUM_GENERATIONS; i++) {
    sentence = generate();
  }  

  push();
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