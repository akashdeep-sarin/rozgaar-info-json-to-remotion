import React, { useEffect } from 'react';
import { AbsoluteFill, Sequence, Html5Audio, staticFile } from 'remotion';
import { Presentation as PresentationType } from '../zod-presentation-schema';
import { getTheme } from '../themes';
import { Slide } from '../components/Slide';
import { usePresentationStore } from '../store';

interface PresentationProps {
  presentationData: PresentationType;
  language?: 'en' | 'hi';
  audioMetadata?: Array<{ url: string; durationInFrames: number }>;
}

export const Presentation: React.FC<PresentationProps> = ({
  presentationData,
  language = 'en',
  audioMetadata = [],
}) => {
  const setMetadata = usePresentationStore((state) => state.setMetadata);

  useEffect(() => {
    if (presentationData.metadata) {
      setMetadata(presentationData.metadata);
    }
  }, [presentationData.metadata, setMetadata]);

  const theme = getTheme(presentationData.theme);
  const { logo } = presentationData;

  // Buffer: 0.5 seconds (15 frames) before and after each slide
  const bufferBeforeSlide = 15;
  const bufferAfterSlide = 15;

  let cumulativeDuration = 0;

  console.log(JSON.stringify(audioMetadata));

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      {/* All Slides (including front page as first slide) */}
      {presentationData.slides.map((slide, index) => {
        const audioDuration = audioMetadata[index]?.durationInFrames || 300;
        const duration = bufferBeforeSlide + audioDuration + bufferAfterSlide;
        const audioUrl = audioMetadata[index]?.url;
        const audioSrc = audioUrl ? staticFile('audio/' + audioUrl.slice(audioUrl.lastIndexOf('\\') + 1)) : undefined;
        
        const slideStart = cumulativeDuration;
        cumulativeDuration += duration;
        
        return (
          <Sequence from={slideStart} durationInFrames={duration} key={slide.id || index}>
            {/* Audio with buffer - starts after bufferBeforeSlide */}
            {audioSrc && (
              <Sequence from={bufferBeforeSlide} durationInFrames={audioDuration}>
                <Html5Audio src={audioSrc} />
              </Sequence>
            )}
            {/* Slide visual - shown for entire duration including buffers */}
            <Slide slide={slide} theme={theme} audioUrl={undefined} logo={logo} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
