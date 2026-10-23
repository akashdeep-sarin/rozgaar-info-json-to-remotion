import React from 'react';
import { AbsoluteFill, Sequence, Html5Audio, staticFile } from 'remotion';
import { Presentation as PresentationType } from '../zod-presentation-schema';
import { theme } from '../themes';
import { Slide } from '../components/Slide';
import { AudioMetadata, SLIDE_BUFFER_FRAMES, getSlideTimings } from '../utils/timing';

export interface PresentationProps {
  presentationData: PresentationType;
  audioMetadata?: Array<AudioMetadata | null>;
}

export const Presentation: React.FC<PresentationProps> = ({ presentationData, audioMetadata = [] }) => {
  const timings = getSlideTimings(presentationData.slides.length, audioMetadata);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      {presentationData.slides.map((slide, index) => {
        const { from, durationInFrames, audioFrames, audio } = timings[index];
        return (
          <Sequence from={from} durationInFrames={durationInFrames} key={slide.id || index}>
            {/* Narration starts after the buffer before the slide */}
            {audio && (
              <Sequence from={SLIDE_BUFFER_FRAMES} durationInFrames={audioFrames}>
                <Html5Audio src={staticFile('audio/' + audio.fileName)} />
              </Sequence>
            )}
            {/* Slide visual is shown for the entire duration including buffers */}
            <Slide slide={slide} theme={theme} metadata={presentationData.metadata} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
