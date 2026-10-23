export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// 0.5 seconds of silence before and after each slide's narration
export const SLIDE_BUFFER_FRAMES = 15;
// Used when a slide has no narration audio (10 seconds)
export const DEFAULT_SLIDE_FRAMES = 300;

export interface AudioMetadata {
  // File name inside public/audio
  fileName: string;
  durationInFrames: number;
}

export interface SlideTiming {
  from: number;
  durationInFrames: number;
  audioFrames: number;
  audio: AudioMetadata | null;
}

/**
 * Start frame and length of every slide. Each slide gets a buffer before and
 * after its narration, or the default length when it has none.
 */
export function getSlideTimings(
  slideCount: number,
  audioMetadata: Array<AudioMetadata | null> = [],
): SlideTiming[] {
  const timings: SlideTiming[] = [];
  let from = 0;
  for (let i = 0; i < slideCount; i++) {
    const audio = audioMetadata[i] ?? null;
    const audioFrames = audio?.durationInFrames || DEFAULT_SLIDE_FRAMES;
    const durationInFrames = SLIDE_BUFFER_FRAMES + audioFrames + SLIDE_BUFFER_FRAMES;
    timings.push({ from, durationInFrames, audioFrames, audio });
    from += durationInFrames;
  }
  return timings;
}

export function getTotalDuration(
  slideCount: number,
  audioMetadata: Array<AudioMetadata | null> = [],
): number {
  return getSlideTimings(slideCount, audioMetadata).reduce((sum, t) => sum + t.durationInFrames, 0);
}
