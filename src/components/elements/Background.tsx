
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Theme } from '../../themes';

interface BackgroundProps {
	theme?: Theme;
	color?: string;
	wave?: boolean;
	waveColor?: string;
	style?: React.CSSProperties;
	children?: React.ReactNode;
}

const Background: React.FC<BackgroundProps> = ({ theme, color, style, children }) => {
	const backgroundColor = color ?? theme?.colors?.background ?? '#FFFFFF';
	const textColor = theme?.colors?.text ?? '#000000';

	return (
		<AbsoluteFill style={{ background: backgroundColor, color: textColor, position: 'absolute', overflow: 'hidden', ...style }}>
			{/* subtle wave at bottom */}
			<svg
				style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '18%', pointerEvents: 'none' }}
				viewBox="0 0 1440 320"
				preserveAspectRatio="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d={`M0,96L48,133.3C96,171,192,245,288,245.3C384,245,480,171,576,133.3C672,96,768,96,864,101.3C960,107,1056,117,1152,112C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z`}
					fill={theme?.colors?.primary ?? '#3B82F6'}
					opacity={0.06}
				/>
			</svg>

			<div style={{ position: 'relative', width: '100%', height: '100%' }}>{children}</div>
		</AbsoluteFill>
	);
};

export default Background;

