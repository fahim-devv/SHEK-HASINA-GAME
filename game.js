const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let highScore = 0; // Added a High Score to track your best runs!
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
    baseSpeed: 4,  // Starting speed
    speed: 4       // Current speed (will increase)
};

// Jump function (Disabled if game is over)
function jump() {
    if (isGameOver) {
        resetGame(); // Clicking jump after dying will restart the game
        return;
    }
    
    if (!player.jumping) {
        // Dynamic Jump: If the obstacle gets crazy fast, give the player a tiny jump boost
        let jumpBoost = obstacle.speed > 8 ? -11 : -10;
        player.yVelocity = jumpBoost; 
        player.jumping = true;
    }
}

// Function to reset the game back to normal
function resetGame() {
    // Save high score before resetting
    if (score > highScore) {
        highScore = score;
    }
    
    score = 0;
    isGameOver = false;
    deathAnimationTimer = 0;
    playerRotation = 0;
    player.x = 50;
    player.y = 140;
    player.yVelocity = 0;
    player.jumping = false;
    
    obstacle.x = 400;
    obstacle.speed = obstacle.baseSpeed; // Reset speed back to slow
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
            
            // --- DIFFICULTY UPGRADE ---
            // Every point makes the game 12% faster!
            obstacle.speed = obstacle.baseSpeed + (score * 0.5); 
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
        if (deathAnimationTimer < 60) { 
            player.yVelocity += 0.3; 
            player.y += player.yVelocity;
            player.x -= 2;          // Knocked backwards slightly
            playerRotation += 0.15; // Spins faster depending on crash impact
            deathAnimationTimer++;
        }
    }

    // 4. Draw the Player Image (With Rotation Support for Death Animation)
    ctx.save(); 
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
    ctx.rotate(playerRotation);
    ctx.drawImage(playerImg, -player.width / 2, -player.height / 2, player.width, player.height);
    ctx.restore(); 

    // 5. Draw the Obstacle
    // It changes color to Neon Yellow if it gets super fast!
    ctx.fillStyle = obstacle.speed > 8 ? "#FFFF00" : "white"; 
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

    // 6. Draw the Score & High Score
    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    ctx.fillText("Score: " + score, 10, 20);
    ctx.fillStyle = "#888888";
    ctx.fillText("HI: " + (score > highScore ? score : highScore), 10, 38);

    // 7. Draw Custom Credit Text
    ctx.fillStyle = "#00FFCC"; 
    ctx.font = "bold 12px Arial";
    ctx.fillText("Made by Fahim 14 years old", 220, 20);

    // 8. Draw "Game Over" Screen overlay
    if (isGameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.75)"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "#FF3333";
        ctx.font = "bold 32px Arial";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, 80);
        
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.fillText("Final Score: " + score, canvas.width / 2, 115);
        
        ctx.fillStyle = "#00FFCC";
        ctx.font = "12px Arial";
        ctx.fillText("Tap 'Jump' to Try Again", canvas.width / 2, 145);
        
        ctx.textAlign = "left"; // Reset text align for normal layout on next frame
    }

    // Keep running the loop
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
