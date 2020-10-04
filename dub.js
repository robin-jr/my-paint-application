var fillstk; //= [];
var imageData; //= ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
function flood(x, y, fillcolor) {
	fillstk = [];
	imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

	fill(x, y, fillcolor);
}

// function val(x) {
// 	return JSON.stringify(x);
// }
function getPixel(x, y) {
	if (x < 0 || y < 0 || x >= imageData.width || y >= imageData.height) {
		return [-1, -1, -1, -1]; // impossible color
	} else {
		const offset = (y * imageData.width + x) * 4;

		return [
			imageData.data[offset + 0],
			imageData.data[offset + 1],
			imageData.data[offset + 2],
			imageData.data[offset + 3],
		];
	}
}
function colorsMatch(a, b) {
	return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}
// function Out(x, y) {
// 	return x < 0 || x > ctx.canvas.width || y < 0 || y > ctx.canvas.height;
// }
function fill(x, y, fill) {
	console.log("fill called"); // try x and y
	const tar = getPixel(x, y);

	if (!colorsMatch(tar, fill)) {
		console.log("in");
		fillPixel(x, y, tar, fill);

		fillCol();
	}
	console.log("returned");
}
function fillPixel(x, y, tar, fill) {
	const cur = getPixel(x, y);
	if (colorsMatch(cur, tar)) {
		setPixel(x, y, fill);
		fillstk.push([x + 1, y, tar, fill]);
		fillstk.push([x - 1, y, tar, fill]);
		fillstk.push([x, y + 1, tar, fill]);
		fillstk.push([x, y - 1, tar, fill]);
	}
}
function setPixel(x, y, a) {
	console.log("data set");
	const oft = (y * imageData.width + x) * 4;
	imageData.data[oft + 0] = a[0];
	imageData.data[oft + 1] = a[1];
	imageData.data[oft + 2] = a[2];
	imageData.data[oft + 3] = a[3];
}
// function fillCol() {
// 	if (fillstk.length >= 1) {
// 		let range = fillstk.length;
// 		console.log(range, fillstk);
// 		for (let i = 0; i < range; i++) {
// 			fillPixel(
// 				fillstk[i][0],
// 				fillstk[i][1],
// 				fillstk[i][2],
// 				fillstk[i][3]
// 			);
// 		}

// 		fillstk.splice(0, range);

// 		fillCol();
// 	} else {
// 		console.log("finll stack emptied");
// 		ctx.putImageData(imageData, 0, 0);
// 		fillstk = [];
// 	}

//}
function fillCol() {
	if (fillstk.length) {
		let range = fillstk.length;

		for (let i = 0; i < range; i++) {
			fillPixel(
				fillstk[i][0],
				fillstk[i][1],
				fillstk[i][2],
				fillstk[i][3]
			);
		}

		fillstk.splice(0, range);

		fillCol();
	} else {
		console.log(imageData);
		ctx.putImageData(imageData, 0, 0);
		fillstk = [];
	}
}
