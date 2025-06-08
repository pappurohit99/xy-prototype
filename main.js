// @ts-check
'use strict';

window.onload = resizeCanvas;
window.onresize = resizeCanvas;

function resizeCanvas() {
    const canvas = document.getElementById('plot');
    if (canvas instanceof HTMLCanvasElement && canvas.parentElement) {
        const { width, height } = window.getComputedStyle(canvas.parentElement);
        canvas.width = parseInt(width, 10);
        canvas.height = parseInt(height, 10);
    }
}