// components/SectionHeader.tsx
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { metrics } from "../theme/styles";

type Props = {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export const SectionHeader: React.FC<Props> = ({
  title,
  actionLabel,
  onActionPress,
}) => {
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: metrics.spacing * 0.5,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          color: theme.colors.onSurface,
        }}
      >
        {title}
      </Text>

      {actionLabel && onActionPress && (
        <TouchableOpacity onPress={onActionPress}>
          <Text style={{ color: theme.colors.primary, fontWeight: "500" }}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
