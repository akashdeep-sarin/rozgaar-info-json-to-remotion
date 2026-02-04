import fs from 'fs';
import audioAPI from './google_sound';
import path from 'path';
import { parseFile } from 'music-metadata';
export interface AudioMetadata {
  url: string;
  durationInFrames: number;
}

export interface AudioAPIConfig {
  endpoint?: string;
  apiKey?: string;
  enabled?: boolean;
}

export interface NarrationMetadata {
  language: 'en' | 'hi';
  narration: any[];
}

/**
 * Placeholder function to fetch audio for a slide.
 * TODO: Replace with actual API integration
 *
 * @param slideId - The unique identifier for the slide
 * @param language - The language for the narration ('en' or 'hi')
 * @param config - API configuration
 * @returns Audio metadata with URL and duration
 */
export async function fetchAudioForSlide(
  slideId: number,
  narrationMetadata: NarrationMetadata,
  config?: AudioAPIConfig,
): Promise<AudioMetadata> {
  const language = narrationMetadata.language;
  const filename = `${slideId}_${language}.mp3`;
  const filepath = path.join(process.cwd(), 'public', 'audio', filename);

  // check if file already exists at path
  // if (!fs.existsSync(filepath)) {
    await audioAPI(narrationMetadata.narration[slideId - 1].audioNarrationInHindi, filepath);
  // }

  return {
    url: filepath,
    durationInFrames: await getAudioDuration(filepath, 30),
  };
}

/**
 * Fetch audio metadata for all slides in a presentation
 *
 * @param slideIds - Array of slide IDs
 * @param language - Language for narration
 * @param config - API configuration
 * @returns Array of audio metadata
 */
export async function fetchAudioForSlides(
  slideIds: number[],
  narrationMetadata: NarrationMetadata,
  config?: AudioAPIConfig,
): Promise<AudioMetadata[]> {
  const audioPromises = slideIds.map((id) => fetchAudioForSlide(id, narrationMetadata, config));
  return Promise.all(audioPromises);
}

/**
 * Get duration from an audio file (supports both browser and Node.js environments)
 * This can be used to dynamically calculate slide duration
 */
export function getAudioDuration(audioUrl: string, fps: number = 30): Promise<number> {
  if (typeof window !== 'undefined' && typeof Audio !== 'undefined') {
    // Browser implementation
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl);

      audio.addEventListener('loadedmetadata', () => {
        const durationInFrames = Math.ceil(audio.duration * fps);
        resolve(durationInFrames);
      });

      audio.addEventListener('error', () => {
        reject(new Error(`Failed to load audio: ${audioUrl}`));
      });
    });
  } else {
    // Node.js implementation using music-metadata
    const { parseFile } = require('music-metadata');

    return parseFile(audioUrl)
      .then((metadata) => {
        const durationInSeconds = metadata.format.duration || 0;
        console.log("Duration in Sec: "+durationInSeconds +"for slide "+ audioUrl)
        const durationInFrames = Math.ceil(durationInSeconds * fps);
        return durationInFrames;
      })
      .catch((err) => {
        throw new Error(`Failed to load audio metadata: ${err.message}`);
      });
  }
}
