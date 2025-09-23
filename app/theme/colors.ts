export const Colors = {
  // Primary Palette - Soft Green (Trust, Health, Nature)
  primary: {
    50: '#F1F8F4',
    100: '#E8F5E9',
    200: '#C8E6C9',
    300: '#A5D6A7',
    400: '#81C784',
    500: '#66BB6A',
    600: '#4CAF50',
    700: '#43A047',
    800: '#388E3C',
    900: '#2E7D32',
  },

  // Neutral Palette - Soft Grays
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
    white: '#FFFFFF',
    black: '#000000',
  },

  // Semantic Colors
  semantic: {
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },

  // Symptom Severity Colors
  symptom: {
    none: '#F5F5F5',
    mild: '#FFF9C4',
    moderate: '#FFE082',
    severe: '#FFAB91',
    critical: '#EF9A9A',
  },

  // Background Colors
  background: {
    primary: '#FAFAFA',
    secondary: '#F5F5F5',
    tertiary: '#FFFFFF',
    card: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  // Text Colors
  text: {
    primary: '#212121',
    secondary: '#616161',
    tertiary: '#9E9E9E',
    disabled: '#BDBDBD',
    inverse: '#FFFFFF',
    link: '#2196F3',
    success: '#388E3C',
    error: '#D32F2F',
  },

  // Border Colors
  border: {
    light: '#E0E0E0',
    medium: '#BDBDBD',
    dark: '#9E9E9E',
    focus: '#4CAF50',
    error: '#F44336',
  },

  // Chart Colors
  chart: {
    primary: '#4CAF50',
    secondary: '#81C784',
    tertiary: '#A5D6A7',
    quaternary: '#C8E6C9',
  },
} as const;