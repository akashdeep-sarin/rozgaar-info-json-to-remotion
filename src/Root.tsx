import React from 'react';
import { Composition } from 'remotion';
import { merge } from 'lodash';
import { Presentation } from './compositions/Presentation';
import { Presentation as PresentationType } from './zod-presentation-schema';
import './style.css';

// Import JSON files
import basePresentationData from '../input/sample-presentation.json';
import overrideData from '../input/override.json';

// Apply overrides
const samplePresentation = merge({}, basePresentationData, overrideData) as PresentationType;

interface PresentationInputProps {
  presentationData: PresentationType;
  language?: 'en' | 'hi';
  audioMetadata?: Array<{ url: string; durationInFrames: number }>;
}

export const RemotionRoot: React.FC = () => {
  const defaultPropsValue: PresentationInputProps = {
    presentationData: samplePresentation as PresentationType,
    language: 'en' as const,
    audioMetadata: [],
  };

  return (
    <>
      <Composition
        id="Presentation"
        component={Presentation as any}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={defaultPropsValue}
        calculateMetadata={({ props }) => {
          const typedProps = props as unknown as PresentationInputProps;
          // Calculate actual duration based on audioMetadata
          
          // Buffer: 0.5 seconds before and after each slide (15 frames each at 30fps)
          const bufferBeforeSlide = 15; // 0.5 seconds
          const bufferAfterSlide = 15;  // 0.5 seconds
          const totalBufferPerSlide = bufferBeforeSlide + bufferAfterSlide;
          
          let totalAudioDuration = 0;
          if (typedProps.audioMetadata && typedProps.audioMetadata.length > 0) {
            // Use actual audio durations + buffer for each slide
            totalAudioDuration = typedProps.audioMetadata.reduce(
              (sum, audio) => sum + (audio?.durationInFrames || 300) + totalBufferPerSlide,
              0
            );
          } else {
            // Fallback to default 10 seconds per slide + buffer
            totalAudioDuration = typedProps.presentationData.slides.length * (300 + totalBufferPerSlide);
          }

          const totalDuration = totalAudioDuration;

          return {
            durationInFrames: totalDuration,
            fps: 30,
            width: 1920,
            height: 1080,
          };
        }}
      />
    </>
  );
};
