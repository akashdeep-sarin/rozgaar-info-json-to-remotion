import React from 'react';
import { Theme } from '../../themes';
import { SlideBlockType } from '../../zod-presentation-schema';
import { BlockRenderer } from './BlockRenderer';

interface TitleAndContentProps {
  blocks: SlideBlockType[];
  theme: Theme;
}

export const TitleAndContent: React.FC<TitleAndContentProps> = ({ blocks, theme }) => {
  // Split blocks into two columns
  // const midPoint = Math.ceil(blocks.length / 2);
  // const leftBlocks = blocks.slice(0, midPoint);
  // const rightBlocks = blocks.slice(midPoint);

  return (
    <div
      style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      height: '100%',
      padding: theme.spacing.slideMargin,
      }}
    >
      {blocks
      .sort((a, b) => (a.type === 'text' ? -1 : b.type === 'text' ? 1 : 0))
      .map((block, index) => (
        <div key={index} style={{ marginBottom: theme.spacing.blockGap }}>
        <BlockRenderer block={block} theme={theme} />
        </div>
      ))}
    </div>
  );
};

//block.type