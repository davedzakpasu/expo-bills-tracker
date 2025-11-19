import { StyleSheet } from "react-native";
import { MD3Theme } from "react-native-paper";
import { moderateScale } from "react-native-size-matters";

/**
 * 🔹 Design tokens
 * Centralized spacing, radius, typography, and shadow values.
 * ESLint-safe, no inline styles across components.
 */
export const tokens = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 20,
    full: 999,
  },
  typography: {
    title: {
      fontSize: moderateScale(18),
      fontWeight: "700" as const,
    },
    subtitle: {
      fontSize: moderateScale(12),
      fontWeight: "400" as const,
    },
    amount: {
      fontSize: moderateScale(18),
      fontWeight: "700" as const,
    },
  },
  shadows: {
    base: {
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
  },
};

/**
 * 🔹 Theme-based styles
 * Creates dynamic color bindings while keeping structure consistent.
 */
export const createAppStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    // --- Layout ---
    screen: {
      flexGrow: 1,
      paddingBottom: tokens.spacing.xl,
      paddingHorizontal: tokens.spacing.md,
    },

    // --- Card ---
    card: {
      marginVertical: moderateScale(tokens.spacing.xs),
      borderRadius: moderateScale(tokens.radius.md),
      backgroundColor: theme.colors.background,
      padding: moderateScale(tokens.spacing.xs),
      ...tokens.shadows.base,
    },

    // --- Text ---
    title: {
      ...tokens.typography.title,
      // color: theme.colors.onSurface,
      // marginBottom: 4,
    },
    subtitle: {
      ...tokens.typography.subtitle,
      // color: theme.colors.onSurfaceVariant,
      // marginBottom: moderateScale(tokens.spacing.md),
      // opacity: 0.7,
    },

    // --- Amount / Row ---
    amountRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: tokens.spacing.sm,
    },
    amount: {
      ...tokens.typography.amount,
      color: theme.colors.primary,
    },
    dueDate: {
      fontSize: moderateScale(12),
      color: theme.colors.outline,
    },

    // --- Buttons & Inputs ---
    addButton: {
      position: "absolute",
      right: moderateScale(tokens.spacing.md),
      bottom: moderateScale(20),
      borderRadius: moderateScale(tokens.radius.full),
    },
    input: {
      backgroundColor: theme.colors.elevation.level1,
    },

    // --- Dashboard summary layout ---
    summaryWrapper: {
      marginVertical: moderateScale(tokens.spacing.sm),
      paddingHorizontal: moderateScale(tokens.spacing.md),
    },
    summaryContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      rowGap: moderateScale(tokens.spacing.md),
      columnGap: moderateScale(tokens.spacing.md),
      justifyContent: "flex-start",
    },
    summaryCard: {
      minWidth: 160,
      flex: 1,
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 12,
      backgroundColor: theme.colors.background,
      shadowColor: theme.dark ? "#000" : "#333",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: theme.dark ? 0.25 : 0.15,
      shadowRadius: 6,
      elevation: 5,
    },
    summaryCardHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    summaryTitle: {
      fontSize: moderateScale(10),
      flexShrink: 1,
      flexWrap: "wrap",
      fontWeight: "600",
      color: theme.colors.onSurfaceVariant,
    },
    summaryValue: {
      fontSize: moderateScale(16),
      fontWeight: "700",
    },
    deleteConfirm: {
      backgroundColor: theme.colors.surface,
      alignSelf: "center",
    },
    stickyHeader: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: tokens.spacing.md * 1.3,
      paddingVertical: tokens.spacing.sm,
      paddingTop: tokens.spacing.sm,
      paddingBottom: tokens.spacing.xs,
      backgroundColor: theme.colors.background,
      elevation: 6, // Android shadow
      shadowColor: theme.dark ? "#000" : "#333", // iOS shadow
      shadowOpacity: 0.15,
      shadowOffset: { width: 0, height: 3 },
      shadowRadius: 4,
      zIndex: 10,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: tokens.spacing.md * 1.3,
      paddingVertical: moderateScale(tokens.spacing.md * 0.3),
      top: 0,
    },
    seeAllButton: {
      alignSelf: "center",
      marginTop: 4,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.4)",
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    modalCard: {
      width: "100%",
      borderRadius: 16,
      backgroundColor: theme.colors.elevation.level3,
      padding: 20,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 6,
    },
    // In styles.ts (merge with existing)
    entryCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.md,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
      marginBottom: tokens.spacing.sm,
    },

    rowBetween: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    actionsRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    entryTitle: {
      fontWeight: "600",
    },

    entryAmount: {
      fontWeight: "500",
    },

    badge: {
      backgroundColor: theme.colors.primaryContainer,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: 2,
    },

    badgeText: {
      fontSize: 12,
      color: theme.colors.onPrimaryContainer,
    },

    progressContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: tokens.spacing.sm,
    },

    progressBar: {
      flex: 1,
      height: 6,
      borderRadius: tokens.radius.full,
      marginRight: tokens.spacing.sm,
    },

    progressText: {
      width: 40,
      textAlign: "right",
      opacity: 0.7,
    },

    remainingText: {
      opacity: 0.7,
    },

    markPaidButton: {
      borderRadius: tokens.radius.full,
      height: 36,
    },
    cardActionsArea: {
      borderTopWidth: 1,
      borderTopColor: "rgba(0,0,0,0.05)",
      padding: 10,
    },
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: tokens.spacing.md,
      paddingBottom: tokens.spacing.xl,
    },
    markPaidBtn: { flex: 1, borderRadius: 999, minWidth: 120 },
  });

/**
 * 🔹 Palette used by ThemeContext
 * (unchanged from your previous version)
 */
export const palette = {
  light: {
    primary: "#1976D2",
    secondary: "#03DAC6",
    background: "#FAFAFA",
    surface: "#FFFFFF",
    text: "#000000",
    onSurface: "#1C1B1F",
    onSurfaceVariant: "#49454F",
    outline: "#79747E",
    elevation: {
      level1: "#FFFFFF",
      level2: "#F1F1F1",
    },
  },
  dark: {
    primary: "#90CAF9",
    secondary: "#03DAC6",
    background: "#121212",
    surface: "#1E1E1E",
    text: "#FFFFFF",
    onSurface: "#E6E1E5",
    onSurfaceVariant: "#CAC4D0",
    outline: "#938F99",
    elevation: {
      level1: "#1E1E1E",
      level2: "#2C2C2C",
    },
  },
};
