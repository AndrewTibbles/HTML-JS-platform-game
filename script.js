const ctx = canvas.getContext('2d');

// Simple keyboard handler
const keyboard = (() => {
    document.addEventListener("keydown", keyHandler);
    document.addEventListener("keyup", keyHandler);
    const keyboard = {
        right: false,
        left: false,
        up: false,
        any: false,
    };
    function keyHandler(e) {
        const state = e.type === "keydown"
        if (e.keyCode == 39 || e.keyCode == 68) {
            keyboard.right = state;
        } else if (e.keyCode == 37 || e.keyCode == 65) {
            keyboard.left = state;
        } else if (e.keyCode == 38 || e.keyCode == 87 || e.keyCode == 32) {
            keyboard.up = state;
            e.preventDefault();
        }
        if (state) { keyboard.any = true } // must reset when used
    }
    return keyboard;
})();

// define the player.
// update() updates position and response to keyboard
// draw() draws the player
// start() sets start position and state
const player = {
    x: 0,
    y: 0,
    dx: 0, // delta x and y
    dy: 0,
    size: 50,
    color: 'lime',
    onGround: false,
    jumpPower: -7,  // power of jump smaller jumps higher eg -10 smaller than -5
    moveSpeed: 5,
    update() {
        // react to keyboard state
        if (keyboard.up && this.onGround) { this.dy = this.jumpPower }
        if (keyboard.left) { this.dx = -this.moveSpeed }
        if (keyboard.right) { this.dx = this.moveSpeed }

        // apply gravity drag and move player
        this.dy += world.gravity;
        this.dy *= world.drag;
        this.dx *= this.onGround ? world.groundDrag : world.drag;
        this.x += this.dx;
        this.y += this.dy;

        // test ground contact and left and right limits
        if (this.y + this.size >= world.ground) {
            this.y = world.ground - this.size;
            this.dy = 0;
            this.onGround = true;
        } else {
            this.onGround = false;
        }
        if (this.x > ctx.canvas.width) {
            this.x -= ctx.canvas.width;
        } else if (this.x + this.size < 0) {
            this.x += ctx.canvas.width;
        }
    },
    draw() {
        drawRect(this.x, this.y / 1.125, this.size, this.size * 2, this.color);
    },
    start() {
        ctx.canvas.width = window.innerWidth / 1.11; // sets the canvas width to the width of the screen / 1.11
        ctx.canvas.height = window.innerHeight / 1.11; // sets the canvas height to the height of the screen / 1.11
        this.x = ctx.canvas.width / 2 - this.size / 2;
        this.y = world.ground - this.size;
        this.onGround = true;
        this.dx = 0;
        this.dy = 0;
    }
}
// define world
const world = {
    gravity: 0.2, // strength per frame of gravity
    drag: 0.999, // play with this value to change drag
    groundDrag: 0.9, // play with this value to change ground movement
    ground: 500,
    sky: 3000,
}
// set start
player.start();
// call first frame. This will run after all the rest of the code has run
requestAnimationFrame(mainLoop); // start when ready

// From OP
function drawRect(x, y, width, height, color) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawGround(x, y, count = 1) {
    drawRect(x, y, canvas.width, canvas.height - y * 3, 'lightblue');
    drawRect(x, y, 100 * count, canvas.height - y, '#684027');
    drawRect(x, y, 100 * count, 10, 'green');
}

// show instruct
var showI = true;
// main animation loop
function mainLoop(time) { // time passed by requestAnimationFrame        
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGround(0, world.ground, 20);
    player.update();
    player.draw();
    if (showI) {
        if (keyboard.any) {
            keyboard.any = false;
            showI = false;
        }
        ctx.textAlign = "center";
        ctx.font = "24px arial";
        ctx.fillStyle = "#000";
        ctx.fillText("Use the arrow keys or WASD to move.", ctx.canvas.width / 2, 80);
    }
    requestAnimationFrame(mainLoop);
}