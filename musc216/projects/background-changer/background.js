let red;
let green;
let blue;

// Helper function to convert RGB to Hex
function convertRGB(color) {
    const hex = color.toString(16); // hex color code is a base 16 number
    return hex.length === 1 ? `0${hex}` : hex; // if 1 add 0 to hex if not just add hex.
}

// Convert rgb values (0, 0, 0) to hex code #fffff
function convertRGBtoHex(r, g, b) {
    return `#${convertRGB(r)}${convertRGB(g)}${convertRGB(b)}`;
}

document.getElementById('slider').oninput = () => {
    red = Math.floor(Math.random() * 255); // Returns random intergers from 0 to 255.
    green = Math.floor(Math.random() * 255);
    blue = Math.floor(Math.random() * 255);

    // Update the text tag with the background color in hex form.
    document.getElementById('label').innerHTML = convertRGBtoHex(red, green, blue);

    // Change the background color in RGB form.
    document.body.style.backgroundColor = `rgb(${red},${green},${blue})`;
};
