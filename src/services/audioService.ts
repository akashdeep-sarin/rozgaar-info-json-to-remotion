import crypto from 'crypto';
import path from 'path';
import { parseFile } from 'music-metadata';
import synthesizeSpeech from './google_sound';
import { Slide } from '../zod-presentation-schema';
import { AudioMetadata, FPS } from '../utils/timing';

const AUDIO_DIR = path.join(process.cwd(), 'public', 'audio');

/**
 * Generate (or reuse) the narration audio for one slide.
 * The file name includes a hash of the narration text, so editing the
 * narration produces a new file instead of reusing stale audio.
 * Returns null when the slide has no narration.
 */
export async function fetchAudioForSlide(
  slide: Slide,
  index: number,
  language: string,
): Promise<AudioMetadata | null> {
  const narration = slide.audioNarrationInHindi?.trim();
  if (!narration) {
    return null;
  }

  const hash = crypto.createHash('sha1').update(narration).digest('hex').slice(0, 8);
  const fileName = `${index + 1}_${language}_${hash}.mp3`;
  const filePath = path.join(AUDIO_DIR, fileName);

  // Skips synthesis when the file already exists
  await synthesizeSpeech(narration, filePath);

  return {
    fileName,
    durationInFrames: await getAudioDuration(filePath, FPS),
  };
}

/**
 * Fetch audio for all slides, in slide order. Slides without narration get null.
 */
export function fetchAudioForSlides(
  slides: Slide[],
  language: string,
): Promise<Array<AudioMetadata | null>> {
  return Promise.all(slides.map((slide, index) => fetchAudioForSlide(slide, index, language)));
}

/**
 * Duration of an audio file in frames
 */
export async function getAudioDuration(filePath: string, fps: number = FPS): Promise<number> {
  try {
    const metadata = await parseFile(filePath);
    const durationInSeconds = metadata.format.duration || 0;
    return Math.ceil(durationInSeconds * fps);
  } catch (err) {
    throw new Error(`Failed to load audio metadata for ${filePath}: ${(err as Error).message}`);
  }
}
