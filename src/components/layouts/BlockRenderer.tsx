import React from 'react';
import { Theme } from '../../themes';
import { SlideBlockType } from '../../zod-presentation-schema';
import { TextBlock, BulletsBlock, ImageBlock, CodeBlock } from '../blocks';

interface BlockRendererProps {
  block: SlideBlockType;
  theme: Theme;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ block, theme }) => {
  switch (block.type) {
    case 'text':
      return <TextBlock text={block.text} style={block.style} theme={theme} />;
    case 'bullets':
      return <BulletsBlock items={block.items} theme={theme} />;
    case 'image':
      return <ImageBlock alt={block.alt} caption={block.caption} theme={theme} />;
    case 'code':
      return <CodeBlock code={block.code} language={block.language} theme={theme} />;
    default:
      return null;
  }
};
