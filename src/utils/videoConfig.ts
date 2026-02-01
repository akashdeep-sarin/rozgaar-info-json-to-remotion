export interface VideoConfig {
  width: number;
  height: number;
  fps: number;
  codec?: 'h264' | 'h265' | 'vp8' | 'vp9';
  audioBitrate?: string;
  videoBitrate?: string;
}

export const defaultVideoConfig: VideoConfig = {
  width: 1920,
  height: 1080,
  fps: 30,
  codec: 'h264',
  audioBitrate: '192k',
  videoBitrate: '5M',
};

/**
 * Merge user config with defaults
 */
export function getVideoConfig(userConfig?: Partial<VideoConfig>): VideoConfig {
  return {
    ...defaultVideoConfig,
    ...userConfig,
  };
}
