import React from 'react';
import { Theme } from '../../themes';
import { Img, staticFile } from 'remotion';
import StarIcon from '../elements/StarIcon';
import Pill from '../elements/Pill';
import { usePresentationStore } from '../../store';

interface FrontPageLayoutProps {
  text: string;
  theme: Theme;
  logo: string;
}

export const FrontPageLayout: React.FC<FrontPageLayoutProps> = ({ text, theme, logo }) => {
  const metadata = usePresentationStore((state) => state.metadata);

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
      {logo && (
        <Img
          src={staticFile('/rozgaar_info_website.png')}
          alt="Logo"
          style={{
            position: 'absolute',
            top: '100px',
            right: '100px',
            maxWidth: '280px',
            maxHeight: '280px',
            marginBottom: '3rem',
          }}
        />
      )}
      {/* show StarIcon when no logo supplied */}
      {metadata && metadata?.totalPosts && (
        <div style={{ position: 'absolute', top: '100px', left: '100px' }}>
          <StarIcon size={280} label={metadata.totalPosts} />
        </div>
      )}
      {/* Show qualification pills if available */}
      {metadata &&
        Array.isArray(metadata.qualificationExpected) &&
        metadata.qualificationExpected.length > 0 && (
          <div
            style={{ marginBottom: '2rem', marginTop: '1rem', position: 'absolute', top: '100px' }}
            >
            <Pill items={metadata.qualificationExpected} />
          </div>
        )}
      <span
        style={{
          fontWeight: 'bold',
          display: 'block',
          width: '70%',
          fontSize: theme.fontSize.heading,
          fontFamily: theme.fonts.heading,
        }}
      >
        {text}
      </span>
      {/* {metadata && (
        <div
          style={{
            marginTop: '3rem',
            fontSize: theme.fontSize.body,
            fontFamily: theme.fonts.body,
            color: theme.colors.text,
            opacity: 0.9,
          }}
        >
          {metadata.organizationName && (
            <div style={{ marginBottom: '1rem', fontSize: '1.8rem' }}>
              {metadata.organizationName}
            </div>
          )}
          {metadata.totalPosts && (
            <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>
              Total Posts: {metadata.totalPosts}
            </div>
          )}
        </div>
      )} */}
    </div>
  );
};
