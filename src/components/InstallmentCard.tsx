import React from "react";
import { useColorScheme } from "react-native";
import { Card, ProgressBar, Text, useTheme } from "react-native-paper";
import { useThemeContext } from "../context/ThemeContext";
import { createAppStyles, metrics, palette } from "../theme/styles";

export type Installment = {
  id: string;
  title: string;
  amount: number;
  paid: number;
  endDate?: string;
};

type InstallmentCardProps = {
  item: Installment;
};

export const InstallmentCard: React.FC<InstallmentCardProps> = ({ item }) => {
  const theme = useTheme();
  const { mode } = useThemeContext();
  const colorScheme = useColorScheme();
  const effectiveMode: "light" | "dark" =
    mode === "system" ? (colorScheme === "dark" ? "dark" : "light") : mode;

  const styles = createAppStyles(theme);

  const progress = item.amount ? item.paid / item.amount : 0;
  const remaining = Math.max(item.amount - item.paid, 0);

  return (
    <Card
      style={{
        marginBottom: metrics.spacing,
        backgroundColor: palette[effectiveMode].surface,
      }}
      mode="elevated"
    >
      <Card.Content>
        <Text style={{ ...styles.title, color: palette[effectiveMode].text }}>
          {item.title}
        </Text>

        <Text
          style={{ ...styles.subtitle, color: palette[effectiveMode].text }}
        >
          Paid: {formatCurrency(item.paid)} / {formatCurrency(item.amount)}
        </Text>

        {item.endDate && (
          <Text
            style={{
              ...styles.dueDate,
              color: palette[effectiveMode].text,
              opacity: 0.6,
              marginBottom: metrics.spacing * 0.5,
            }}
          >
            Ends on {item.endDate}
          </Text>
        )}

        <ProgressBar
          progress={progress}
          color={theme.colors.primary}
          style={{
            marginVertical: metrics.spacing * 0.5,
            height: 8,
            borderRadius: 4,
          }}
        />

        <Text
          style={{
            ...styles.amount,
            textAlign: "right",
            color: palette[effectiveMode].text,
            opacity: 0.8,
          }}
        >
          Remaining: {formatCurrency(remaining)}
        </Text>
      </Card.Content>
    </Card>
  );
};

// Helper
const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
