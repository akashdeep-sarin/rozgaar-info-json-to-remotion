import React from 'react';
import { AbsoluteFill, Audio } from 'remotion';
import { Theme } from '../themes';
import { Slide as SlideType } from '../zod-presentation-schema';
import { TitleSlideLayout, TwoColumnLayout, TitleAndContent, DefaultLayout } from './layouts';

interface SlideProps {
  slide: SlideType;
  theme: Theme;
  audioUrl?: string;
}

export const Slide: React.FC<SlideProps> = ({ slide, theme, audioUrl }) => {
  const getLayoutComponent = () => {
    const layout = slide.layout?.toLowerCase();
    
    switch (layout) {
      case 'title-slide':
        return TitleSlideLayout;
      case 'two-column':
        return TwoColumnLayout;
      case 'title-and-content':
        return TitleAndContent;
      default:
        return DefaultLayout;
    }
  };

  const LayoutComponent = getLayoutComponent();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
      }}
    >
      {/* Audio narration */}
      {audioUrl && <Audio src={audioUrl} />}

      {/* Slide title (if present and not in title-slide layout) */}
      {slide.title && slide.layout !== 'title-slide' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            padding: '2rem 4rem',
            backgroundColor: theme.colors.primary,
            color: '#FFFFFF',
          }}
        >
          <h2
            style={{
              fontSize: theme.fontSize.heading,
              fontWeight: '600',
              fontFamily: theme.fonts.heading,
              margin: 0,
            }}
          >
            {slide.title}
          </h2>
        </div>
      )}

      {/* Content area with layout */}
      <div
        style={{
          position: 'absolute',
          top: slide.title && slide.layout !== 'title-slide' ? '120px' : '0',
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <LayoutComponent blocks={slide.blocks} theme={theme} />
      </div>
    </AbsoluteFill>
  );
};
