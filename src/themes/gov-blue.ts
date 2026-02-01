import { Theme } from './types';

// .zalando-sans-<uniquifier> {
//   font-family: "Zalando Sans", sans-serif;
//   font-optical-sizing: auto;
//   font-weight: <weight>;
//   font-style: normal;
//   font-variation-settings:
//     "wdth" 100;
// }


export const govBlueTheme: Theme = {
  name: 'gov-blue',
  colors: {
    primary: 'blue',
    secondary: '#3B82F6',
    background: '#F0F9FF',
    text: '#1E3A8A',
    textSecondary: '#3B82F6',
    accent: '#DBEAFE',
    border: '#93C5FD',
  },
  fonts: {
    heading: 'Zalando Sans, sans-serif',
    body: 'Inter, sans-serif',
    code: 'Fira Code, monospace',
  },
  spacing: {
    slideMargin: '4rem',
    blockGap: '1.5rem',
    headingMargin: '2rem',
  },
  fontSize: {
    title: '4.5rem',
    subtitle: '2rem',
    heading: '3.5rem',
    body: '1.25rem',
    small: '1rem',
  },
};
