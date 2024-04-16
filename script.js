window.addEventListener('load', function () {
    let canvas = document.getElementById('gameCanvas');
    let ctx = canvas.getContext('2d');
    canvas.width = 1200;
    canvas.height = 600;

    let currentBackground = new Image();
    currentBackground.src = 'img/City4.png';

    function drawArrows() {
        const arrowWidth = 60;
        const arrowHeight = 60;
        const arrowPadding = 10;
        const arrowMarginTop = 10;
        const arrowSpacing = 5;

        const leftArrow = new Image();
        leftArrow.src = 'img/flatDark23.png';
        leftArrow.onload = function () {
            ctx.drawImage(leftArrow, canvas.width - arrowPadding - (arrowWidth * 2) - arrowSpacing, arrowMarginTop, arrowWidth, arrowHeight);
        };

        const rightArrow = new Image();
        rightArrow.src = 'img/flatDark24.png';
        rightArrow.onload = function () {
            ctx.drawImage(rightArrow, canvas.width - arrowPadding - arrowWidth, arrowMarginTop, arrowWidth, arrowHeight);
        };
    }

    class InputHandler {
        constructor() {
            this.keys = [];
            window.addEventListener('keydown', (e) => {
                if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && this.keys.indexOf(e.key) === -1) {
                    this.keys.push(e.key);
                }
            });
            window.addEventListener('keyup', (e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                }
            });
        }
    }

    class Player {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 128;
            this.height = 128;
            this.scale = 1.5;
            this.scaledWidth = this.width * this.scale;
            this.scaledHeight = this.height * this.scale;
            this.x = (gameWidth - this.width) / 2;
            this.y = gameHeight - this.height - 100;
            this.image = document.getElementById('playerImage');
            this.frameX = 0;
            this.maxFrame = 7;
            this.frameY = 2;
            this.fps = 15;
            this.frameTimer = 0;
            this.frameInterval = 1000 / this.fps;
            this.speed = 0;
            this.score = 0;
            this.leftBoundary = 40; // Define the left boundary distance
            this.rightBoundary = 200; // Define the right boundary distance
            this.canScoreLeft = true; // Player can score on the left side initially
            this.canScoreRight = true; // Player cannot score on the right side initially
            this.initEventListeners();

        }
        draw(context) {
            context.drawImage(
                this.image,
                this.frameX * this.width,
                this.frameY * this.height + 2,
                this.width,
                this.height,
                this.x,
                this.y,
                this.scaledWidth,
                this.scaledHeight
            );
        }
        update(input, deltaTime) {
            // Sprite animation
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }


            // Controls
            this.x += this.speed;
            if (input.keys.indexOf('ArrowRight') > -1) {
                this.speed = 3;
                this.frameY = 0;
                this.maxFrame = 7;
            } else if (input.keys.indexOf('ArrowLeft') > -1) {
                this.speed = -3;
                this.frameY = 1;
                this.maxFrame = 7;
            } else {
                this.speed = 0;
                this.maxFrame = 6;
            }

            // Boundaries
            if (this.x < -this.leftBoundary) {
                this.x = -this.leftBoundary;
            } else if (this.x > this.gameWidth - this.width) {
                this.x = this.gameWidth - this.width;
            }

            // Check if player is near canvas border
            if (this.x <= 30 && this.canScoreLeft) {
                this.score++; // Increase score only if player can score on the left side
                this.canScoreLeft = false; // Player cannot score on the left side anymore
                this.canScoreRight = true; // Player can score on the right side now
            } else if (this.x >= this.gameWidth - this.width - 80 && this.canScoreRight) {
                this.score++; // Increase score only if player can score on the right side
                this.canScoreLeft = true; // Player can score on the left side again
                this.canScoreRight = false; // Player cannot score on the right side anymore
            }
        }



        initEventListeners() {
            window.addEventListener('keyup', (event) => {
                if (event.key === 'ArrowRight') {
                    this.frameY = 2;
                } else if (event.key === 'ArrowLeft') {
                    this.frameY = 3;
                }
            });
        }
    }

    function displayStatusText(context, score) {
        context.fillStyle = 'black';
        context.font = '40px Helvetica';
        context.fillText('Lengths Paced: ' + score, 20, 50);

    }

    function drawBackground(image) {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    }

    const input = new InputHandler();
    const player = new Player(canvas.width, canvas.height);

    let lastTime = 0;

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground(currentBackground);
        player.draw(ctx);
        player.update(input, deltaTime);
        displayStatusText(ctx, player.score);
        drawArrows(); // Draw arrows after updating the canvas
        requestAnimationFrame(animate);
    }
    animate(0);

    const bg1 = document.querySelector('.bg1 img');
    const bg2 = document.querySelector('.bg2 img');
    const bg3 = document.querySelector('.bg3 img');

    [bg1, bg2, bg3].forEach(bg => {
        bg.addEventListener('click', function () {
            const temp = currentBackground.src;
            currentBackground.src = bg.src;
            bg.src = temp;
            redrawCanvas();
        });
    });

    function redrawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground(currentBackground);
        player.draw(ctx);
        displayStatusText(ctx, player.score);
        drawArrows(); // Redraw arrows after changing the background
    }
});
