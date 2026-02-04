import React from 'react';
import { AbsoluteFill, Html5Audio, Img, staticFile } from 'remotion';
import { Theme } from '../themes';
import { Slide as SlideType } from '../zod-presentation-schema';
import { TitleSlideLayout, TwoColumnLayout, TitleAndContent, DefaultLayout } from './layouts';

interface SlideProps {
  slide: SlideType;
  theme: Theme;
  audioUrl?: string;
  logo: string;
}

export const Slide: React.FC<SlideProps> = ({ slide, theme, logo, audioUrl }) => {

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
      {logo && (
        <Img
          src={staticFile(logo.startsWith('/') ? logo.slice(1) : logo)}
          alt="Logo"
          style={{
            position: "absolute",
            bottom:"40px",
            right:"100px",
            maxWidth: '280px',
            maxHeight: '280px',
            marginBottom: '3rem',
          }}
        />
      )}

      {/* Slide title (if present and not in title-slide layout) */}
      {slide.title && slide.layout !== 'title-slide' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            padding: '2rem 4rem 1.25rem',
            backgroundColor: theme.colors.primary,
            color: '#FFFFFF',
          }}
        >
          <h2
            style={{
              display:'flex',
              justifyContent: 'center',
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
