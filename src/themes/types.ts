export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    textSecondary: string;
    accent: string;
    border: string;
  };
  fonts: {
    heading: string;
    body: string;
    code: string;
  };
  spacing: {
    slideMargin: string;
    blockGap: string;
    headingMargin: string;
  };
  fontSize: {
    title: string;
    subtitle: string;
    heading: string;
    body: string;
    small: string;
  };
  fontWeight: {
    bulletText: number;
  }
}
