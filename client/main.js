// @ts-check
'use strict';

window.onload = resizeCanvas;
window.onresize = resizeCanvas;

const plotBtn = document.getElementById('plot-button');
if (plotBtn instanceof HTMLInputElement) {
    plotBtn.onclick = e => {
        e.preventDefault();
        const fn = document.getElementById('function')?.value;
        const clientDimentions = {};
        const canvas = document.getElementById('plot');
        if (canvas instanceof HTMLCanvasElement) {
            clientDimentions.width = canvas.width;
            clientDimentions.height = canvas.height;
        }

        if (fn && Object.keys(clientDimentions).length !== 0) {
            // Perform a request
            const url = `http://127.0.0.1:8000/data?canvas_width=${clientDimentions.width}&canvas_height=${clientDimentions.height}&function=${fn}`;
            fetch(url).then(resp => {
                if (!resp.ok) {
                    throw new Error("Network response was not ok");
                }
                return resp.json();
            }).then(plotData).catch(err => console.error(err));
        }
    }
}

function plotData(data) {
    // TODO
}

function resizeCanvas() {
    const canvas = document.getElementById('plot');
    if (canvas instanceof HTMLCanvasElement && canvas.parentElement) {
        const { width, height } = window.getComputedStyle(canvas.parentElement);
        canvas.width = parseInt(width, 10);
        canvas.height = parseInt(height, 10);
    }
}