import { Theme } from './types';
import { defaultTheme } from './default';
import { govBlueTheme } from './gov-blue';

export const themes: Record<string, Theme> = {
  'default': defaultTheme,
  'gov-blue': govBlueTheme,
};

export function getTheme(themeName: string | null | undefined): Theme {
  if (!themeName) return defaultTheme;
  return themes[themeName] || defaultTheme;
}

export * from './types';
