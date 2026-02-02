import React from 'react';
import { Theme } from '../../themes';
import { SlideBlockType } from '../../zod-presentation-schema';
import { BlockRenderer } from './BlockRenderer';

interface TwoColumnLayoutProps {
  blocks: SlideBlockType[];
  theme: Theme;
}

export const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ({ blocks, theme }) => {
  // Split blocks into two columns
  const midPoint = Math.ceil(blocks.length / 2);
  const leftBlocks = blocks.slice(0, midPoint);
  const rightBlocks = blocks.slice(midPoint);

  return (
    <div
      style={{
        display: 'flex',
        gap: '2rem',
        height: '100%',
        padding: theme.spacing.slideMargin,
      }}
    >
      {/* Left Column */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: theme.spacing.blockGap }}>
        {leftBlocks.map((block, index) => (
          <BlockRenderer key={index} block={block} theme={theme} />
        ))}
      </div>

      {/* Right Column */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: theme.spacing.blockGap }}>
        {rightBlocks.map((block, index) => (
          <BlockRenderer key={index} block={block} theme={theme} />
        ))}
      </div>
    </div>
  );
};
