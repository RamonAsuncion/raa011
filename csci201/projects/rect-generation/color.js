// Using p5.js.

// The color of the rectangles.
let red;
let green;
let blud;

// The size of the rectangles.
let rectangleLength;
let rectangleWidth;

// The max and min size of the rectnagles.
const MAX_SIZE = 200;
const MIN_SIZE = 50;

function setup() {
    createCanvas(windowWidth, windowHeight);
    randomColor();
    randomSize();  
    userDetails();
    noLoop();
}

function userDetails() {
    fill(color(0, 0, 0));
    textSize(32);
    text('Hold down to draw!', 10, 30);
    textSize(20);
    text('Press backspace to clear.', 10, 55); 
}

function draw() {
    fill(color(red, green, blue));
    rect(mouseX, mouseY, rectangleLength, rectangleWidth);
}

function keyPressed() {
    if (keyCode == BACKSPACE) {
        clear();
        userDetails();
    }
}

function mousePressed() {
    loop();
}
  
function mouseReleased() {
    noLoop();
}

function randomColor(){
    setInterval(() => {
        red = random(0, 255);
        green = random(0, 255);
        blue = random(0, 255);
    }, 100)
}

function randomSize() {
    setInterval(() => {
        rectangleLength = random(MIN_SIZE, MAX_SIZE);
        rectangleWidth = random(MIN_SIZE, MAX_SIZE);
    }, 100)
}