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
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
    code: 'Fira Code, monospace',
  },
  spacing: {
    slideMargin: '4rem',
    blockGap: '1.5rem',
    headingMargin: '2rem',
  },
  fontSize: {
    title: '3.5rem',
    subtitle: '2rem',
    heading: '2.5rem',
    body: '1.25rem',
    small: '1rem',
  },
};
