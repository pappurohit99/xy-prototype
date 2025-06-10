// @ts-check
'use strict';

window.onload = resizeCanvas;
window.onresize = resizeCanvas;

const COLORS = {
    sin: 'black',
    cos: 'blue',
    exp: 'red',
    log: 'pink',
    circle: 'purple',
    ellipse: 'darkgray',
    lissajous: 'green'
};

const RADIUS = 4;

let pixelMatrix = null;

const plotBtn = document.getElementById('plot-button');
if (plotBtn instanceof HTMLInputElement) {
    plotBtn.onclick = e => {
        e.preventDefault();
        resizeCanvas();

        const args = getParams();
        const requestParams = {};

        if (args.fnType != null) {
            requestParams.fnType = args.fnType;
        }
        if (args.numPoints != null) {
            requestParams.numPoints = args.numPoints;
        }
        if (args.clientDimensions != null) {
            requestParams.clientDimensions = args.clientDimensions;
            // Request data as these params are mandatory
            requestData(requestParams);
        }

    }
}

function getParams() {
    let clientDimensions = null, fnType = null, numPoints = null;

    const canvas = document.getElementById('plot');
    if (canvas instanceof HTMLCanvasElement) {
        clientDimensions = {
            width: canvas.width,
            height: canvas.height
        }
    }

    const fnEl = document.getElementById('function');
    if (fnEl instanceof HTMLSelectElement) {
        fnType = fnEl.value;
    }

    const numPointsEl = document.getElementById('numPoints');
    if (numPointsEl instanceof HTMLInputElement) {
        numPoints = numPointsEl.value;
    }

    return {
        clientDimensions,
        fnType,
        numPoints
    }
}

/**
 * @param {{ fnType?: any; numPoints?: any; clientDimensions: {width: number, height: number}; }} args
 */
function requestData(args) {
    const { clientDimensions } = args;
    let url = `http://127.0.0.1:8000/data?canvas_width=${clientDimensions.width}&canvas_height=${clientDimensions.height}`;

    if (Object.prototype.hasOwnProperty.call(args, 'fnType')) {
        url += `&function=${args.fnType}`;
    }
    if (Object.prototype.hasOwnProperty.call(args, 'numPoints')) {
        url += `&num_points=${args.numPoints}`;
    }
    fetch(url).then(resp => {
        if (!resp.ok) {
            throw new Error("Network response was not ok");
        }
        return resp.json();
    }).then(plotData)
        .catch(err => console.error(err));
}

/**
 * @param {{ x: number[], y: number[], x_limits: number[], y_limits: number[], function_name: string }} response
 */
function plotData(response) {
    const { x, y, x_limits, y_limits, function_name } = response;

    if (x.length !== y.length) {
        console.error('Mismatched data lengths');
        return;
    }

    const canvas = document.getElementById('plot');
    if (!(canvas instanceof HTMLCanvasElement)) {
        console.error('Canvas doesn\'t exist');
        return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Canvas context not found');
        return;
    }
    ctx.fillStyle = COLORS[function_name];
    ctx.strokeStyle = 'black';
    let [xMin, xMax] = x_limits;
    let [yMin, yMax] = y_limits;
    // Add a buffer of 5% each side
    const absX = 0.05 * Math.abs(xMax - xMin)
    const absY = 0.05 * Math.abs(yMax - yMin);

    xMin -= absX;
    xMax += absX;
    yMin -= absY;
    yMax += absY;

    for (let i = 0; i < x.length; i++) {
        const px = Math.floor(((x[i] - xMin) / (xMax - xMin)) * canvas.width);
        const py = Math.floor(((yMax - y[i]) / (yMax - yMin)) * canvas.height);

        if (px < 0 || px >= canvas.width || py < 0 || py >= canvas.height) {
            continue;
        }

        const index = px + py * canvas.width;
        if (pixelMatrix[index]) {
            continue;
        }
        pixelMatrix[index] = 1;

        ctx.beginPath();
        ctx.arc(px, py, RADIUS, 0, 2 * Math.PI);
        ctx.fill();

    }
}

function resizeCanvas() {
    const canvas = document.getElementById('plot');
    if (canvas instanceof HTMLCanvasElement && canvas.parentElement) {
        const { width, height } = window.getComputedStyle(canvas.parentElement);
        canvas.width = parseInt(width, 10);
        canvas.height = parseInt(height, 10);

        pixelMatrix = new Uint8Array(canvas.width * canvas.height);
        pixelMatrix.fill(0);
    }
}