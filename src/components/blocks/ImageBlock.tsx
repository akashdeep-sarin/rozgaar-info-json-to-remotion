import React from 'react';
import { Theme } from '../../themes';
import { Img } from 'remotion';

interface ImageBlockProps {
  src?: string;
  alt: string | null;
  caption: string | null;
  theme: Theme;
}

export const ImageBlock: React.FC<ImageBlockProps> = ({ src, alt, caption, theme }) => {
  if (!src) {
    return (
      <div 
        style={{
          backgroundColor: theme.colors.accent,
          padding: '2rem',
          borderRadius: '0.5rem',
          textAlign: 'center',
          color: theme.colors.textSecondary,
          fontSize: theme.fontSize.small,
        }}
      >
        No image source provided
      </div>
    );
  }

  return (
    <div style={{ marginBottom: theme.spacing.blockGap }}>
      <Img
        src={src}
        alt={alt || 'Image'}
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: '0.5rem',
          border: `2px solid ${theme.colors.border}`,
        }}
      />
      {caption && (
        <p 
          style={{
            marginTop: '0.5rem',
            fontSize: theme.fontSize.small,
            color: theme.colors.textSecondary,
            textAlign: 'center',
            fontStyle: 'italic',
          }}
        >
          {caption}
        </p>
      )}
    </div>
  );
};
