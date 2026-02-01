export interface AudioMetadata {
  url: string;
  durationInFrames: number;
}

export interface AudioAPIConfig {
  endpoint?: string;
  apiKey?: string;
  enabled?: boolean;
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
  slideId: string,
  language: 'en' | 'hi',
  config?: AudioAPIConfig
): Promise<AudioMetadata> {
  // TODO: Implement actual API call here
  // Example:
  // const response = await fetch(`${config.endpoint}/audio/${slideId}?lang=${language}`, {
  //   headers: { 'Authorization': `Bearer ${config.apiKey}` }
  // });
  // const data = await response.json();
  // return { url: data.url, durationInFrames: data.duration * 30 };

  // For now, return mock data
  // Assuming audio files are in public/audio/ folder with naming: {slideId}_{language}.mp3
  const audioUrl = `/audio/${slideId}_${language}.mp3`;
  
  // Mock duration: 10 seconds at 30 fps = 300 frames
  // In production, you'd fetch this from the API or analyze the audio file
  const durationInFrames = 300;

  return {
    url: audioUrl,
    durationInFrames,
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
  slideIds: string[],
  language: 'en' | 'hi',
  config?: AudioAPIConfig
): Promise<AudioMetadata[]> {
  const audioPromises = slideIds.map(id => fetchAudioForSlide(id, language, config));
  return Promise.all(audioPromises);
}

/**
 * Get duration from an audio file (client-side)
 * This can be used to dynamically calculate slide duration
 */
export function getAudioDuration(audioUrl: string, fps: number = 30): Promise<number> {
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
}
