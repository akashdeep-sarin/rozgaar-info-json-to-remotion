import React from 'react';
import { Composition } from 'remotion';
import { Presentation } from './compositions/Presentation';
import { Presentation as PresentationType } from './zod-presentation-schema';
import './style.css';

// Import sample data for preview
import samplePresentation from '../input/sample-presentation.json';

interface PresentationInputProps {
  presentationData: PresentationType;
  language?: 'en' | 'hi';
  audioMetadata?: Array<{ url: string; durationInFrames: number }>;
}

// Calculate total duration
const calculateTotalDuration = (presentationData: PresentationType, audioMetadata: any[]) => {
  const frontPageDuration = 60; // 2 seconds
  const slidesDuration = audioMetadata.reduce((acc, meta) => acc + (meta?.durationInFrames || 300), 0);
  return frontPageDuration + slidesDuration;
};

export const RemotionRoot: React.FC = () => {
  // Mock audio metadata for preview
  const mockAudioMetadata = (samplePresentation as PresentationType).slides.map((slide, index) => ({
    url: `/audio/${slide.id}_en.mp3`,
    durationInFrames: 300, // 10 seconds per slide
  }));

  const totalDuration = calculateTotalDuration(samplePresentation as PresentationType, mockAudioMetadata);

  return (
    <>
      <Composition
        id="Presentation"
        component={Presentation}
        durationInFrames={totalDuration}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          presentationData: samplePresentation as PresentationType,
          language: 'en' as const,
          audioMetadata: mockAudioMetadata,
        }}
      />
    </>
  );
};
