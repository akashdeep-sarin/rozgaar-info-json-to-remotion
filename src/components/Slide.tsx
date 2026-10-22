import React from 'react';
import { Img, staticFile } from 'remotion';
import { Theme } from '../themes';
import { Slide as SlideType } from '../zod-presentation-schema';
import { TitleSlideLayout, TwoColumnLayout, TitleAndContent, DefaultLayout, FrontPageLayout, LastPageLayout } from './layouts';
import Background from './elements/Background';

interface SlideProps {
  slide: SlideType;
  theme: Theme;
  audioUrl?: string;
  logo?: string | null;
}

export const Slide: React.FC<SlideProps> = ({ slide, theme, logo, audioUrl }) => {
  const getLayoutComponent = () => {
    const layout = slide.layout?.toLowerCase();

    switch (layout) {
      case 'front-page':
        return FrontPageLayout;
      case 'last-page':
        return LastPageLayout;
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

  const FrontAndLastLayout: React.FC<SlideProps> = ({ slide, theme, logo }) => <>
  
        <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <LayoutComponent text={slide?.title} slide={slide} theme={theme} logo={logo}/>
        
      </div>
  </>;

 

  const TitleLayout: React.FC<SlideProps> = ({ slide, theme, logo }) => (
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

      {logo && (
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
    </>
  );

  return (
    <Background theme={theme}>
      {['title-slide', 'front-page', 'last-page'].includes(slide?.layout) ? (
        <FrontAndLastLayout slide={slide} theme={theme} logo={logo} audioUrl={audioUrl} />
      ) : (
        <TitleLayout slide={slide} theme={theme} logo={logo} audioUrl={audioUrl} />
      )}
    </Background>
  );
};
