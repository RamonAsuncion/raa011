/*
* Ojective: Use P5Js and ML5js
*/

let videoCapture;
let label;
let classifier;
let flippedVideo;

const imageModelURL = "./model/"

function preload() {
    classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
    createCanvas(550, 500);

    videoCapture = createCapture(VIDEO);
    videoCapture.size(550, 450);
    videoCapture.hide();

    flippedVideo = ml5.flipImage(videoCapture);
    classifyVideo();
}

function draw() {
    background(32);
    image(flippedVideo, 0, 0);

    createLabel();

    let emoji;
    if (label == "Phone") {
        emoji = "📱";
    } 
    else if (label == "Book") {
        emoji = "📚 ";
    }
    else if (label == "CD") {
        emoji = "💿";
    }
    else if (label == "Pencil") {
        emoji = "✏️";
    }
    else if (label == "Shoe") {
        emoji = "👟";
    }

    // Draw the emoji
    textSize(45);
    text(emoji, width / 2, height - 70);
}

function createLabel() {
     // Draw the label
     textAlign(CENTER);
     fill(255);
     text(label, width / 2, height - 4);
}


function classifyVideo() {
    flippedVideo = ml5.flipImage(videoCapture)
    classifier.classify(flippedVideo, gotResult);
    flippedVideo.remove();
}

// When we get a result
function gotResult(error, results) {
    // If there is an error
    if (error) {
      console.error(error);
      return;
    }

    if (results[0].confidence > 0.85) {
        label = results[0].label
    } else {
        label = "";
    }

    classifyVideo();
}

