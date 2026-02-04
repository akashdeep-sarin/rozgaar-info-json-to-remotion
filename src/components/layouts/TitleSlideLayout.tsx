import React from 'react';
import { Theme } from '../../themes';
import { SlideBlockType } from '../../zod-presentation-schema';
import { BlockRenderer } from './BlockRenderer';

interface TitleSlideLayoutProps {
  blocks: SlideBlockType[];
  theme: Theme;
}

export const TitleSlideLayout: React.FC<TitleSlideLayoutProps> = ({ blocks, theme }) => {
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
      {blocks.map((block, index) => (
        <div key={index} style={{ marginBottom: theme.spacing.blockGap }}>
          <BlockRenderer block={block} theme={theme} />
        </div>
      ))}
    </div>
  );
};
