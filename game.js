const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;

// Load the player image (shekhasina.jpg)
const playerImg = new Image();
playerImg.src = "shekhasina.jpg"; 

// Player properties
let player = { 
    x: 50, 
    y: 140, 
    width: 65, 
    height: 60, 
    jumping: false, 
    yVelocity: 0 
};

// Obstacle properties (White box to make it visible on black background)
let obstacle = { 
    x: 400, 
    y: 170, 
    width: 20, 
    height: 30, 
    speed: 4 
};

// Jump function
function jump() {
    if (!player.jumping) {
        player.yVelocity = -10; // Pushes the player upwards
        player.jumping = true;
    }
}

// Main Game Loop
function gameLoop() {
    // 1. Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Gravity logic
    player.yVelocity += 0.5; 
    player.y += player.yVelocity;

    // Prevent falling below ground level
    if (player.y >= 140) {
        player.y = 140;
        player.jumping = false;
    }

    // 3. Obstacle movement
    obstacle.x -= obstacle.speed;
    if (obstacle.x < -20) {
        obstacle.x = 400; // Reset obstacle to the right side
        score += 1;       // Earn 1 point
    }

    // 4. Draw the Player Image
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

    // 5. Draw the Obstacle
    ctx.fillStyle = "white"; 
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

    // 6. Draw the Score
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText("Score: " + score, 10, 20);

    // 7. Draw Custom Credit Text on the top right
    ctx.fillStyle = "#00FFCC"; // Neon Cyan color
    ctx.font = "bold 12px Arial";
    ctx.fillText("Made by Fahim 14 years old", 220, 20);

    // Keep running the loop
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
