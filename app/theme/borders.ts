export const Borders = {
  // Border Radius
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    full: 999,
    round: '50%' as const,
  },

  // Border Width
  width: {
    none: 0,
    thin: 1,
    base: 2,
    thick: 3,
    bold: 4,
  },
} as const;