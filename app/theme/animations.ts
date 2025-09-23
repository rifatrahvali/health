import { Easing } from 'react-native';

export const Animations = {
  // Animation Durations
  duration: {
    instant: 0,
    fast: 200,
    normal: 300,
    slow: 500,
    verySlow: 800,
    extraSlow: 1000,
  },

  // Easing Functions
  easing: {
    // Standard easing
    standard: Easing.bezier(0.4, 0.0, 0.2, 1),
    // Decelerated easing
    decelerate: Easing.bezier(0.0, 0.0, 0.2, 1),
    // Accelerated easing
    accelerate: Easing.bezier(0.4, 0.0, 1, 1),
    // Sharp easing
    sharp: Easing.bezier(0.4, 0.0, 0.6, 1),
    // Spring
    spring: Easing.bezier(0.175, 0.885, 0.32, 1.275),
  },

  // Spring Configs
  spring: {
    gentle: {
      friction: 7,
      tension: 100,
    },
    wobbly: {
      friction: 3,
      tension: 180,
    },
    stiff: {
      friction: 20,
      tension: 200,
    },
    slow: {
      friction: 14,
      tension: 40,
    },
  },
} as const;