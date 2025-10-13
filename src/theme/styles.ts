import { StyleSheet } from "react-native";
import { MD3Theme } from "react-native-paper";

export const metrics = {
  spacing: 12,
  radius: 12,
};

// Custom palette for light/dark mode
export const palette = {
  light: {
    background: "#FFFFFF",
    surface: "#F5F5F5",
    text: "#222222",
    primary: "#007AFF",
    accent: "#34C759",
    border: "#E0E0E0",
    error: "#FF3B30",
  },
  dark: {
    background: "#121212",
    surface: "#1E1E1E",
    text: "#FFFFFF",
    primary: "#0A84FF",
    accent: "#30D158",
    border: "#333333",
    error: "#FF453A",
  },
};

export const createAppStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: metrics.spacing * 1.3,
      paddingTop: metrics.spacing * 0.7,
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    card: {
      marginVertical: metrics.spacing * 0.7,
      borderRadius: metrics.radius,
      backgroundColor: theme.colors.elevation.level2,
      padding: metrics.spacing * 1.3,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.onSurface,
    },
    greeting: {
      fontSize: 20,
      fontWeight: "600",
      color: theme.colors.onSurfaceVariant,
    },
    title: {
      fontSize: 20,
      fontWeight: "600",
      color: theme.colors.onSurface,
      marginBottom: metrics.spacing,
    },
    subtitle: {
      fontSize: 13,
      color: theme.colors.onSurfaceVariant,
      marginBottom: 6,
    },
    textPrimary: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.onSurface,
    },
    textSecondary: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
    },
    amountRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 6,
    },
    amount: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.colors.primary,
    },
    dueDate: {
      fontSize: 14,
      fontWeight: "500",
      color: theme.colors.outline,
    },
    addButton: {
      position: "absolute",
      right: metrics.spacing * 1.3,
      bottom: metrics.spacing * 1.7,
      borderRadius: 50,
    },
    input: {
      backgroundColor: theme.colors.elevation.level1,
    },
    summaryContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      rowGap: metrics.spacing,
      columnGap: metrics.spacing,
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

    summaryIcon: {
      marginRight: 8,
    },

    summaryTitle: {
      fontSize: 14,
      flexShrink: 1,
      flexWrap: "wrap",
      fontWeight: "600",
    },

    summaryValue: {
      fontSize: 26,
      fontWeight: "700",
    },
    summaryWrapper: {
      marginVertical: 8,
      paddingHorizontal: metrics.spacing,
    },

    stickyHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: metrics.spacing * 1.3,
      paddingVertical: metrics.spacing,
      backgroundColor: theme.colors.background,
      elevation: 6, // Android shadow
      shadowColor: theme.dark ? "#000" : "#333", // iOS shadow
      shadowOpacity: 0.15,
      shadowOffset: { width: 0, height: 3 },
      shadowRadius: 4,
      zIndex: 10,
    },
    listContainer: {
      backgroundColor: theme.colors.background,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: metrics.spacing * 1.3,
      paddingVertical: metrics.spacing * 0.8,
      top: 0,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.primary,
    },
    sectionContainer: {
      paddingHorizontal: metrics.spacing,
      marginBottom: metrics.spacing * 2,
    },
    billCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: metrics.radius,
      padding: metrics.spacing * 1.3,
      marginRight: metrics.spacing,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      flexGrow: 1,
      minWidth: 140,
      maxWidth: 260,
    },
    cardAmount: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.primary,
    },

    cardSub: {
      fontSize: 13,
      color: theme.colors.onSurfaceVariant,
    },
    seeAll: {
      color: theme.colors.primary,
      fontWeight: "600",
      fontSize: 14,
    },
    stylesColumn: {
      flexDirection: "column",
      justifyContent: "space-between",
      marginTop: metrics.spacing * 0.5,
    },
    deleteConfirm: {
      backgroundColor: theme.colors.surface,
      alignSelf: "center",
    },
  });
