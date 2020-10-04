// var canvas = document.getElementById("mycanvas");
// const ctx = canvas.getContext("2d");
var wholeData = ctx.getImageData(0, 0, canvas.width, canvas.height);

var fillStack = [];

function val(x) {
	return JSON.stringify(x);
}
function getPixel(x, y) {
	wholeData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	if (x < 0 || y < 0 || x >= wholeData.width || y >= wholeData.height) {
		return [-1, -1, -1, -1]; // impossible color
	} else {
		const oft = (x + wholeData.width * y) * 4;

		// let imageData = ctx.getImageData(x, y, 1, 1).data;
		// let pre = [imageData[0], imageData[1], imageData[2], imageData[3]];
		// console.log(pre);
		// return pre;
		return [
			wholeData.data[oft + 0],
			wholeData.data[oft + 1],
			wholeData.data[oft + 2],
			wholeData.data[oft + 3],
		];
	}
}

// function fillUtil(x, y, pre, tar) {
// 	wholeData = ctx.getImageData(0, 0, canvas.width, canvas.height);
// 	let wid = 1;
// 	let heit = 1;
// 	const oft = (x + wholeData.width * y) * 4;
// 	let currentColor = getPixel(x, y);
// 	if (!notOut(x, y)) {
// 		console.log("never happening");
// 		return;
// 	} else if (colorMatch(pre, tar)) {
// 		console.log("2");
// 		return;
// 	} else if (colorMatch(currentColor, tar)) {
// 		console.log("3");
// 		return;
// 	} else {
// 		setColor(x, y, tar);

// 		// fillUtil(x + wid, y, pre, a);
// 		// fillUtil(x - wid, y, pre, a);
// 		// fillUtil(x, y + heit, pre, a);
// 		// fillUtil(x, y - heit, pre, a);
// 		// ctx.putImageData(wholeData, 0, 0);
// 		fillStack.push([x + 1, y, pre, tar]);
// 		fillStack.push([x - 1, y, pre, tar]);
// 		fillStack.push([x, y + 1, pre, tar]);
// 		fillStack.push([x, y - 1, pre, tar]);
// 		// console.log("completed");
// 		fillCol();
// 	}
// }
function dub(x, y, tar, fill) {
	var cur = getPixel(x, y);
	if (colorMatch(cur, tar)) {
		setColor(x, y, fill);
		fillStack.push([x + 1, y, tar, fill]);
		fillStack.push([x - 1, y, tar, fill]);
		fillStack.push([x, y + 1, tar, fill]);
		fillStack.push([x, y - 1, tar, fill]);
	}
}

function setColor(x, y, a) {
	const oft = (y * wholeData.width + x) * 4;
	wholeData.data[oft + 0] = a[0];
	wholeData.data[oft + 1] = a[1];
	wholeData.data[oft + 2] = a[2];
	wholeData.data[oft + 3] = a[3];
	wholeData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}
function colorMatch(a, b) {
	return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}
function notOut(x, y) {
	return x > 0 && x < canvas.width && y > 0 && y < canvas.height;
}
function fill(x, y, fill) {
	wholeData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	const tar = getPixel(x, y);
	if (!colorMatch(tar, fill)) {
		dub(x, y, tar, fill);
		fillCol();
	}
}
function fillCol() {
	wholeData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	if (fillStack.length) {
		for (let i = 0; i < fillStack.length; i++) {
			dub(
				fillStack[i][0],
				fillStack[i][1],
				fillStack[i][2],
				fillStack[i][3]
			);
		}
		fillStack.splice(0, fillStack.length);
		fillCol();
	} else {
		console.log("completed");
		wholeData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		ctx.putImageData(wholeData, 0, 0);
		fillStack = [];
	}
}

// init();
