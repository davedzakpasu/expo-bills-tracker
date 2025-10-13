import React from "react";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { createAppStyles } from "src/theme/styles";

type SummaryCardProps = {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  tintColor: string;
  cardWidth: number;
};

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  icon,
  color,
  tintColor,
  cardWidth,
}) => {
  const theme = useTheme();
  const styles = createAppStyles(theme);

  return (
    <View style={[styles.summaryCard, { width: cardWidth }]}>
      <View style={styles.summaryCardHeader}>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 16,
            backgroundColor: tintColor,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10,
          }}
        >
          <MaterialCommunityIcons name={icon} size={30} color={color} />
        </View>
        <Text
          style={[
            styles.summaryTitle,
            { color: theme.colors.onSurfaceVariant },
          ]}
          numberOfLines={2}
        >
          {title}
        </Text>
      </View>
      <Text style={[styles.summaryValue]}>{value}</Text>
    </View>
  );
};

export default SummaryCard;
