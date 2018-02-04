var canvas = document.getElementById('map-canvas');
var context = canvas.getContext('2d');

var Vector2 = function (x, y) {
    this.x = x;
    this.y = y;

    this.lerp = function (vec, d) {
        if (vec === undefined) return this;
        return new Vector2(Math.lerp(this.x, vec.x, d), Math.lerp(this.y, vec.y, d));
    }
}

var pos = new Vector2(0.5, 0.5);

var radius = canvas.height / 2;
var minSpeed = 0.1;
var maxSpeed = 0.5;
var speed = 0.0005;

function isInside(pCircle, nCircle, pRadius, nRadius) {
    var y = nCircle.y - pCircle.y;
    var x = nCircle.x - pCircle.x;
    var d = Math.sqrt(x * x + y * y);
    return pRadius > (d + nRadius);
}


function generateRandomNumber() {
    var timeNow = new Date().getTime();
    return Math.sqrt(Math.pow(Math.random(), 64) * Math.random());
}

const numberCircles = 5;
var currentCircle = 1;
var radiuses = [];
var positions = [];

var time = 0;

function determineCircleValid(pCircle, nCircle, pRadius, nRadius) {
    if (isInside(pCircle, nCircle, pRadius, nRadius))
        return isValidPoint(nCircle.x, nCircle.y);
    else
        return false;
}

function firstCircle() {
    var nPosX = generateRandomNumber();
    var nPosY = generateRandomNumber();

    while (!determineCircleValid(new Vector2(0.5, 0.5), new Vector2(nPosX, nPosY), 1, 1)) {
        nPosX = generateRandomNumber();
        nPosY = generateRandomNumber();
    }

    positions[0] = new Vector2(nPosX, nPosY);
    radiuses[0] = 1;
}

function generateCirclePositions() {
    // firstCircle();


    positions[0] = new Vector2(0.5, 0.5);
    radiuses[0] = 1;

    for (var i = 1; i < numberCircles; i++) {
        var radius = (numberCircles - i - 1) / (numberCircles);
        // radius = (radius * radius);
        radiuses[i] = radius;

        var nPosX = generateRandomNumber();
        var nPosY = generateRandomNumber();

        while (!determineCircleValid(positions[i - 1], new Vector2(nPosX, nPosY), radiuses[i - 1], radiuses[i])) {
            nPosX = generateRandomNumber();
            nPosY = generateRandomNumber();
        }

        positions[i] = new Vector2(nPosX, nPosY);
    }
    console.log(positions, radiuses);
}

generateCirclePositions();

function update(delta) {
    // canvas.width = canvas.height = window.innerHeight;

    if (currentCircle - 1 >= numberCircles) {
        time = 0;
        currentCircle = 1;
        generateCirclePositions();
    }

    time += delta * speed;

    radius = Math.lerp(radiuses[currentCircle - 1], radiuses[currentCircle], time);

    pos = positions[currentCircle - 1].lerp(positions[currentCircle], time);

    // console.log(radiuses[currentCircle], radius, time);

    if (time > 1) {
        time = 0;
        currentCircle++;
    }

}

function draw() {
    if (radius <= 0) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(document.getElementById('hidden-image'), 0, 0);

    context.beginPath();
    context.arc(pos.x * canvas.height, pos.y * canvas.height, radius * canvas.height, 0, 2 * Math.PI, false);
    context.lineWidth = 1.4;
    context.strokeStyle = '#0000ff';
    context.stroke();


}

function loop(timestamp) {
    var delta = timestamp - lastRender;

    update(delta);
    draw();

    lastRender = timestamp;
    window.requestAnimationFrame(loop);
}

var lastRender = 0;
window.requestAnimationFrame(loop);