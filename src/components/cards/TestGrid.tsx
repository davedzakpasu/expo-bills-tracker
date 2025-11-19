import { FlashList } from "@shopify/flash-list";
import React from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { TestCard } from "./TestCard";

type Bill = {
  id: string;
  name: string;
  frequency: string;
  amount: string;
  statusLabel: string;
  dateLabel: string;
};

type TestGridProps = {
  data: Bill[];
};

export const TestGrid: React.FC<TestGridProps> = ({ data }) => {
  const { width } = useWindowDimensions();
  const numColumns = width >= 900 ? 3 : width >= 600 ? 2 : 1;

  return (
    <View style={styles.wrapper}>
      <FlashList
        data={data}
        key={numColumns}
        numColumns={numColumns}
        contentContainerStyle={styles.listContent}
        style={{ flex: 1 }}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <TestCard
              name={item.name}
              frequency={item.frequency}
              amount={item.amount}
              statusLabel={item.statusLabel}
              dateLabel={item.dateLabel}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    minHeight: 2, // make sure FlashList has a usable size
    alignSelf: "stretch",
  },
  listContent: {
    padding: 16,
  },
  cardWrapper: {
    flex: 1,
    padding: 8,
  },
});
