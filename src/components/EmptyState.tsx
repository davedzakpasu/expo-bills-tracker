import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { createAppStyles, tokens } from "../theme/styles";

type EmptyStateProps = {
  /** Optional icon (FontAwesome6 name) */
  icon?: string;
  /** Large title (e.g. “No Bills Yet”) */
  title?: string;
  /** Supporting message */
  message?: string;
  /** Button label (e.g. “Add Bill”) */
  actionLabel?: string;
  /** Button handler */
  onActionPress?: () => void;
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "inbox",
  title = "Nothing here yet",
  message = "You can add a new item to get started.",
  actionLabel = "Add New",
  onActionPress,
}) => {
  const theme = useTheme();
  const styles = createAppStyles(theme);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: tokens.spacing.lg,
      }}
    >
      <FontAwesome6
        name={icon as any}
        size={48}
        color={theme.colors.outlineVariant}
        style={{ marginBottom: tokens.spacing.md }}
      />
      <Text
        variant="headlineMedium"
        style={[
          styles.title,
          { textAlign: "center", marginBottom: tokens.spacing.md },
        ]}
      >
        {title}
      </Text>
      <Text
        variant="bodyMedium"
        adjustsFontSizeToFit
        style={[
          styles.subtitle,
          {
            textAlign: "center",
            opacity: 0.75,
          },
        ]}
      >
        {message}
      </Text>
      {onActionPress && (
        <Button
          mode="contained"
          onPress={onActionPress}
          icon="plus"
          style={{ borderRadius: tokens.radius.md }}
        >
          {actionLabel}
        </Button>
      )}
    </View>
  );
};
