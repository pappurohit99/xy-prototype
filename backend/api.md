# API Overview

- Endpoint: GET /data
- Description: Generates and returns x-y coordinate data for various mathematical functions, optimized for a given canvas size.

# Query Parameters

| Name           | Type   | Required | Description                                                                 |
|----------------|--------|----------|-----------------------------------------------------------------------------|
| canvas_width   | int    | Yes      | Width of the canvas (must be greater than 0)                               |
| canvas_height  | int    | Yes      | Height of the canvas (must be greater than 0)                              |
| function       | str    | No       | Function to generate. Options: sin, cos, exp, log, circle, ellipse, lissajous (default: sin) |

# Supported Functions

- `sin`: Sine wave
- `cos`: Cosine wave
- `exp`: Exponential curve
- `log`: Logarithmic curve
- `circle`: Parametric circle
- `ellipse`: Parametric ellipse
- `lissajous`: Lissajous curve

# Example Requests

1. Generate a sine wave for a 500x500 canvas

`GET /data?canvas_width=500&canvas_height=500&function=sin`

2. Generate a circle

`GET /data?canvas_width=800&canvas_height=600&function=circle`

3. Generate a Lissajous curve

`GET /data?canvas_width=1024&canvas_height=768&function=lissajous`

# Example Response (truncated)
```JSON
{
  "x": [0.0, 0.1, 0.2, ...],
  "y": [0.0, 0.0998, 0.1987, ...]
}
```