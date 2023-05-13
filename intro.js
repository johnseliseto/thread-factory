const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const grid = [];
let countdown = 3;
ctx.font = "24px 'Comic Sans MS'";
const backgroundMusic = new Audio("./audio/game-music-loop-2-144037.mp3");

backgroundMusic.loop = true; // The music will play in a loop
backgroundMusic.volume = 0.5; // Set the volume to 50%


for (let i = 0; i < 20; i++) {
  grid.push(new Array(10).fill(false));
}

const images = {
  red: new Image(),
  blue: new Image(),
  green: new Image(),
  yellow: new Image()
};

images.red.src = "./images/Rojo.png";
images.blue.src = "./images/Azul.png";
images.green.src = "./images/Verde.png";
images.yellow.src = "./images/Amarillo.png";

let speed = 0.05; // speed of the square
let horizontalSpeed = 0;
const squares = []; // array to store the squares that are no longer moving
/*const pauseBtn = document.getElementById("pause-btn");*/
const colorPoints = {
  red: 10,
  blue: 20,
  green: 30,
  yellow: 40
};

let score = 0;
let currentChallenge;
let colorCounts = {
  red: 0,
  blue: 0,
  green: 0,
  yellow: 0
};
// Get the width of the game canvas
const canvasWidth = canvas.width;

// Get the challenge container element
const challengeContainer = document.getElementById("challenge-container");

// Set the width of the container equal to the canvas width
challengeContainer.style.width = `${canvasWidth}px`;


// Get the canvas element for challenges
const challengeCanvas = document.getElementById("challenge-canvas");
const challengeCtx = challengeCanvas.getContext("2d");

// Function to draw the challenges on the canvas
function drawChallenge() {
  challengeCtx.clearRect(0, 0, challengeCanvas.width, challengeCanvas.height);
  challengeCtx.fillStyle = "black";
  challengeCtx.font = "20px Arial";
  challengeCtx.textAlign = "center";
  challengeCtx.fillText(`Collect ${currentChallenge.red} red, ${currentChallenge.blue} blue, ${currentChallenge.green} green and ${currentChallenge.yellow} y yellow.`, challengeCanvas.width / 2, challengeCanvas.height / 2);
}

// Function to update the challenge text on the canvas
function updateChallengeText() {
  drawChallenge();
}

/*pauseBtn.addEventListener("click", function () {
  speed = 0;
});*/

// Event listener for keydown event
document.addEventListener("keydown", event => {
  if (event.keyCode === 37) { // Left arrow key
    if (!checkCollisions(square, -1)) {
      square.x -= 1; // // Move the square to the left
    }
  } else if (event.keyCode === 39) { // Right arrow key
    if (!checkCollisions(square, 1)) {
      square.x += 1; // Move the square to the right
    }
  } else if (event.keyCode === 40) { // Down arrow key
    speed = 0.5; // Increase the speed of the square
  }
});

// Event listener for keyup event
document.addEventListener("keyup", event => {
  if (event.keyCode === 40) { // Down arrow key
    speed = 0.05; // Return to normal speed of the square
  }
});

// Function to generate a new challenge
function generateNewChallenge() {
  const colors = ["red", "blue", "green", "yellow"];
  const color1 = colors[Math.floor(Math.random() * colors.length)];
  let color2 = colors[Math.floor(Math.random() * colors.length)];

  while (color2 === color1) {
    color2 = colors[Math.floor(Math.random() * colors.length)];
  }

  return {
    [color1]: Math.floor(Math.random() * 3) + 1,
    [color2]: Math.floor(Math.random() * 3) + 1
  };
}

function generateNewSquare(speed) {
  const colors = ["red", "blue", "green", "yellow"]; // Available colors
  const randomColor = colors[Math.floor(Math.random() * colors.length)]; // Random color

  const square = {
    x: Math.floor(Math.random() * 5),
    y: 0,
    color: randomColor,
    size: 80,
    speed: speed
  };

  return square;
}


function checkCollisions(square, offsetX = 0, offsetY = 0) {
  const nextX = square.x + offsetX;
  const nextY = Math.round(square.y + offsetY);

  if (nextX < 0 || nextX >= 5 || nextY >= 10) {
    return true;
  }

  if (nextY < 10 && grid[nextY][nextX] && grid[nextY][nextX] !== square.color) {
    return true;
  }

  return false;
}

// Function to update the challenge text on the canvas
function updateChallengeText() {
  const challengeText = document.getElementById("challenge-text");
  let text = "Collect ";
  for (const color in currentChallenge) {
    text += currentChallenge[color] + " " + color + " ";
  }
  challengeText.textContent = text;
}
function startGame() {
  backgroundMusic.play(); // Play the background music when the game starts
  gameLoop();
}

function showGameOver() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "72px 'Press Start 2P', Arial";
  ctx.textAlign = "center";
  ctx.fillText("Try Again", canvas.width / 2, canvas.height / 2);
}

function checkGameOver() {
  for (let i = 0; i < squares.length; i++) {
    const s = squares[i];
    if (s.y <= 0) {
      return true; // Game Over if any square reaches the top of the screen
    }
  }
  return false;
}

function gameLoop() {
  // Check for Game Over
  if (checkGameOver()) {
    showGameOver();
    return; // End the gameLoop to stop the game after showing "Game Over"
  }
  if (checkCollisions(square, 0, speed)) {
    colorCounts[square.color]++;
    const posY = Math.round(square.y);
    squares.push({ ...square, y: posY });
    grid[posY][square.x] = true;
    square = generateNewSquare(speed);
    let challengeCompleted = true;
    for (const color in currentChallenge) {
      if (colorCounts[color] < currentChallenge[color]) {
        challengeCompleted = false;
        break;
      }
    }
    if (challengeCompleted) {
      score += 10; // Increase the score by 10
      currentChallenge = generateNewChallenge(); // Generate a new challenge
      updateChallengeText(); // Update the challenge text on the canvas
      
      colorCounts = {
        red: 0,
        blue: 0,
        green: 0,
        yellow: 0
      }; // Reset the color counts
    }
  } else {
    square.y += speed; // Move the square downwards
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);

   // Adjust the dimensions of the squares and the grid
   const squareSize = Math.floor(canvas.width / 5); // Size of the squares
   const gridSizeX = 5; // Number of columns in the grid
   const gridSizeY = 10; // Number of rows in the grid

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 5; j++) {
      ctx.beginPath();
      ctx.rect(j * squareSize, i * squareSize, squareSize, squareSize);
      ctx.strokeStyle = "grey";
      ctx.stroke();
    }
  }

  for (let i = 0; i < squares.length; i++) {
    const s = squares[i];
    ctx.drawImage(images[s.color], s.x * squareSize, s.y * squareSize, squareSize, squareSize);
  }
  
  ctx.drawImage(images[square.color], square.x * squareSize, Math.round(square.y) * squareSize, squareSize, squareSize);
  
  ctx.fillStyle = "white";
  ctx.font = "40px Arial";
  ctx.fillText("Score: " + score, 10, 40);
  requestAnimationFrame(gameLoop); // Recursively call the game loop for smooth animation
}

function checkGameOver() {
  // Logic to check if the Game Over condition is met
  // Returns true if met, false otherwise
  // For example, if the squares reach the top of the canvas
  return squares.some(square => square.y <= 0);
}

function showGameOver() {
  // Logic to display "Game Over"
  // For example, draw a large retro arcade-style text in the center of the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "34px 'Press Start 2P'";
  ctx.textAlign = "center";
  ctx.fillText("Try Again", canvas.width / 2, canvas.height / 2);
}

// Generate the first random square
let square = generateNewSquare();
currentChallenge = generateNewChallenge();
updateChallengeText();
startGame();