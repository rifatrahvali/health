import { StyleSheet } from 'react-native';
import { Colors } from './colors';
import { Spacing, Layout } from './spacing';
import { Typography } from './typography';
import { Borders } from './borders';
import { Shadows } from './shadows';

export const CommonStyles = StyleSheet.create({
  // Containers
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },

  safeArea: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },

  scrollContainer: {
    flexGrow: 1,
  },

  contentContainer: {
    flex: 1,
    paddingHorizontal: Layout.screenPadding,
  },

  // Headers
  header: {
    paddingHorizontal: Layout.screenPadding,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
  },

  headerWithProgress: {
    paddingHorizontal: Layout.screenPadding,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
  },

  // Progress Bar
  progressBar: {
    height: 6,
    backgroundColor: Colors.neutral[200],
    borderRadius: 3,
  },

  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary[600],
    borderRadius: 3,
  },

  // Navigation
  backButton: {
    marginBottom: Spacing.md,
  },

  backButtonText: {
    fontSize: Typography.fontSize.base,
    color: Colors.primary[600],
    fontWeight: Typography.fontWeight.medium,
  },

  // Typography
  screenTitle: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },

  screenSubtitle: {
    fontSize: Typography.fontSize.lg,
    color: Colors.text.secondary,
    marginBottom: Spacing.xl,
    lineHeight: Typography.fontSize.lg * Typography.lineHeight.normal,
  },

  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },

  label: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },

  hint: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    marginBottom: Spacing.sm,
  },

  // Cards
  card: {
    backgroundColor: Colors.background.card,
    borderRadius: Borders.radius.lg,
    padding: Layout.cardPadding,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },

  cardSelected: {
    borderWidth: Borders.width.base,
    borderColor: Colors.primary[600],
    backgroundColor: Colors.primary[50],
  },

  // Buttons
  primaryButton: {
    backgroundColor: Colors.primary[600],
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: Borders.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    height: Layout.buttonHeight,
    ...Shadows.primary,
  },

  primaryButtonText: {
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },

  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: Borders.width.base,
    borderColor: Colors.primary[600],
    paddingVertical: Spacing.md - Borders.width.base,
    paddingHorizontal: Spacing.xl,
    borderRadius: Borders.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    height: Layout.buttonHeight,
  },

  secondaryButtonText: {
    color: Colors.primary[600],
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
  },

  ghostButton: {
    backgroundColor: 'transparent',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ghostButtonText: {
    color: Colors.text.tertiary,
    fontSize: Typography.fontSize.base,
    textDecorationLine: 'underline',
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  // Inputs
  input: {
    backgroundColor: Colors.background.card,
    borderWidth: Borders.width.base,
    borderColor: Colors.border.light,
    borderRadius: Borders.radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    height: Layout.inputHeight,
  },

  inputFocused: {
    borderColor: Colors.border.focus,
  },

  inputError: {
    borderColor: Colors.border.error,
  },

  // Footer
  footer: {
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background.card,
    borderTopWidth: Borders.width.thin,
    borderTopColor: Colors.border.light,
    ...Shadows.sm,
  },

  // Sections
  section: {
    marginBottom: Spacing.xl,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Spacing helpers
  marginTopXs: { marginTop: Spacing.xs },
  marginTopSm: { marginTop: Spacing.sm },
  marginTopMd: { marginTop: Spacing.md },
  marginTopLg: { marginTop: Spacing.lg },
  marginTopXl: { marginTop: Spacing.xl },

  marginBottomXs: { marginBottom: Spacing.xs },
  marginBottomSm: { marginBottom: Spacing.sm },
  marginBottomMd: { marginBottom: Spacing.md },
  marginBottomLg: { marginBottom: Spacing.lg },
  marginBottomXl: { marginBottom: Spacing.xl },

  paddingXs: { padding: Spacing.xs },
  paddingSm: { padding: Spacing.sm },
  paddingMd: { padding: Spacing.md },
  paddingLg: { padding: Spacing.lg },
  paddingXl: { padding: Spacing.xl },

  // Flex helpers
  flex1: { flex: 1 },
  flex2: { flex: 2 },
  flex3: { flex: 3 },
  flexGrow: { flexGrow: 1 },
  flexShrink: { flexShrink: 1 },
});

export default CommonStyles;