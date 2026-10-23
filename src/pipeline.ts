import * as fs from 'fs';
import * as path from 'path';
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import { Presentation, PresentationSchema } from './zod-presentation-schema';
import { fetchAudioForSlides } from './services/audioService';
import { AudioMetadata, getSlideTimings } from './utils/timing';
import { webpackOverride } from './webpack-override';

const COMPOSITION_ID = 'Presentation';

export type Codec = 'h264' | 'h265' | 'vp8' | 'vp9';

export interface RenderOptions {
  // Used in the narration file names (narration itself is always Hindi)
  language?: string;
  codec?: Codec;
  // Set to false to render a silent video with the default slide length
  audio?: boolean;
  onProgress?: (progress: { progress: number; renderedFrames: number; encodedFrames: number }) => void;
}

export interface ExportImagesOptions {
  format?: 'png' | 'jpeg';
  jpegQuality?: number;
}

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function bundleProject(): Promise<string> {
  return bundle({
    entryPoint: path.resolve(__dirname, './index.ts'),
    webpackOverride,
  });
}

/**
 * Validate presentation JSON and render it to a video file.
 * Returns the absolute path of the rendered video.
 */
export async function renderPresentation(
  input: unknown,
  outputPath: string,
  options: RenderOptions = {},
): Promise<string> {
  const { language = 'hi', codec = 'h264', audio = true, onProgress } = options;
  const presentationData: Presentation = PresentationSchema.parse(input);

  const audioMetadata: Array<AudioMetadata | null> = audio
    ? await fetchAudioForSlides(presentationData.slides, language)
    : [];

  const serveUrl = await bundleProject();
  const inputProps = { presentationData, audioMetadata };
  const composition = await selectComposition({ serveUrl, id: COMPOSITION_ID, inputProps });

  const outputLocation = path.resolve(outputPath);
  ensureDir(path.dirname(outputLocation));

  await renderMedia({ composition, serveUrl, codec, outputLocation, inputProps, onProgress });
  return outputLocation;
}

/**
 * Validate presentation JSON and save one still image per slide.
 * Returns the absolute paths of the images, in slide order.
 */
export async function exportSlideImages(
  input: unknown,
  outputDir: string,
  options: ExportImagesOptions = {},
): Promise<string[]> {
  const { format = 'png', jpegQuality = 90 } = options;
  const presentationData: Presentation = PresentationSchema.parse(input);

  const serveUrl = await bundleProject();
  const inputProps = { presentationData, audioMetadata: [] };
  const composition = await selectComposition({ serveUrl, id: COMPOSITION_ID, inputProps });

  const dir = path.resolve(outputDir);
  ensureDir(dir);

  const timings = getSlideTimings(presentationData.slides.length);
  const outputs: string[] = [];
  for (let i = 0; i < presentationData.slides.length; i++) {
    const slideNumber = String(i + 1).padStart(2, '0');
    const output = path.join(dir, `${slideNumber}-${presentationData.slides[i].layout}.${format}`);
    // Middle of the slide, so any entrance animation has finished
    const frame = timings[i].from + Math.floor(timings[i].durationInFrames / 2);
    await renderStill({
      composition,
      serveUrl,
      output,
      frame,
      inputProps,
      imageFormat: format,
      jpegQuality: format === 'jpeg' ? jpegQuality : undefined,
    });
    outputs.push(output);
  }
  return outputs;
}
