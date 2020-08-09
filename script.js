var canvas = document.getElementById("mycanvas");
var ctx = canvas.getContext("2d");
var painting = false;
canvas.height = window.innerHeight - 250;
canvas.width = window.innerWidth - 50;
var yoffset = -220;
var xoffset = -23;
var width = document.getElementById("width").value;
ctx.lineWidth = width;
var currentTool = "brush";
var mousedownX, mousedownY, mouseupX, mouseupY;
var currentColor = document.getElementById("color").value;
ctx.strokeStyle = currentColor;

function changeColor(x) {
	currentColor = x;
	ctx.strokeStyle = x;
}

function updateWidth(x) {
	width = x;
	ctx.lineWidth = width;
}
function changeTool(x) {
	currentTool = x;
}

function mousedown(e) {
	painting = true;
	draw(e);
	mousedownX = e.clientX;
	mousedownY = e.clientY;
	if (currentTool == "circle") {
		circle(e);
	}
	// if(currentTool=="rect"){
	//     ctx.rect.
	// }
}
function mouseup(e) {
	painting = false;
	mouseupX = e.clientX;
	mouseupY = e.clientY;
	ctx.beginPath();
}
function line(x, y) {
	ctx.lineCap = "round";
	ctx.lineTo(x, y);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(x, y);
}
function circle(e) {
	let x = e.clientX + xoffset;
	let y = e.clientY + yoffset;
	let r = mouseupX - mousedownX;
	r = Math.abs(r);
	ctx.arc(x, y, r, 0, 2 * Math.PI);
	ctx.stroke();
	console.log(currentTool);
}
// function draw(e) {
// 	if (!painting) return;
// 	// let x = e.clientX + xoffset;
// 	// let y = e.clientY + yoffset;
// 	// let x = e.pageX - this.offsetLeft;
// 	// let y = e.pageY - this.offsetTop;
// 	if (currentTool == "brush") line(x, y);
// 	else if (currentTool == "circle") circle(e);
// }
function init() {
	canvas.addEventListener("mousedown", handleMouseDown);
	canvas.addEventListener("mouseup", handleMouseUp);
	canvas.addEventListener("mousemove", handleMouseMove);
	canvas.addEventListener("mouseout", handleMouseOut);
}
var startX, startY;
var drag = false;

function draw() {
	ctx.beginPath();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawLines();
	drawRects();
	drawCircles();
	drawBrushes();

	console.log(brushes);
}

function handleMouseDown(e) {
	e.preventDefault();
	e.stopPropagation();
	startX = e.clientX + xoffset;
	startY = e.clientY + yoffset;
	drag = true;
	// lines.push(newLine);
}
function handleMouseUp(e) {
	e.preventDefault();
	e.stopPropagation();

	mouseX = e.clientX + xoffset;
	mouseY = e.clientY + yoffset;
	if (currentTool == "line") {
		newLine = {
			x1: startX,
			y1: startY,
			x2: mouseX,
			y2: mouseY,
			c: currentColor,
			d: width,
		};
		lines.push(newLine);
	}
	if (currentTool == "circle") {
		newCircle = {
			x: startX,
			y: startY,
			r: Math.sqrt(
				Math.pow(mouseX - startX, 2) + Math.pow(mouseY - startY, 2)
			),
			c: currentColor,
			d: width,
		};
		circles.push(newCircle);
	}
	if (currentTool == "rect") {
		newRect = {
			x1: startX,
			y1: startY,
			x2: mouseX - startX,
			y2: mouseY - startY,
			c: currentColor,
			d: width,
		};
		rects.push(newRect);
	}
	if (currentTool == "brush") {
		newBrush = {
			x: -1,
			y: mouseY,
			c: currentColor,
			d: width,
		};
		brushes.push(newBrush);
	}
	drag = false;

	console.log("beginpath");
	draw();
}
function handleMouseMove(e) {
	if (!drag) return;
	e.preventDefault();
	e.stopPropagation();
	mouseX = e.clientX + xoffset;
	mouseY = e.clientY + yoffset;
	if (currentTool == "brush") {
		newBrush = {
			x: mouseX,
			y: mouseY,
			c: currentColor,
			d: width,
		};
		brushes.push(newBrush);
		ctx.lineWidth = width;
		ctx.strokeStyle = currentColor;
		line(mouseX, mouseY);
	}
	if (currentTool == "line") {
		draw();
		ctx.lineWidth = width;
		ctx.strokeStyle = currentColor;
		ctx.moveTo(startX, startY);
		ctx.lineTo(mouseX, mouseY);
		ctx.stroke();
	}
	if (currentTool == "rect") {
		draw();
		ctx.lineWidth = width;
		ctx.strokeStyle = currentColor;
		ctx.rect(startX, startY, mouseX - startX, mouseY - startY);
		ctx.stroke();
	}
	if (currentTool == "circle") {
		draw();
		ctx.lineWidth = width;
		ctx.strokeStyle = currentColor;
		let r = Math.sqrt(
			Math.pow(mouseX - startX, 2) + Math.pow(mouseY - startY, 2)
		);
		ctx.arc(startX, startY, r, 0, 2 * Math.PI);
		ctx.stroke();
	}
}
function handleMouseOut(e) {
	ctx.beginPath();
	e.preventDefault();
	e.stopPropagation();
	mouseX = e.clientX + xoffset;
	mouseY = e.clientY + yoffset;
	drag = false;
}

var lines = [];
var newLine = { x1: 0, y1: 0, x2: 0, y2: 0, c: "#000", d: 10 };

var brushes = [];
var newBrush = { x: 0, y: 0, c: "#000", d: 10 };

var rects = [];
var newRect = { x1: 0, y1: 0, x2: 0, y2: 0, c: "#000", d: 10 };

var circles = [];
var newCircle = { x: 0, y: 0, r: 0, c: "#000", d: 10 };

function drawLines() {
	if (!lines) return;
	lines.forEach((e) => {
		ctx.strokeStyle = e.c;
		ctx.lineWidth = e.d;
		ctx.moveTo(e.x1, e.y1);
		ctx.lineTo(e.x2, e.y2);
		ctx.stroke();
		ctx.beginPath();
	});
}
function drawBrushes() {
	if (!brushes) return;
	brushes.forEach((e) => {
		if (e.x == -1) {
			ctx.beginPath();
			return;
		}
		ctx.lineCap = "round";
		ctx.strokeStyle = e.c;
		ctx.lineWidth = e.d;
		ctx.lineTo(e.x, e.y);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(e.x, e.y);
	});
	ctx.beginPath();
}
function drawRects() {
	if (!rects) return;
	rects.forEach((e) => {
		ctx.strokeStyle = e.c;
		ctx.lineWidth = e.d;
		ctx.rect(e.x1, e.y1, e.x2, e.y2);
		ctx.stroke();
		ctx.beginPath();
	});
	console.log("called");
}
function drawCircles() {
	if (!circles) return;
	circles.forEach((e) => {
		ctx.strokeStyle = e.c;
		ctx.lineWidth = e.d;
		ctx.arc(e.x, e.y, e.r, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.beginPath();
	});
}
init();
