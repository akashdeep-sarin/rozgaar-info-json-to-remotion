import React from 'react';
import { Theme } from '../../themes';

interface BulletsBlockProps {
  items: string[];
  theme: Theme;
}

export const BulletsBlock: React.FC<BulletsBlockProps> = ({ items, theme }) => {
  return (
    <ul 
      style={{
        listStyleType: 'disc',
        paddingLeft: '2rem',
        color: theme.colors.text,
        fontSize: theme.fontSize.body,
        fontFamily: theme.fonts.body,
        lineHeight: '1.8',
      }}
    >
      {items.map((item, index) => (
        <li 
          key={index}
          style={{
            marginBottom: '0.75rem',
            fontWeight: theme.fontWeight.bulletText
          }}
        >
          {item}
        </li>
      ))}
    </ul>
  );
};
