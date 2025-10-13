import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";

type EmptyStateProps = {
  title?: string;
  message?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Nothing here yet",
  message = "You can add a new item to get started.",
  actionLabel = "Add New",
  onActionPress,
}) => {
  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>
        {title}
      </Text>
      <Text variant="bodyMedium" style={styles.message}>
        {message}
      </Text>
      {onActionPress && (
        <Button
          mode="contained"
          onPress={onActionPress}
          style={styles.button}
          icon="plus"
        >
          {actionLabel}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    textAlign: "center",
    marginBottom: 16,
    opacity: 0.7,
  },
  button: {
    marginTop: 8,
  },
});
