# CLAUDE.md - GutWell Development Guidelines & Rules

## 🎯 Project Overview
GutWell is a minimal, aesthetic gut health tracking app with a focus on clean design, smooth interactions, and user-centric experience. The app should feel calm, trustworthy, and premium while maintaining simplicity.

## 🎨 Design Philosophy

### Core Principles
1. **Minimalism First**: Every element should have a purpose. No decorative clutter.
2. **Breathing Space**: Generous whitespace, clean typography, subtle shadows.
3. **Soft & Organic**: Rounded corners, gentle animations, natural colors.
4. **Data Clarity**: Complex health data presented simply and beautifully.
5. **Trust Through Design**: Medical accuracy with approachable aesthetics.

### Visual Language
- **Clean & Clinical**: Inspired by modern health apps like Flo, Headspace, and Apple Health
- **Soft Modernism**: Gentle gradients, subtle depth, micro-interactions
- **Human Touch**: Warm colors balanced with professional whites and grays

## 🎨 Design System

### Color Palette
```typescript
const colors = {
  // Primary - Soft Green (Trust, Health, Nature)
  primary: {
    50: '#F1F8F4',   // Lightest background
    100: '#E8F5E9',  // Light background
    200: '#C8E6C9',  // Hover states
    300: '#A5D6A7',  // Active elements
    400: '#81C784',  // Secondary buttons
    500: '#66BB6A',  // Primary actions
    600: '#4CAF50',  // Main brand color
    700: '#43A047',  // Pressed states
    800: '#388E3C',  // Dark accents
    900: '#2E7D32',  // Headers
  },

  // Neutrals - Soft Grays
  neutral: {
    50: '#FAFAFA',   // App background
    100: '#F5F5F5',  // Card background
    200: '#EEEEEE',  // Dividers
    300: '#E0E0E0',  // Borders
    400: '#BDBDBD',  // Disabled text
    500: '#9E9E9E',  // Secondary text
    600: '#757575',  // Body text
    700: '#616161',  // Primary text
    800: '#424242',  // Headings
    900: '#212121',  // Maximum contrast
  },

  // Semantic Colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',

  // Gut Health Specific
  symptom: {
    mild: '#FFF9C4',     // Light yellow
    moderate: '#FFE082',  // Medium yellow
    severe: '#FFAB91',    // Light orange
    critical: '#EF9A9A',  // Light red
  }
}
```

### Typography
```typescript
const typography = {
  // iOS: SF Pro Display/Text, Android: Roboto
  fontFamily: Platform.select({
    ios: 'System',
    android: 'Roboto',
  }),

  sizes: {
    xs: 12,    // Captions, labels
    sm: 14,    // Secondary text
    base: 16,  // Body text
    lg: 18,    // Subheadings
    xl: 20,    // Section headers
    '2xl': 24, // Page titles
    '3xl': 28, // Main headers
    '4xl': 32, // Hero text
  },

  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  }
}
```

### Spacing System
```typescript
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
}
```

### Component Styling Rules (StyleSheet)

#### Buttons
```typescript
const styles = StyleSheet.create({
  // Primary Button
  primaryButton: {
    backgroundColor: colors.primary[600],
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    shadowColor: colors.primary[600],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },

  // Secondary Button
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary[600],
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
  },

  // Ghost Button
  ghostButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 16,
  }
});
```

#### Cards
```typescript
const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  }
});
```

**Note**: Always use StyleSheet.create() for styles. Never use inline styles or external styling libraries like NativeWind or Styled Components.

### Animation Guidelines
```typescript
// Standard durations
const animations = {
  fast: 200,      // Micro-interactions
  normal: 300,    // Standard transitions
  slow: 500,      // Page transitions
  verySlow: 800,  // Complex animations
}

// Always use native driver when possible
Animated.timing(value, {
  duration: animations.normal,
  useNativeDriver: true,
  easing: Easing.bezier(0.4, 0, 0.2, 1), // Material Design curve
})
```

## 📱 Screen Design Patterns

### Layout Structure
1. **Safe Areas**: Always respect device safe areas
2. **Consistent Padding**: 20px horizontal padding as standard
3. **Section Spacing**: 32px between major sections
4. **Card Margins**: 12px between cards

### Navigation Patterns
- **Tab Bar**: Bottom navigation with 5 max items
- **Stack Navigator**: Slide transitions for hierarchy
- **Modal Sheets**: Bottom sheets for quick actions
- **Gestures**: Swipe to go back, pull to refresh

### Content Hierarchy
1. **Page Title**: 28-32px, bold, primary color
2. **Section Headers**: 20-24px, semibold, dark gray
3. **Body Text**: 16px, regular, medium gray
4. **Captions**: 12-14px, regular, light gray

## 🚀 Development Rules

### Code Organization
```
src/
├── features/          # Feature-based modules
│   ├── onboarding/
│   ├── dashboard/
│   ├── tracking/
│   └── insights/
├── shared/           # Shared components
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── constants/
├── services/         # Firebase services
│   ├── auth/        # Firebase Auth
│   ├── firestore/   # Firestore operations
│   ├── storage/     # Firebase Storage
│   └── analytics/   # Firebase Analytics
├── contexts/         # React Context providers
│   ├── auth-context.tsx
│   ├── user-context.tsx
│   └── app-context.tsx
├── navigation/       # Navigation configuration
└── assets/          # Images, fonts, etc.
```

### File Naming Conventions
1. **All Files**: kebab-case (`button.tsx`, `auth-context.tsx`, `user-service.ts`)
2. **Component Files**: kebab-case (`health-score-card.tsx`, `symptom-tracker.tsx`)
3. **Folders**: kebab-case (`gut-health/`, `user-profile/`)
4. **Test Files**: kebab-case with `.test.ts` or `.spec.ts` (`auth-service.test.ts`)
5. **Constants**: kebab-case (`app-constants.ts`, `color-palette.ts`)

Example structure:
```
src/
  features/
    onboarding/
      screens/
        welcome-screen.tsx         # Contains WelcomeScreen component
        goal-selection-screen.tsx  # Contains GoalSelectionScreen component
      models/
        onboarding-models.ts       # Types and interfaces
      hooks/
        use-onboarding.ts         # Custom hook
```

### Component Rules

1. **Functional Components Only**: Use React hooks, no class components
2. **TypeScript Required**: Full type safety, no `any` types
3. **Props Interface**: Always define prop interfaces
4. **Default Props**: Use default parameters
5. **Memo When Needed**: Use React.memo for expensive renders

### Example Component Structure
```typescript
// File: components/health-score-card.tsx
import React, { useState, useEffect, memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HealthScoreCardProps {
  title: string;
  onPress?: () => void;
}

const HealthScoreCard: React.FC<HealthScoreCardProps> = ({
  title,
  onPress
}) => {
  // Hooks first
  const [state, setState] = useState(false);

  // Effects second
  useEffect(() => {
    // Effect logic
  }, []);

  // Handlers third
  const handlePress = () => {
    onPress?.();
  };

  // Render last
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Style rules
  },
  title: {
    // Style rules
  }
});

export default memo(HealthScoreCard);
```

### State Management Rules
1. **Local State First**: Use useState for component state
2. **Context API for Global State**: Use Context API for app-wide state
3. **Custom Hooks**: Create custom hooks for reusable logic
4. **useReducer for Complex State**: Use useReducer for complex state logic
5. **No External Libraries**: Use only React's native state management

### Backend & Database Rules (Firebase)
1. **Firebase Services**:
   - **Authentication**: Firebase Auth for user management
   - **Database**: Firestore for real-time data
   - **Storage**: Firebase Storage for images/files
   - **Analytics**: Firebase Analytics for tracking
   - **Crashlytics**: For crash reporting
   - **Cloud Functions**: For server-side logic

2. **Firestore Structure**:
```typescript
// Collections structure
users/
  {userId}/
    profile: { ... }
    onboarding: { ... }
    settings: { ... }

symptoms/
  {userId}/
    entries/
      {entryId}: { ... }

meals/
  {userId}/
    entries/
      {entryId}: { ... }

insights/
  {userId}/
    daily/
    weekly/
    monthly/
```

3. **Security Rules**:
   - User can only read/write their own data
   - Validate data types and required fields
   - Rate limiting for writes

4. **API & Data Rules**:
   - **Async/Await**: Always use async/await over promises
   - **Error Boundaries**: Wrap features in error boundaries
   - **Loading States**: Always show loading indicators
   - **Offline First**: Firestore offline persistence
   - **Optimistic Updates**: Update UI before Firebase confirmation

### Performance Guidelines
1. **Lazy Loading**: Use React.lazy for screen components
2. **Image Optimization**: Use appropriate image sizes and formats
3. **List Optimization**: Use FlatList with proper keyExtractor
4. **Memoization**: Use useMemo and useCallback wisely
5. **Debouncing**: Debounce user inputs (search, etc.)

## 🧪 Testing Requirements

### Test Coverage Targets
- Unit Tests: 80% coverage
- Integration Tests: Core user flows
- E2E Tests: Critical paths (onboarding, tracking)

### Testing Commands
```bash
npm test              # Run all tests
npm test:unit         # Unit tests only
npm test:integration  # Integration tests
npm test:e2e         # End-to-end tests
npm test:coverage    # Coverage report
```

## 📝 Code Quality

### Linting & Formatting
```bash
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix issues
npm run format       # Run Prettier
npm run typecheck    # TypeScript check
```

### Pre-commit Checks
1. Linting must pass
2. TypeScript must compile
3. Tests must pass
4. No console.logs in production

### Code Review Checklist
- [ ] Follows design system
- [ ] TypeScript types complete
- [ ] Error handling implemented
- [ ] Loading states present
- [ ] Accessibility considered
- [ ] Performance optimized
- [ ] Tests written
- [ ] Documentation updated

## 🌍 Localization Rules

### Text Management
1. **No Hardcoded Text**: All text in language files
2. **Key Naming**: Use dot notation (e.g., `onboarding.welcome.title`)
3. **Placeholders**: Use interpolation for dynamic values
4. **Date/Time**: Use locale-aware formatting
5. **Numbers**: Format according to locale

### Language File Structure
```typescript
// locales/tr.json
{
  "onboarding": {
    "welcome": {
      "title": "Hoş Geldiniz",
      "subtitle": "Bağırsak sağlığınız için buradayız"
    }
  }
}
```

## 🔒 Security & Privacy

### Data Handling
1. **Encryption**: Encrypt sensitive health data
2. **No PII in Logs**: Never log personal information
3. **Secure Storage**: Use encrypted storage for tokens
4. **API Security**: Always use HTTPS
5. **Input Validation**: Validate all user inputs

### Compliance
- HIPAA compliant for US
- GDPR compliant for EU
- KVKK compliant for Turkey

## 📱 Platform-Specific Rules

### iOS Specific
- Use native iOS date/time pickers
- Respect iOS design guidelines
- Support iOS 14+
- Handle notch and Dynamic Island

### Android Specific
- Material Design 3 principles
- Support Android 8+ (API 26)
- Handle back button properly
- Respect system dark mode

## 🚢 Deployment Checklist

### Pre-deployment
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] Performance profiling done
- [ ] Accessibility audit complete
- [ ] Security scan passed
- [ ] Translations complete
- [ ] Analytics configured
- [ ] Error tracking setup

### Build Commands
```bash
# Development
npm run ios:dev
npm run android:dev

# Production
npm run ios:release
npm run android:release

# Bundle analysis
npm run bundle:analyze
```

## 📊 Analytics Events

### Required Tracking
1. **Onboarding**: Step completion, drop-off points
2. **Engagement**: Daily active users, session duration
3. **Features**: Feature usage, symptom logging frequency
4. **Conversion**: Trial starts, subscription conversions
5. **Health**: Symptom improvements, goal achievements

## 🎯 Success Metrics

### Key Performance Indicators
- App launch time: < 2 seconds
- Screen transition: < 300ms
- Crash rate: < 0.5%
- ANR rate: < 0.1%
- User rating: > 4.5 stars
- Retention D7: > 40%
- Retention D30: > 25%

## 💡 Best Practices

### Do's
- ✅ Keep components small and focused
- ✅ Use semantic naming
- ✅ Write self-documenting code
- ✅ Handle edge cases
- ✅ Provide feedback for all actions
- ✅ Test on real devices
- ✅ Profile performance regularly
- ✅ Use StyleSheet.create() for all styles
- ✅ Use Context API for global state
- ✅ Use Firebase for all backend services

### Don'ts
- ❌ No inline styles (always use StyleSheet)
- ❌ No external CSS libraries (no NativeWind, Styled Components)
- ❌ No external state management (no Redux, Zustand, MobX)
- ❌ No magic numbers (use constants)
- ❌ No commented-out code
- ❌ No unnecessary re-renders
- ❌ No blocking operations on main thread
- ❌ No assumptions about screen size
- ❌ No hardcoded colors (use theme)
- ❌ No backend other than Firebase

## 📂 Project Structure & Implementation

### Current Implementation Status

#### Completed Components
1. **Onboarding Flow**
   - `app/features/onboarding/screens/welcome-screen.tsx` - Language selection, app intro
   - `app/features/onboarding/screens/permissions-screen.tsx` - Notifications & health app permissions
   - `app/features/onboarding/screens/goal-selection-screen.tsx` - User goals with importance rating
   - `app/features/onboarding/models/onboarding-types.ts` - TypeScript interfaces
   - `app/features/onboarding/constants/onboarding-data.ts` - Static data for onboarding

2. **Core Infrastructure**
   - `app/constants/colors.ts` - Centralized color system, spacing, typography
   - `src/contexts/auth-context.tsx` - Firebase authentication context

#### Folder Structure
```
app/
├── features/
│   └── onboarding/
│       ├── screens/
│       │   ├── welcome-screen.tsx
│       │   ├── permissions-screen.tsx
│       │   └── goal-selection-screen.tsx
│       ├── models/
│       │   └── onboarding-types.ts
│       └── constants/
│           └── onboarding-data.ts
├── constants/
│   └── colors.ts
src/
└── contexts/
    └── auth-context.tsx
```

### Implementation Guidelines

#### Screen Components Pattern
Each screen must follow this structure:
```typescript
interface ScreenNameProps {
  language: 'tr' | 'en';
  onContinue: (data: any) => void;
  onBack: () => void;
}

const ScreenName: React.FC<ScreenNameProps> = ({ language, onContinue, onBack }) => {
  // Bilingual content object
  const content = {
    tr: { /* Turkish strings */ },
    en: { /* English strings */ }
  };

  // Use centralized theme
  // Use StyleSheet.create() for styles
  // Include progress indicator
  // Handle navigation
}
```

#### Progress Tracking
All onboarding screens include:
- Visual progress bar (percentage based)
- Back navigation
- Step counter
- Consistent header layout

#### Localization Pattern
- All text stored in component-level content objects
- Language prop passed from parent
- Dynamic switching without reload
- RTL support ready for future Arabic addition

## 🔄 Update Guidelines

This document should be updated when:
1. Design system changes
2. New patterns are established
3. Technology stack updates
4. Performance targets change
5. Compliance requirements update
6. New screens or features are implemented

---

*Last Updated: 2024*
*Version: 1.1*
*Maintained by: Development Team*

Remember: **Simplicity is the ultimate sophistication**. When in doubt, choose the simpler solution.