var canvas = document.getElementById("mycanvas");
var ctx = canvas.getContext("2d");
var painting = false;
// canvas.height = window.innerHeight - 250;
// canvas.width = window.innerWidth - 50;
canvas.height = 500;
canvas.width = 500;
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

function line(x, y) {
	ctx.lineCap = "round";
	ctx.lineTo(x, y);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(x, y);
}

// let x = e.pageX - this.offsetLeft;
// let y = e.pageY - this.offsetTop;

function init() {
	canvas.addEventListener("mousedown", handleMouseDown);
	canvas.addEventListener("mouseup", handleMouseUp);
	canvas.addEventListener("mousemove", handleMouseMove);
	canvas.addEventListener("mouseout", handleMouseOut);
}
var startX, startY;
var drag = false;
var temp = [];
var abc;

var whit = cImg([255, 255, 255], canvas.width, canvas.height);

function draw() {
	ctx.beginPath();
	// ctx.putImageData(whit, 0, 0);
	// if (abc) abc.fillCol();
	// fillCol(ctx.getImageData(0, 0, canvas.width, canvas.height));

	drawLines();
	drawRects();
	drawCircles();
	drawBrushes();

	// drawFills();
}

function handleMouseDown(e) {
	e.preventDefault();
	e.stopPropagation();
	// startX = e.clientX + xoffset;
	// startY = e.clientY + yoffset;
	startX = e.pageX - this.offsetLeft;
	startY = e.pageY - this.offsetTop;
	drag = true;
	if (currentTool == "fill") {
		let a = currentColor;
		a = hexToRGB(a);
		draw();
		flood(startX, startY, a);
		// abc = new Fill(canvas, startX, startY, a);
	}
}
function hexToRGB(a) {
	a = a.slice(1);
	a = a.match(/.{1,2}/g);
	a[0] = parseInt(a[0], 16);
	a[1] = parseInt(a[1], 16);
	a[2] = parseInt(a[2], 16);
	a[3] = 255;
	return a;
}

function handleMouseUp(e) {
	e.preventDefault();
	e.stopPropagation();

	// mouseX = e.clientX + xoffset;
	// mouseY = e.clientY + yoffset;
	mouseX = e.pageX - this.offsetLeft;
	mouseY = e.pageY - this.offsetTop;
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
	temp.push(currentTool);

	draw();
}
function undo() {
	let t = temp.pop();
	switch (t) {
		case "line":
			lines.pop();
			break;
		case "rect":
			rects.pop();
			break;
		case "circle":
			circles.pop();
			break;
		case "brush": //CHECK THIS THROUGH
			// let i = brushes.length - 1;
			// i.forEach((e) => {
			// 	brushes.pop();
			// });

			break;

		default:
			break;
	}
	draw();
}
function handleMouseMove(e) {
	if (!drag) return;
	e.preventDefault();
	e.stopPropagation();
	// mouseX = e.clientX + xoffset;
	// mouseY = e.clientY + yoffset;
	mouseX = e.pageX - this.offsetLeft;
	mouseY = e.pageY - this.offsetTop;
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
	// mouseX = e.clientX + xoffset;
	// mouseY = e.clientY + yoffset;
	mouseX = e.pageX - this.offsetLeft;
	mouseY = e.pageY - this.offsetTop;
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
function cImg(a, w, h) {
	let imgData = ctx.createImageData(w, h);
	let i;
	for (i = 0; i < imgData.data.length; i += 4) {
		imgData.data[i + 0] = a[0];
		imgData.data[i + 1] = a[1];
		imgData.data[i + 2] = a[2];
		imgData.data[i + 3] = 255;
	}
	return imgData;
}
init();
