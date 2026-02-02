import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { Theme } from '../themes';

interface FrontPageProps {
  title: string;
  author: string | null;
  date: string | null;
  logo: string | null;
  theme: Theme;
}

export const FrontPage: React.FC<FrontPageProps> = ({ title, author, date, logo, theme }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.background,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.slideMargin,
      }}
    >
      {logo && (
        <Img
          src={staticFile(logo.startsWith('/') ? logo.slice(1) : logo)}
          alt="Logo"
          style={{
            position: "absolute",
            top:"80px",
            right:"100px",
            maxWidth: '280px',
            maxHeight: '280px',
            marginBottom: '3rem',
          }}
        />
      )}

      <h1
        style={{
          fontSize: theme.fontSize.title,
          fontWeight: '700',
          color: theme.colors.primary,
          fontFamily: theme.fonts.heading,
          textAlign: 'center',
          marginBottom: '2rem',
          maxWidth: '60%',
        }}
      >
        {title}
      </h1>

      {author && (
        <p
          style={{
            fontSize: theme.fontSize.subtitle,
            color: theme.colors.textSecondary,
            fontFamily: theme.fonts.body,
            marginBottom: '1rem',
          }}
        >
          {author}
        </p>
      )}

      {date && (
        <p
          style={{
            fontSize: theme.fontSize.body,
            color: theme.colors.textSecondary,
            fontFamily: theme.fonts.body,
          }}
        >
          {date}
        </p>
      )}
    </AbsoluteFill>
  );
};
