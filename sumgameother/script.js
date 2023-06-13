// game settings
const gridSize = 20;
const numBlocks = 15; // update the number of eatable blocks
const boardSize = 400;
const playerSize = 20;
const moveDelay = 180; // delay in milliseconds
const blockTransitionDuration = "0.1s"; // transition duration in CSS format

// Game state
let collectedBlocks = 0;
let canMove = true;
let startTime;

// Generate random coordinates for blocks
function generateBlocks() {
  const blocks = [];
  for (let i = 0; i < numBlocks; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    const x = Math.floor(Math.random() * gridSize) * 20;
    const y = Math.floor(Math.random() * gridSize) * 20;
    block.style.left = x + "px";
    block.style.top = y + "px";
    block.style.transitionDuration = blockTransitionDuration;
    blocks.push({ x, y, element: block });
    document.getElementById("game-board").appendChild(block);
  }
  return blocks;
}

// Move the eatable blocks
function moveBlocks() {
  const blocks = document.getElementsByClassName("block");
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const x = parseInt(block.style.left);
    const y = parseInt(block.style.top);

    // Generate a random direction
    const directions = [-20, 20];
    const randomX = directions[Math.floor(Math.random() * directions.length)];
    const randomY = directions[Math.floor(Math.random() * directions.length)];

    // Update block position
    const newX = x + randomX;
    const newY = y + randomY;
    if (
      newX >= 0 &&
      newX <= boardSize - playerSize &&
      newY >= 0 &&
      newY <= boardSize - playerSize
    ) {
      block.style.left = newX + "px";
      block.style.top = newY + "px";
    }
  }
}

// Move the player
function movePlayer(event) {
  if (!canMove) return;

  canMove = false;
  setTimeout(() => {
    canMove = true;
  }, moveDelay);

  const player = document.getElementById("player");
  let x = parseInt(player.style.left) || 0;
  let y = parseInt(player.style.top) || 0;

  switch (event.keyCode) {
    case 37: // Left arrow key
      if (x > 0) x -= 20;
      break;
    case 38: // Up arrow key
      if (y > 0) y -= 20;
      break;
    case 39: // Right arrow key
      if (x < boardSize - playerSize) x += 20;
      break;
    case 40: // Down arrow key
      if (y < boardSize - playerSize) y += 20;
      break;
  }

  // Check if the player collected a block
  const blocks = document.getElementsByClassName("block");
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (x === parseInt(block.style.left) && y === parseInt(block.style.top)) {
      block.remove();
      collectedBlocks++;
      if (collectedBlocks === numBlocks) {
        const endTime = new Date().getTime();
        const timeElapsed = (endTime - startTime) / 1000; // Convert to seconds
        alert(
          "Congratulations! You collected all the blocks in " +
            timeElapsed +
            "s!"
        );
        restartGame();
      }
      break;
    }
  }

  // Update player position
  player.style.left = x + "px";
  player.style.top = y + "px";
}

// Restart the game
function restartGame() {
  collectedBlocks = 0;
  const blocks = generateBlocks();
  startTimer();
}

// Start the game
function startGame() {
  const blocks = generateBlocks();
  startTimer();
  setInterval(moveBlocks, 1000); // Update the blocks' position every second
  window.addEventListener("keydown", movePlayer);
  window.addEventListener("keyup", function (event) {
    if (event.keyCode === 32 && collectedBlocks === numBlocks) {
      restartGame();
    }
  });
}

// Start the timer
function startTimer() {
  startTime = new Date().getTime();
  updateTimer();
}

// Update the timer
function updateTimer() {
  const currentTime = new Date().getTime();
  const timeElapsed = (currentTime - startTime) / 1000; // Convert to seconds
  const timerElement = document.getElementById("timer");
  timerElement.textContent = "Time: " + timeElapsed.toFixed(1) + "s";
  requestAnimationFrame(updateTimer);
}

startGame();
