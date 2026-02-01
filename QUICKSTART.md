# Quick Start Guide

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Preview the Sample

```bash
npm start
```

This opens `http://localhost:3000` where you can:
- Preview all slides
- Scrub through the timeline
- See the composition in real-time

## Step 3: Validate Your JSON

```bash
npm run dev validate -- -i ./input/sample-presentation.json
```

Output:
```
🔍 Validating presentation...
✅ Presentation is valid!
   Title: Guide to Government Bank Jobs in India
   Slides: 13
   Theme: gov-blue
```

## Step 4: Render to Video

```bash
npm run dev render -- -i ./input/sample-presentation.json -o ./output/my-video.mp4 -l en
```

## Customizing Your Presentation

### 1. Create a New JSON File

Copy `input/sample-presentation.json` and modify:

```json
{
  "title": "My Presentation",
  "theme": "default",
  "slides": [
    {
      "id": "slide-1",
      "layout": "title-slide",
      "blocks": [
        { "type": "text", "text": "Hello World", "style": "title" }
      ]
    }
  ]
}
```

### 2. Add Audio Files (Optional)

Place audio files in `public/audio/` with naming:
- `{slide-id}_en.mp3` for English
- `{slide-id}_hi.mp3` for Hindi

Example: `public/audio/slide-01-welcome_en.mp3`

### 3. Create Custom Themes

Edit `src/themes/your-theme.ts`:

```typescript
export const myTheme: Theme = {
  name: 'my-theme',
  colors: {
    primary: '#FF6B6B',
    background: '#FFFFFF',
    // ... more colors
  },
  // ... fonts, spacing, etc.
};
```

Then register in `src/themes/index.ts`.

## Troubleshooting

### "Module not found" errors

```bash
npm install
```

### Preview not loading

Check that port 3000 is available or Remotion will use another port.

### Validation errors

Use the validate command to see detailed schema errors:

```bash
npm run dev validate -- -i ./input/your-file.json
```

## Next Steps

1. ✅ Read the full README.md
2. ✅ Explore the sample presentation
3. ✅ Create your first custom presentation
4. ✅ Integrate your audio API in `src/services/audioService.ts`
5. ✅ Add custom themes and layouts
