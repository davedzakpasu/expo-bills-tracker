import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useTheme } from "react-native-paper";
import { createAppStyles } from "src/theme/styles";
import { Entry } from "../types";

type SectionListProps = {
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  data: Entry[];
  onItemPress?: (item: Entry) => void;
};

export const SectionList: React.FC<SectionListProps> = ({
  title,
  iconName,
  data,
  onItemPress,
}) => {
  const theme = useTheme();
  const styles = createAppStyles(theme);
  const { width } = useWindowDimensions();

  // Responsive card width
  const getCardWidth = () => {
    if (width < 380) return width * 0.7;
    if (width < 768) return width * 0.45;
    return width * 0.3;
  };

  return (
    <View style={styles.sectionContainer}>
      {/* Section header */}
      <View style={styles.sectionHeader}>
        <Ionicons
          name={iconName}
          size={22}
          color={theme.colors.primary}
          style={{ marginRight: 6 }}
        />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>

      {/* Scrollable cards */}
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 4 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.billCard, { width: getCardWidth() }]}
            onPress={() => onItemPress?.(item)}
          >
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardAmount}>${item.amount.toFixed(2)}</Text>
            {item.remainingBalance !== undefined && (
              <Text style={styles.cardSub}>
                Remaining: ${item.remainingBalance.toFixed(2)}
              </Text>
            )}
            {item.nextDueDate && (
              <Text style={styles.cardSub}>Next: {item.nextDueDate}</Text>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
