import React, { useMemo } from 'react';
import { Series } from 'remotion';
import { Presentation as PresentationType } from '../zod-presentation-schema';
import { getTheme } from '../themes';
import { FrontPage } from '../components/FrontPage';
import { Slide } from '../components/Slide';
import { fetchAudioForSlide } from '../services/audioService';

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
  // const theme = getTheme(presentationData.theme);
  const theme = getTheme(null); // KEEP IT NULL FOR NOW
  // Default front page duration: 2 seconds at 30fps = 60 frames
  const frontPageDuration = 60;
  const { logo } = presentationData;

  return (
    <Series>
      {/* Front Page */}
      {presentationData.frontPage && (
        <Series.Sequence durationInFrames={frontPageDuration}>
          <FrontPage
            title={presentationData.frontPage.title}
            author={presentationData.frontPage.author}
            date={presentationData.frontPage.date}
            logo={logo}
            theme={theme}
          />
        </Series.Sequence>
      )}

      {/* Slides */}
      {presentationData.slides.map((slide, index) => {
        // Use provided audio metadata or default duration (10 seconds = 300 frames)
        const duration = audioMetadata[index]?.durationInFrames || 300;
        const audioUrl = audioMetadata[index]?.url;

        return (
          <Series.Sequence key={slide.id || index} durationInFrames={duration}>
            <Slide slide={slide} theme={theme} audioUrl={audioUrl} logo={logo} />
          </Series.Sequence>
        );
      })}
    </Series>
  );
};
