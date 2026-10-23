# Rozgaar Info JSON to Remotion

Turns a job-notice presentation JSON into a 1920x1080 video with Hindi narration.

## How it works

1. The JSON is validated against `src/zod-presentation-schema.ts`. If an `override.json` sits next to the input file, it is deep-merged on top first.
2. Each slide's `audioNarrationInHindi` (plain text or SSML) is turned into an MP3 with Google Text-to-Speech and cached in `public/audio/`. The file name includes a hash of the narration, so editing the text regenerates the audio. Slides without narration are silent.
3. Each slide is shown for 0.5s + its narration + 0.5s, or 10s when it has no narration (`src/utils/timing.ts`).

All rendering goes through `renderPresentation()` and `exportSlideImages()` in `src/pipeline.ts`; the CLI is a thin wrapper around them.

## Setup

```bash
npm install
```

Narration needs Google Cloud credentials:

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\application_default_credentials.json"
```

## Commands

```bash
# Preview input/sample-presentation.json (+ input/override.json) in Remotion Studio
npm start

# Validate a presentation
npm run dev -- validate -i ./input/sample-presentation.json

# Render a video with narration
npm run dev -- render -i ./input/sample-presentation.json -o ./output/video.mp4

# Render a silent video
npm run dev -- render -i ./input/sample-presentation.json -o ./output/video.mp4 --no-audio

# Export one image per slide
npm run dev -- export-images -i ./input/sample-presentation.json -o ./output/images

# Type-check
npm run typecheck
```

`render` options: `-l, --language` (tag used in narration file names, default `hi`), `--codec` (h264, h265, vp8, vp9), `--no-audio`.
`export-images` options: `--format` (png or jpeg), `--quality` (JPEG quality).

The studio and every render bundle `src/Root.tsx`, which imports `input/sample-presentation.json` and `input/override.json`, so both files must exist (`input/` is gitignored). An empty `{}` is fine for `override.json`.

## Slide layouts

- `front-page`: title, total posts badge, qualification pills and the Rozgaar logo
- `title-and-content`: blue title bar with content blocks below
- `last-page`: closing title and logo
- anything else: blue title bar with blocks stacked vertically

Block types are `text`, `bullets`, `image` and `code`.

## Project structure

```
src/
  cli.ts                     CLI (validate, render, export-images)
  pipeline.ts                renderPresentation() and exportSlideImages()
  Root.tsx                   Remotion composition
  compositions/Presentation.tsx
  components/                Slide, layouts, blocks, elements
  services/                  Google Text-to-Speech narration
  themes/default.ts          Colours, fonts and sizes
  utils/timing.ts            Slide timing
  zod-presentation-schema.ts Input schema
public/                      Logos and cached narration audio
```
