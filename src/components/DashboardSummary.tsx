import { formatCurrency } from "@utils/formatters";
import React from "react";
import { useWindowDimensions, View } from "react-native";
import { useTheme } from "react-native-paper";
import { createAppStyles } from "src/theme/styles";
import SummaryCard from "./SummaryCard";

type DashboardSummaryProps = {
  totalMonthly: number;
  totalRemaining: number;
  overdue: number;
};

const H_PADDING = 32;
const GAP = 12;
const MIN_CARD_WIDTH = 180;
const MAX_COLUMNS = 3;

const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  totalMonthly,
  totalRemaining,
  overdue,
}) => {
  const theme = useTheme();
  const styles = createAppStyles(theme);
  const { width } = useWindowDimensions();
  const availableWidth = width - H_PADDING;
  const numColumns = Math.max(
    1,
    Math.min(
      MAX_COLUMNS,
      Math.floor((availableWidth + GAP) / (MIN_CARD_WIDTH + GAP))
    )
  );
  const cardWidth = (availableWidth - GAP * (numColumns - 1)) / numColumns;

  const data = [
    {
      title: "Total due this month",
      value: formatCurrency(totalMonthly),
      icon: "cash-multiple",
      color: theme.colors.primary,
      tintColor: theme.dark
        ? "rgba(100,150,255,0.15)"
        : "rgba(100,150,255,0.1)",
    },
    {
      title: "Total remaining",
      value: formatCurrency(totalRemaining),
      icon: "chart-line",
      color: "#4CAF50",
      tintColor: theme.dark ? "rgba(76,175,80,0.2)" : "rgba(76,175,80,0.1)",
    },
    {
      title: "Overdue Bills",
      value: `$${overdue ?? "0.00"}`,
      icon: "clock-time-eight-outline",
      color: "#FF3B30",
      tintColor: theme.dark ? "rgba(255,59,48,0.25)" : "rgba(255,59,48,0.1)",
    },
  ];

  return (
    <View style={styles.summaryWrapper}>
      <View style={styles.summaryContainer}>
        {data.map((card, i) => (
          <SummaryCard key={card.title} {...card} cardWidth={cardWidth} />
        ))}
      </View>
    </View>
  );
};

export default DashboardSummary;
