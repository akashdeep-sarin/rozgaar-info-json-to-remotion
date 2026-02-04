import React from 'react';
import { AbsoluteFill, Sequence, Html5Audio, staticFile } from 'remotion';
import { Presentation as PresentationType } from '../zod-presentation-schema';
import { getTheme } from '../themes';
import { FrontPage } from '../components/FrontPage';
import { Slide } from '../components/Slide';

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
  const theme = getTheme(presentationData.theme);
  const frontPageDuration = 60; // 2 seconds at 30fps
  const frontPageEndFrame = presentationData.frontPage ? frontPageDuration : 0;
  const { logo } = presentationData;

  // Buffer: 0.5 seconds (15 frames) before and after each slide
  const bufferBeforeSlide = 15;
  const bufferAfterSlide = 15;

  let cumulativeDuration = 0;

  console.log(JSON.stringify(audioMetadata));

  return (
    <AbsoluteFill style={{ backgroundColor: theme.background }}>
      {/* Front Page */}
      {presentationData.frontPage && (
        <Sequence from={0} durationInFrames={frontPageDuration}>
          <FrontPage
            title={presentationData.frontPage.title}
            author={presentationData.frontPage.author}
            date={presentationData.frontPage.date}
            logo={logo}
            theme={theme}
          />
        </Sequence>
      )}

      {/* Slides */}
      {presentationData.slides.map((slide, index) => {
        const audioDuration = audioMetadata[index]?.durationInFrames || 300;
        const duration = bufferBeforeSlide + audioDuration + bufferAfterSlide;
        const audioUrl = audioMetadata[index]?.url;
        const audioSrc = audioUrl ? staticFile('audio/' + audioUrl.slice(audioUrl.lastIndexOf('\\') + 1)) : undefined;
        
        const slideStart = frontPageEndFrame + cumulativeDuration;
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
