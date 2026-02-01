# ChatGPT to Remotion Interface

Convert JSON presentation data to animated Remotion videos with audio narration.

## Features

- ✅ **JSON-based presentations** - Define slides using a structured JSON schema
- 🎨 **Theme system** - Multiple themes with configurable colors and fonts
- 📐 **Multiple layouts** - Title slides, two-column, and default layouts
- 🎵 **Audio integration** - Placeholder for audio API with dynamic slide durations
- 🎬 **CLI tool** - Command-line utility for batch rendering
- ⚙️ **Configurable video output** - Resolution, FPS, codec options

## Installation

```bash
npm install
```

## Usage

### Preview in Browser

Start the Remotion preview server:

```bash
npm start
```

This will open a browser where you can preview the presentation and scrub through frames.

### Validate a Presentation

```bash
npm run dev validate -- -i ./input/sample-presentation.json
```

### Render to Video

```bash
# Build the CLI first
npm run build:cli

# Render with default settings (1920x1080, 30fps, h264)
npm run dev render -- -i ./input/sample-presentation.json -o ./output/video.mp4 -l en

# Render without audio (if you don't have audio files yet)
npm run dev render -- -i ./input/sample-presentation.json -o ./output/video.mp4 --no-audio

# Render with custom settings
npm run dev render -- -i ./input/sample-presentation.json -o ./output/video.mp4 -l hi --width 3840 --height 2160 --fps 60
```

### Export Slides as Images

Export each slide as a PNG or JPEG image (no audio needed):

```bash
# Export as PNG images (default)
npm run dev export-images -- -i ./input/sample-presentation.json -o ./output/images

# Export as JPEG with custom quality
npm run dev export-images -- -i ./input/sample-presentation.json -o ./output/images --format jpeg --quality 95

# Export with custom resolution
npm run dev export-images -- -i ./input/sample-presentation.json -o ./output/images --width 3840 --height 2160
```

### CLI Options

**Render Command**
```
render [options]
  -i, --input <path>      Path to input JSON file (required)
  -o, --output <path>     Path to output video file (required)
  -l, --language <lang>   Language for narration: en or hi (default: "en")
  --width <width>         Video width (default: "1920")
  --height <height>       Video height (default: "1080")
  --fps <fps>             Frames per second (default: "30")
  --codec <codec>         Video codec: h264, h265, vp8, vp9 (default: "h264")
  --no-audio              Render without audio (uses 10sec per slide)
```

**Export Images Command**
```
export-images [options]
  -i, --input <path>      Path to input JSON file (required)
  -o, --output <dir>      Output directory for images (required)
  -l, --language <lang>   Language for slide selection (default: "en")
  --format <format>       Image format: png or jpeg (default: "png")
  --width <width>         Image width (default: "1920")
  --height <height>       Image height (default: "1080")
  --quality <quality>     JPEG quality 1-100 (default: "90", jpeg only)
```

**Validate Command**
```
validate [options]
  -i, --input <path>      Path to input JSON file (required)
```

## Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── blocks/         # Content block components
│   │   ├── layouts/        # Layout templates
│   │   ├── FrontPage.tsx   # Title page
│   │   └── Slide.tsx       # Main slide component
│   ├── compositions/        # Remotion compositions
│   │   └── Presentation.tsx
│   ├── themes/             # Theme definitions
│   ├── services/           # Audio API integration
│   ├── utils/              # Utility functions
│   ├── cli.ts              # CLI tool
│   └── Root.tsx            # Remotion root
├── input/                  # Place JSON files here
├── output/                 # Rendered videos
└── public/                 # Static assets
    └── audio/              # Audio files
```

## JSON Schema

The presentation JSON follows this structure:

```json
{
  "id": "unique-id",
  "title": "Presentation Title",
  "description": "Description",
  "theme": "gov-blue",
  "frontPage": {
    "title": "Front Page Title",
    "author": "Author Name",
    "date": "Date",
    "logo": null
  },
  "slides": [
    {
      "id": "slide-01",
      "layout": "title-slide",
      "title": "Slide Title",
      "blocks": [
        {
          "type": "text",
          "text": "Content...",
          "style": "normal"
        },
        {
          "type": "bullets",
          "items": ["Point 1", "Point 2"]
        }
      ],
      "audioNarrationInEnglish": "English narration...",
      "audioNarrationInHindi": "Hindi narration..."
    }
  ]
}
```

### Block Types

- **text**: Plain text with styles (normal, title, subtitle, code)
- **bullets**: Bulleted list
- **image**: Image with optional caption
- **code**: Code block with syntax highlighting

### Layouts

- **title-slide**: Centered content for title/intro slides
- **two-column**: Split content into two columns
- **default**: Vertical stack of blocks

## Themes

Currently available themes:
- `default` - Clean blue theme
- `gov-blue` - Government-style blue theme

Add more themes in `src/themes/`.

## Audio Integration

The audio service (`src/services/audioService.ts`) currently uses placeholder logic. To integrate with your API:

1. Update `fetchAudioForSlide()` function
2. Implement API authentication
3. Handle audio duration from API response

Example:
```typescript
export async function fetchAudioForSlide(
  slideId: string,
  language: 'en' | 'hi',
  config?: AudioAPIConfig
): Promise<AudioMetadata> {
  const response = await fetch(`${config.endpoint}/audio/${slideId}?lang=${language}`, {
    headers: { 'Authorization': `Bearer ${config.apiKey}` }
  });
  const data = await response.json();
  return {
    url: data.url,
    durationInFrames: data.duration * 30 // Convert seconds to frames
  };
}
```

## Extending

### Add a New Layout

1. Create `src/components/layouts/YourLayout.tsx`
2. Export from `src/components/layouts/index.ts`
3. Update layout switch in `src/components/Slide.tsx`

### Add a New Theme

1. Create `src/themes/your-theme.ts`
2. Import and add to `themes` object in `src/themes/index.ts`

### Add a New Block Type

1. Update Zod schema in `zod-presentation-schema.ts`
2. Create component in `src/components/blocks/`
3. Add case to `BlockRenderer.tsx`

## License

MIT
