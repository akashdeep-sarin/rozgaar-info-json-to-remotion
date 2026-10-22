# HTTP Server API Documentation

This document describes the HTTP server endpoints for the Remotion presentation rendering system.

## Quick Start

```bash
npm run server
```

Server runs on `http://localhost:3004` (configurable via `PORT` env var)
Preview server runs on `http://localhost:3005` (configurable via `PREVIEW_PORT` env var)

## Endpoints

### 1. Health Check

**Endpoint:** `GET /health`

**Description:** Check if the server is running

**Response:**
```json
{
  "status": "ok"
}
```

---

### 2. Create Presentation

**Endpoint:** `POST /create-presentation`

**Description:** Create a new presentation JSON file

**Request Body:**
```json
{
  "filepath": "./input/my-presentation.json",
  "presentation": {
    "title": "My Video",
    "theme": "default",
    "slides": [
      {
        "id": "slide-1",
        "layout": "title-slide",
        "blocks": [
          {
            "type": "text",
            "content": "Welcome to My Presentation"
          }
        ]
      }
    ]
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "filepath": "./input/my-presentation.json",
  "message": "Presentation file created successfully"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Missing required fields: filepath, presentation"
}
```

---

### 3. Start Preview Server

**Endpoint:** `GET /preview`

**Description:** Start the Remotion preview server

**Response:**
```json
{
  "success": true,
  "url": "http://localhost:3005",
  "message": "Preview server started"
}
```

**Notes:**
- Returns immediately; server takes ~2 seconds to fully start
- Opens in browser at the returned URL
- Only one preview server can run at a time
- Port configurable via `PREVIEW_PORT` env var

---

### 4. Stop Preview Server

**Endpoint:** `POST /preview/stop`

**Description:** Stop the running preview server

**Response (Success):**
```json
{
  "success": true,
  "message": "Preview server stopped"
}
```

**Response (No Server Running):**
```json
{
  "success": false,
  "message": "No preview server running"
}
```

---

### 5. Render Video

**Endpoint:** `POST /render`

**Description:** Render a presentation JSON to video file

**Request Body:**
```json
{
  "input": "./input/sample-presentation.json",
  "output": "./output/video.mp4",
  "language": "en",
  "width": 1920,
  "height": 1080,
  "fps": 30,
  "codec": "h264",
  "audio": true
}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `input` | string | *required* | Path to input JSON presentation file |
| `output` | string | *required* | Path to output video file |
| `language` | string | "en" | Audio language: "en" or "hi" |
| `width` | number | 1920 | Video width in pixels |
| `height` | number | 1080 | Video height in pixels |
| `fps` | number | 30 | Frames per second |
| `codec` | string | "h264" | Video codec: h264, h265, vp8, vp9 |
| `audio` | boolean | true | Include audio narration |

**Response (Success):**
```json
{
  "success": true,
  "output": "./output/video.mp4",
  "message": "Render completed successfully"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Render failed",
  "output": "./output/video.mp4"
}
```

---

## Usage Examples

### Example 1: Create and Render a Presentation

```bash
# 1. Create the presentation file
curl -X POST http://localhost:3004/create-presentation \
  -H "Content-Type: application/json" \
  -d @request.json

# 2. Render to video
curl -X POST http://localhost:3004/render \
  -H "Content-Type: application/json" \
  -d '{
    "input": "./input/my-presentation.json",
    "output": "./output/video.mp4"
  }'
```

### Example 2: Preview Before Rendering

```bash
# 1. Start preview
curl -X GET http://localhost:3004/preview

# 2. Open browser to http://localhost:3005

# 3. Stop preview when done
curl -X POST http://localhost:3004/preview/stop
```

### Example 3: Render with Custom Settings

```bash
curl -X POST http://localhost:3004/render \
  -H "Content-Type: application/json" \
  -d '{
    "input": "./input/sample.json",
    "output": "./output/4k-video.mp4",
    "width": 3840,
    "height": 2160,
    "fps": 60,
    "codec": "h265",
    "language": "hi"
  }'
```

---

## Environment Variables

```bash
PORT=3000                 # HTTP server port (default: 3004)
PREVIEW_PORT=3001        # Preview server port (default: 3005)
```

**Example:**
```bash
PORT=8000 PREVIEW_PORT=8001 npm run server
```

---

## Postman Collection

Import [postman-collection.json](postman-collection.json) for pre-configured API requests.

---

## Integration with n8n

Use the HTTP Request node in n8n workflows:

1. **Create presentation:**
   - Method: POST
   - URL: `http://your-server:3004/create-presentation`
   - Body type: JSON

2. **Render video:**
   - Method: POST
   - URL: `http://your-server:3004/render`
   - Body type: JSON

3. **Preview:**
   - Method: GET
   - URL: `http://your-server:3004/preview`

---

## Error Handling

All endpoints return appropriate HTTP status codes:

- **200** - Success
- **400** - Bad Request (missing/invalid parameters)
- **500** - Server Error (render failed, etc.)

Check the `success` field in response JSON for operation result.
