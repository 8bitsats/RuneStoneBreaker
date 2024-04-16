<script>
  // Get a reference to the canvas and its context
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  // Set the width and height to full screen
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Runestone (ball) properties
  const runestone = new Image();
  runestone.src = 'URL_OF_THE_UPLOADED_RUNESTONE_IMAGE'; // Replace with the actual URL
  const ballSize = 20;
  let ballX = canvas.width / 2;
  let ballY = canvas.height / 2;
  let ballDX = 2;
  let ballDY = -2;

  // Paddle properties
  const paddleHeight = 10;
  const paddleWidth = 75;
  let paddleX = (canvas.width - paddleWidth) / 2;
  const paddleDX = 7;
  let rightPressed = false;
  let leftPressed = false;

  // Bricks properties
  const brickRowCount = 5;
  const brickColumnCount = 3;
  const brickWidth = 75;
  const brickHeight = 20;
  const brickPadding = 10;
  const brickOffsetTop = 30;
  const brickOffsetLeft = 30;
  let bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }

  // Score and Lives
  let score = 0;
  let lives = 3;

  // Draw functions
  function drawBall() {
    ctx.beginPath();
    ctx.drawImage(runestone, ballX, ballY, ballSize, ballSize);
    ctx.closePath();
  }

  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }

  function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status === 1) {
          let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
          let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = "#0095DD";
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }

  // Update game items
  function update() {
    // Ball movement
    ballX += ballDX;
    ballY += ballDY;
    
    // Wall collision detection
    if(ballX + ballDX > canvas.width - ballSize || ballX + ballDX < ballSize) {
      ballDX = -ballDX;
    }
    if(ballY + ballDY < ballSize) {
      ballDY = -ballDY;
    } else if(ballY + ballDY > canvas.height - ballSize) {
      // Paddle collision detection
      if(ballX > paddleX && ballX < paddleX + paddleWidth) {
        ballDY = -ballDY;
      } else {
        lives--;
        if(!lives) {
          alert("GAME OVER");
          document.location.reload();
        } else {
          ballX = canvas.width/2;
          ballY = canvas.height-30;
          ballDX = 3;
          ballDY = -3;
          paddleX = (canvas.width-paddleWidth)/2;
        }
      }
    }

    // Paddle movement
    if(rightPressed) {
      paddleX += paddleDX;
      if (paddleX + paddleWidth > canvas.width){
        paddleX = canvas.width - paddleWidth;
      }
    } else if(leftPressed) {
      paddleX -= paddleDX;
      if (paddleX < 0){
        paddleX = 0;
      }
    }

    // Brick collision detection
    for(let c=0; c<brickColumnCount; c++) {
      for(let r=0; r<brickRowCount; r++) {
        let b = bricks[c][r];
        if(b.status === 1) {
          if(ballX > b.x && ballX < b.x+brickWidth && ballY > b.y && ballY < b.y+brickHeight) {
            ballDY = -ballDY;
            b.status = 0;
            score++;
            if(score === brickRowCount*brickColumnCount) {
              alert("YOU WIN, CONGRATULATIONS!");
              document.location.reload();
            }
          }
        }
      }
    }

    // Drawing the game
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();

    // Request next frame
    requestAnimationFrame(update);
  }

  // Score and Lives drawing functions
  function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
  }

  function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
  }

  // Key down handler
  function keyDownHandler(e) {
    if(e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = true;
    } else if(e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = true;
    }
  }

  // Key up handler
  function keyUpHandler(e) {
    if(e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = false;
    } else if(e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = false;
    }
  }

  // Touch start handler
  function touchStartHandler(e) {
    const touchX = e.touches[0].clientX;
    if (touchX < window.innerWidth / 2) {
      leftPressed = true;
    } else {
      rightPressed = true;
    }
  }

  // Touch end handler
  function touchEndHandler(e) {
    leftPressed = false;
    rightPressed = false;
  }

  // Event listeners
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  canvas.addEventListener("touchstart", touchStartHandler, false);
  canvas.addEventListener("touchend", touchEndHandler, false);

  // Start the game
  runestone.onload = update;
</script>
