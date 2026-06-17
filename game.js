const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let isGameOver = false;

// Animation properties for when the player dies
let deathAnimationTimer = 0;
let playerRotation = 0;

// Load the player image
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

// Obstacle properties
let obstacle = { 
    x: 400, 
    y: 170, 
    width: 20, 
    height: 30, 
    speed: 4 
};

// Jump function (Disabled if game is over)
function jump() {
    if (isGameOver) {
        resetGame(); // Clicking jump after dying will restart the game
        return;
    }
    
    if (!player.jumping) {
        player.yVelocity = -10; 
        player.jumping = true;
    }
}

// Function to reset the game back to normal
function resetGame() {
    score = 0;
    isGameOver = false;
    deathAnimationTimer = 0;
    playerRotation = 0;
    player.x = 50;
    player.y = 140;
    player.yVelocity = 0;
    player.jumping = false;
    obstacle.x = 400;
    obstacle.speed = 4;
}

// Main Game Loop
function gameLoop() {
    // 1. Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!isGameOver) {
        // --- NORMAL GAMEPLAY LOGIC ---
        
        // Gravity logic
        player.yVelocity += 0.5; 
        player.y += player.yVelocity;

        if (player.y >= 140) {
            player.y = 140;
            player.jumping = false;
        }

        // Obstacle movement
        obstacle.x -= obstacle.speed;
        if (obstacle.x < -20) {
            obstacle.x = 400; 
            score += 1;       
            obstacle.speed += 0.2; // Slowly make it faster to increase difficulty!
        }

        // COLLISION DETECTION (Bounding Box)
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            isGameOver = true; // Trigger death state!
        }

    } else {
        // --- DEATH ANIMATION LOGIC ---
        // The game stops, but we animate the player spinning and flying backwards
        if (deathAnimationTimer < 60) { 
            player.yVelocity += 0.3; // Gentle gravity drop during crash
            player.y += player.yVelocity;
            player.x -= 2;          // Knocked backwards slightly
            playerRotation += 0.1;  // Spin effect
            deathAnimationTimer++;
        }
    }

    // 4. Draw the Player Image (With Rotation Support for Death Animation)
    ctx.save(); // Save current canvas state
    // Move the canvas origin to the center of the player for correct spinning
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
    ctx.rotate(playerRotation);
    // Draw image centered on the origin
    ctx.drawImage(playerImg, -player.width / 2, -player.height / 2, player.width, player.height);
    ctx.restore(); // Restore canvas state back to normal

    // 5. Draw the Obstacle
    ctx.fillStyle = "white"; 
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

    // 6. Draw the Score
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText("Score: " + score, 10, 20);

    // 7. Draw Custom Credit Text
    ctx.fillStyle = "#00FFCC"; 
    ctx.font = "bold 12px Arial";
    ctx.fillText("Made by Fahim 14 years old", 220, 20);

    // 8. Draw "Game Over" Screen overlay
    if (isGameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)"; // Transparent black background overlay
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "red";
        ctx.font = "bold 30px Arial";
        ctx.fillText("GAME OVER", 110, 100);
        
        ctx.fillStyle = "white";
        ctx.font = "14px Arial";
        ctx.fillText("Press 'Jump' button to Play Again", 100, 130);
    }

    // Keep running the loop
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
