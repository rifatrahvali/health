// Central theme export file
export { Colors } from './colors';
export { Spacing, Layout } from './spacing';
export { Typography } from './typography';
export { Borders } from './borders';
export { Shadows } from './shadows';
export { Animations } from './animations';

// Re-export everything as a single theme object
import { Colors } from './colors';
import { Spacing, Layout } from './spacing';
import { Typography } from './typography';
import { Borders } from './borders';
import { Shadows } from './shadows';
import { Animations } from './animations';

export const Theme = {
  colors: Colors,
  spacing: Spacing,
  layout: Layout,
  typography: Typography,
  borders: Borders,
  shadows: Shadows,
  animations: Animations,
} as const;

export default Theme;