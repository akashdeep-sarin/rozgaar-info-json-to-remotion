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

// Calculate total duration
const calculateTotalDuration = (presentationData: PresentationType, audioMetadata: any[]) => {
  const frontPageDuration = 60; // 2 seconds
  const slidesDuration = audioMetadata.reduce((acc, meta) => acc + (meta?.durationInFrames || 300), 0);
  return frontPageDuration + slidesDuration;
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Presentation"
        component={Presentation}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          presentationData: samplePresentation as PresentationType,
          language: 'en' as const,
          audioMetadata: [],
        }}
        calculateMetadata={({ props }) => {
          // Calculate actual duration based on audioMetadata
          const frontPageDuration = props.presentationData.frontPage ? 60 : 0;
          
          // Buffer: 0.5 seconds before and after each slide (15 frames each at 30fps)
          const bufferBeforeSlide = 15; // 0.5 seconds
          const bufferAfterSlide = 15;  // 0.5 seconds
          const totalBufferPerSlide = bufferBeforeSlide + bufferAfterSlide;
          
          let totalAudioDuration = 0;
          if (props.audioMetadata && props.audioMetadata.length > 0) {
            // Use actual audio durations + buffer for each slide
            totalAudioDuration = props.audioMetadata.reduce(
              (sum, audio) => sum + (audio?.durationInFrames || 300) + totalBufferPerSlide,
              0
            );
          } else {
            // Fallback to default 10 seconds per slide + buffer
            totalAudioDuration = props.presentationData.slides.length * (300 + totalBufferPerSlide);
          }

          const totalDuration = frontPageDuration + totalAudioDuration;

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
