import React from 'react';
import { Theme } from '../../themes';
import { Img, staticFile } from 'remotion';

interface LastPageLayoutProps {
  text: string;
  theme: Theme;
  logo: string;
}

export const LastPageLayout: React.FC<LastPageLayoutProps> = ({ text, theme, logo }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        height: '100%',
        padding: theme.spacing.slideMargin,
      }}
    >
      {logo && (
        <Img
          src={staticFile("/rozgaar_info_website.png")}
          alt="Logo"
          style={{
            position: 'absolute',
            top: '100px',
            right: '100px',
            maxWidth: '280px',
            maxHeight: '280px',
            marginBottom: '3rem',
          }}
        />
      )}
      <span
        style={{
          fontWeight: 'bold',
          display: 'block',
          width: '70%',
          fontSize: theme.fontSize.heading,
          fontFamily: theme.fonts.heading,
        }}
      >
        {text}
      </span>
    </div>
  );
};
