import React from 'react';
import { Composition } from 'remotion';
import { merge } from 'lodash';
import { Presentation, PresentationProps } from './compositions/Presentation';
import { Presentation as PresentationType } from './zod-presentation-schema';
import { FPS, WIDTH, HEIGHT, getTotalDuration } from './utils/timing';
import './style.css';

// Import JSON files
import basePresentationData from '../input/sample-presentation.json';
import overrideData from '../input/override.json';

// Apply overrides
const samplePresentation = merge({}, basePresentationData, overrideData) as PresentationType;

export const RemotionRoot: React.FC = () => {
  const defaultProps: PresentationProps = {
    presentationData: samplePresentation,
    audioMetadata: [],
  };

  return (
    <Composition
      id="Presentation"
      component={Presentation as any}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={defaultProps}
      calculateMetadata={({ props }) => {
        const { presentationData, audioMetadata } = props as unknown as PresentationProps;
        return {
          durationInFrames: getTotalDuration(presentationData.slides.length, audioMetadata),
        };
      }}
    />
  );
};
