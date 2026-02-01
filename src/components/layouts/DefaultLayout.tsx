import React from 'react';
import { Theme } from '../../themes';
import { SlideBlockType } from '../../zod-presentation-schema';
import { BlockRenderer } from './BlockRenderer';

interface DefaultLayoutProps {
  blocks: SlideBlockType[];
  theme: Theme;
}

export const DefaultLayout: React.FC<DefaultLayoutProps> = ({ blocks, theme }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.blockGap,
        padding: theme.spacing.slideMargin,
        height: '100%',
      }}
    >
      {blocks.map((block, index) => (
        <BlockRenderer key={index} block={block} theme={theme} />
      ))}
    </div>
  );
};
