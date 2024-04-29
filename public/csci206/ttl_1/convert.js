let attemptsLeft = 3; // Initialize the number of attempts left to 3
let correctAnswer; // Declare a global variable to store the correct answer

function generateNumbers() {
    // Generate two random 4-bit binary numbers
    const num1 = Math.floor(Math.random() * 16).toString(2).padStart(4, '0');
    const num2 = Math.floor(Math.random() * 16).toString(2).padStart(4, '0');
    const sum = parseInt(num1, 2) + parseInt(num2, 2);

    // Truncate the overflow bit and convert the sum back to a 4-bit binary number
    // eslint-disable-next-line no-bitwise
    const truncatedSum = (sum & 15).toString(2).padStart(4, '0');

    // Display the numbers and the addition sign to the user
    document.getElementById('num1').textContent = num1;
    document.getElementById('num2').textContent = num2;

    console.log(truncatedSum);

    // Return the truncated sum to be used as the answer
    return truncatedSum;
}

// eslint-disable-next-line no-unused-vars
function checkAnswer() {
    // Get the user's answer from the input box
    const answer = document.getElementById('answer').value;

    // Check if the user's answer matches the correct answer
    if (answer === correctAnswer) {
        alert('Correct!');
        attemptsLeft = 3; // Reset the number of attempts left
        document.getElementById('answer').value = ''; // Clear the input box
        correctAnswer = generateNumbers(); // Assign a new value to correctAnswer
    } else {
        attemptsLeft -= 1; // Decrement the number of attempts left
        if (attemptsLeft > 0) {
            alert(`Incorrect. You have ${attemptsLeft} attempts left.`);
        } else {
            alert(`Incorrect. The correct answer is ${parseInt(correctAnswer, 2)}`);
            attemptsLeft = 3; // Reset the number of attempts left
            document.getElementById('answer').value = ''; // Clear the input box
            correctAnswer = generateNumbers(); // Assign a new value to correctAnswer
        }
    }
}

correctAnswer = generateNumbers(); // Assign the return value of generateNumbers() to correctAnswer
