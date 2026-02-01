import React from 'react';
import { Theme } from '../../themes';

interface CodeBlockProps {
  code: string;
  language: string | null;
  theme: Theme;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, theme }) => {
  return (
    <div style={{ marginBottom: theme.spacing.blockGap }}>
      {language && (
        <div 
          style={{
            fontSize: theme.fontSize.small,
            color: theme.colors.textSecondary,
            marginBottom: '0.5rem',
            fontFamily: theme.fonts.code,
          }}
        >
          {language}
        </div>
      )}
      <pre
        style={{
          backgroundColor: theme.colors.accent,
          padding: '1.5rem',
          borderRadius: '0.5rem',
          overflow: 'auto',
          border: `1px solid ${theme.colors.border}`,
        }}
      >
        <code
          style={{
            fontSize: theme.fontSize.body,
            fontFamily: theme.fonts.code,
            color: theme.colors.text,
            lineHeight: '1.6',
          }}
        >
          {code}
        </code>
      </pre>
    </div>
  );
};
