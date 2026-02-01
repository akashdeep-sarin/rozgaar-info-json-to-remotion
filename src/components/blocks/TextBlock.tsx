import React from 'react';
import { Theme } from '../../themes';

interface TextBlockProps {
  text: string;
  style?: 'normal' | 'title' | 'subtitle' | 'code';
  theme: Theme;
}

export const TextBlock: React.FC<TextBlockProps> = ({ text, style = 'normal', theme }) => {
  const getStyleClasses = () => {
    switch (style) {
      case 'title':
        return {
          fontSize: theme.fontSize.title,
          fontWeight: '700',
          color: theme.colors.primary,
          fontFamily: theme.fonts.heading,
          marginBottom: theme.spacing.headingMargin,
        };
      case 'subtitle':
        return {
          fontSize: theme.fontSize.subtitle,
          fontWeight: '600',
          color: theme.colors.textSecondary,
          fontFamily: theme.fonts.heading,
          marginBottom: theme.spacing.blockGap,
        };
      case 'code':
        return {
          fontSize: theme.fontSize.body,
          fontWeight: '400',
          color: theme.colors.text,
          fontFamily: theme.fonts.code,
          backgroundColor: theme.colors.accent,
          padding: '1rem',
          borderRadius: '0.5rem',
        };
      default:
        return {
          fontSize: theme.fontSize.body,
          fontWeight: '400',
          color: theme.colors.text,
          fontFamily: theme.fonts.body,
          lineHeight: '1.6',
        };
    }
  };

  return (
    <div style={getStyleClasses()}>
      {text}
    </div>
  );
};
