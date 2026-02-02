import { Theme } from './types';

export const defaultTheme: Theme = {
  name: 'default',
  colors: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    background: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    accent: '#10B981',
    border: '#E5E7EB',
  },
  fonts: {
    heading: 'Zalando Sans, sans-serif',
    body: 'Inter, sans-serif',
    code: 'Fira Code, monospace',
  },
  spacing: {
    slideMargin: '6rem 6rem',
    blockGap: '1rem',
    headingMargin: '2rem',
  },
  fontSize: {
    title: '5rem',
    subtitle: '2rem',
    heading: '3.5rem',
    body: '2.5rem',
    small: '1rem',
  },
  fontWeight: {
    bulletText: 500
  },
};
