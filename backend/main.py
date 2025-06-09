from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse
import numpy as np
import time

app = FastAPI()

@app.get("/data")
def get_data(
    canvas_width: int = Query(..., gt=0),
    canvas_height: int = Query(..., gt=0),
    function: str = Query("sin", description="Function to generate: sin, cos, exp, log, circle, ellipse, lissajous")
):
    start_time = time.time()

    num_points = 1_000_000
    t = np.linspace(0, 2 * np.pi, num_points)

    if function == "sin":
        x = np.linspace(0, 100, num_points)
        y = np.sin(x)
    elif function == "cos":
        x = np.linspace(0, 100, num_points)
        y = np.cos(x)
    elif function == "exp":
        x = np.linspace(0, 10, num_points)
        y = np.exp(x)
    elif function == "log":
        x = np.linspace(0.0001, 100, num_points)
        y = np.log(x)
    elif function == "circle":
        x = np.cos(t)
        y = np.sin(t)
    elif function == "ellipse":
        x = 2 * np.cos(t)
        y = np.sin(t)
    elif function == "lissajous":
        a, b, delta = 3, 2, np.pi / 2
        x = np.sin(a * t + delta)
        y = np.sin(b * t)
    else:
        return JSONResponse(status_code=400, content={"error": "Unsupported function"})

    max_points = canvas_width * canvas_height
    if max_points < num_points:
        indices = np.linspace(0, num_points - 1, max_points, dtype=int)
        x_thinned = x[indices]
        y_thinned = y[indices]
    else:
        x_thinned = x
        y_thinned = y

    response_time = (time.time() - start_time) * 1000
    print(f"Data generation and thinning took {response_time:.2f} ms")

    return JSONResponse(content={
        "x": x_thinned.tolist(),
        "y": y_thinned.tolist()
    })
