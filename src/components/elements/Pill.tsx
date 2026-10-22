// Renamed from PillUx.tsx to Pill.tsx
import React from 'react';
import { Img, staticFile } from 'remotion';

// You can change this color to customize the pill appearance
export const PILL_COLOR = '#aa0e0ed8';

interface PillProps {
  items: string[];
  iconSrc?: string; // Optional icon source
  iconAlt?: string;
  className?: string;
  style?: React.CSSProperties;
  pillStyle?: React.CSSProperties;
}

const Pill: React.FC<PillProps> = ({
  items,
  iconSrc,
  iconAlt = 'icon',
  className,
  style,
  pillStyle,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '24px',
        // maxWidth: 400, // adjust as needed TO WRAP In MULTIPLE LINES
      }}
    >
      {items.map((item, idx) => (
        <span
          key={idx}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.25em 0.75em',
            borderRadius: '999px',
            border: `2px solid ${PILL_COLOR}`,
            fontSize: '2rem',
            background: 'off-white',
            color: `${PILL_COLOR}`,
            fontWeight: '600',
            minHeight: '2em',
            fontFamily: 'Zalando Sans, sans-serif',
            ...pillStyle,
          }}
        >
          {iconSrc && (
            <Img
              src={staticFile(iconSrc)}
              alt={iconAlt}
              style={{ width: 20, height: 20, marginRight: 6 }}
            />
          )}
          {item}
        </span>
      ))}
    </div>
  );
};

export default Pill;
