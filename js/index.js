// Game Constants & Variables
let inputDir = {x: 0, y: 0}; 
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
let speed = 7;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{x: 13, y: 15}];
let food = {x: 6, y: 7};

// Load High Score
let hiscore = localStorage.getItem("hiscore");
let hiscoreval = hiscore ? JSON.parse(hiscore) : 0;
document.getElementById("hiscoreBox").innerHTML = "HiScore: " + hiscoreval;

// Game Loop
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;
    lastPaintTime = ctime;
    gameEngine();
}

// Collision Detection
function isCollide(snake) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) return true;
    return false;
}

// Game Engine
function gameEngine() {
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        alert("Game Over! Press any key to restart.");
        inputDir = {x: 0, y: 0};
        snakeArr = [{x: 13, y: 15}];
        score = 0;
        document.getElementById("scoreBox").innerHTML = "Score: 0";
        musicSound.play();
    }

    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        foodSound.play();
        score++;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            document.getElementById("hiscoreBox").innerHTML = "HiScore: " + hiscoreval;
        }
        document.getElementById("scoreBox").innerHTML = "Score: " + score;
        snakeArr.unshift({x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y});
        food = {x: 2 + Math.floor(Math.random() * 15), y: 2 + Math.floor(Math.random() * 15)};
    }

    for (let i = snakeArr.length - 2; i >= 0; i--) { 
        snakeArr[i + 1] = {...snakeArr[i]};
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    document.getElementById("board").innerHTML = "";
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add(index === 0 ? 'head' : 'snake');
        document.getElementById("board").appendChild(snakeElement);
    });

    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    document.getElementById("board").appendChild(foodElement);
}

// Prevent Scrolling on Mobile (≤ 600px)
if (window.innerWidth <= 600) {
    document.addEventListener("touchmove", e => e.preventDefault(), { passive: false });
}

// Touch Controls for Mobile
let touchStartX = 0, touchStartY = 0;
let touchEndX = 0, touchEndY = 0;

function handleGesture() {
    let dx = touchEndX - touchStartX;
    let dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 50) inputDir = { x: 1, y: 0 }; // Right Swipe
        else if (dx < -50) inputDir = { x: -1, y: 0 }; // Left Swipe
    } else {
        if (dy > 50) inputDir = { x: 0, y: 1 }; // Down Swipe
        else if (dy < -50) inputDir = { x: 0, y: -1 }; // Up Swipe
    }
}

// Activate only on small screens (max-width: 600px)
if (window.innerWidth <= 600) {
    document.addEventListener("touchstart", e => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    document.addEventListener("touchend", e => {
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;
        handleGesture();
    });
}

// Keyboard Controls Only
window.addEventListener('keydown', e => {
    moveSound.play();
    if (e.key === "ArrowUp") inputDir = {x: 0, y: -1};
    if (e.key === "ArrowDown") inputDir = {x: 0, y: 1};
    if (e.key === "ArrowLeft") inputDir = {x: -1, y: 0};
    if (e.key === "ArrowRight") inputDir = {x: 1, y: 0};
});


//Reset the hiscore in mobile view
let resetTimeout; // Variable to store the timeout function
const hiscoreBox = document.getElementById("hiscoreBox");

hiscoreBox.addEventListener("touchstart", () => {
    // Start a timer when the user touches the HiScore box
    resetTimeout = setTimeout(() => {
        localStorage.removeItem("hiscore"); // Clear stored HiScore
        hiscoreval = 0; // Reset HiScore variable
        hiscoreBox.innerHTML = "HiScore: 0"; // Update UI
        alert("HiScore has been reset!"); // Notify user
    }, 2000); // 2-second delay
});

hiscoreBox.addEventListener("touchend", () => {
    // If the user lifts their finger before 2 seconds, cancel the reset
    clearTimeout(resetTimeout);
});


window.requestAnimationFrame(main);
