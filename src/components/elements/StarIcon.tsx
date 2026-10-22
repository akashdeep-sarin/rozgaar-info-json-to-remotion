import React from 'react';
import { Img, staticFile } from 'remotion';

interface StarIconProps {
  size?: number | string;
  label?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const StarIcon: React.FC<StarIconProps> = ({ size = 80, label, children, style, className }) => {
  const sizeStyle: React.CSSProperties = typeof size === 'number' ? { width: size, height: size } : { width: size, height: size };

  return (
    <div className={className} style={{ position: 'relative', display: 'inline-block', overflow: 'hidden', ...sizeStyle, ...style }}>
      <Img
        src={staticFile('/explosion.png')}
        alt="explosion"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />

      <div
        style={{
          position: 'relative',
          fontFamily: "Zalando Sans, sans-serif",
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          color: '#fff',
          fontWeight: 700,
          textShadow: '0 1px 3px rgba(0,0,0,0.6)',
          transform: 'rotate(-30deg)',
          fontSize: '3rem',
        }}
      >
        <p>{children ?? label}</p>
        <p>{"Posts"}</p>
      </div>
    </div>
  );
};

export default StarIcon;
