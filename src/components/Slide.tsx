import React from 'react';
import { Img, staticFile } from 'remotion';
import { Theme } from '../themes';
import { Slide as SlideType, PresentationMetadata } from '../zod-presentation-schema';
import { TitleAndContent, DefaultLayout, FrontPageLayout, LastPageLayout } from './layouts';
import Background from './elements/Background';

interface SlideProps {
  slide: SlideType;
  theme: Theme;
  metadata: PresentationMetadata;
}

export const Slide: React.FC<SlideProps> = ({ slide, theme, metadata }) => {
  const getLayoutComponent = () => {
    const layout = slide.layout?.toLowerCase();

    switch (layout) {
      case 'title-and-content':
        return TitleAndContent;
      default:
        return DefaultLayout;
    }
  };

  const FrontAndLastLayout: React.FC<SlideProps> = ({ slide, theme, metadata }) => {
    const LayoutComponent = slide.layout === 'front-page' ? FrontPageLayout : LastPageLayout;
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <LayoutComponent text={slide.title} theme={theme} metadata={metadata} />
      </div>
    );
  };

  const TitleLayout: React.FC<SlideProps> = ({ slide, theme }) => {
    const LayoutComponent = getLayoutComponent();
    return (
    <>
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
            display: 'flex',
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

      <Img
        src={staticFile("/rozgaar_info.png")}
        alt="Logo"
        style={{
          position: 'absolute',
          bottom: '40px',
          right: '100px',
          maxWidth: '280px',
          maxHeight: '280px',
          marginBottom: '3rem',
        }}
      />

      {/* Content area with layout */}
      <div
        style={{
          position: 'absolute',
          top: slide.title ? '120px' : '0',
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <LayoutComponent blocks={slide.blocks} theme={theme} />
      </div>
    </>
    );
  };

  return (
    <Background theme={theme}>
      {['front-page', 'last-page'].includes(slide.layout) ? (
        <FrontAndLastLayout slide={slide} theme={theme} metadata={metadata} />
      ) : (
        <TitleLayout slide={slide} theme={theme} metadata={metadata} />
      )}
    </Background>
  );
};
