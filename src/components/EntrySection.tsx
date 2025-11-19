import { EmptyState } from "@components/EmptyState";
import { FlashList } from "@shopify/flash-list";
import { memo, useCallback, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { moderateScale } from "react-native-size-matters";
import { useAppContext } from "../context/AppContext";
import { createAppStyles, tokens } from "../theme/styles";
import { EntrySectionProps } from "../types";
import BillCard from "./cards/BillCard";
import InstallmentCard from "./cards/InstallmentCard";
import SortControls from "./SortControls";

const getNumColumns = (width: number) => {
  if (width === 0) return 1;
  if (width >= 1000) return 3;
  if (width >= 700) return 2;
  return 1;
};

const EntrySection = memo(
  ({
    title,
    data,
    emptyTitle,
    emptyMessage,
    actionLabel,
    onAddPress,
    onEdit,
    onDelete,
    mode,
    sortKey,
    onChangeSortKey,
  }: EntrySectionProps) => {
    const theme = useTheme();
    const styles = createAppStyles(theme);
    const { markPaid } = useAppContext();
    const [expanded, setExpanded] = useState(false);
    const [containerWidth, setContainerWidth] = useState(0);

    const visibleItems = data.slice(0, 2);
    const hasMore = data.length > 3;
    const itemsToRender = expanded ? data : visibleItems;

    const numColumns = getNumColumns(containerWidth);
    const cardSpacing = tokens.spacing.md;

    const handleLayout = useCallback((e: LayoutChangeEvent) => {
      const width = e.nativeEvent.layout.width;
      setContainerWidth(width);
    }, []);

    return (
      <View
        style={[
          styles.card,
          {
            marginHorizontal: containerWidth < 768 ? 8 : 16,
            paddingHorizontal: tokens.spacing.md * 1.5,
            paddingVertical: tokens.spacing.md * 1.25,
          },
        ]}
        onLayout={handleLayout}
      >
        {/* Top row: title + Add button */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={[
              styles.title,
              {
                fontWeight: "600",
                fontSize: moderateScale(22),
                color: theme.colors.onSurface,
              },
            ]}
          >
            {title}
          </Text>

          {data.length > 0 && (
            <Button
              mode="contained"
              onPress={onAddPress}
              icon="plus"
              style={{
                borderRadius: 999,
                paddingHorizontal: tokens.spacing.md * 1.2,
                height: 38,
              }}
              labelStyle={{
                textTransform: "none",
                fontWeight: "600",
              }}
            >
              {/* {actionLabel} */}
              Add
            </Button>
          )}
        </View>

        {/* Second row: sort controls */}
        <SortControls
          mode={mode}
          sortKey={sortKey}
          onChangeSortKey={onChangeSortKey as (key: any) => void}
          hasData={data.length > 0}
        />

        {/* Content */}
        {data.length === 0 ? (
          <View style={{ marginTop: tokens.spacing.lg }}>
            <EmptyState
              title={emptyTitle}
              message={emptyMessage}
              actionLabel={actionLabel}
              onActionPress={onAddPress}
            />
          </View>
        ) : (
          <View style={localStyles.wrapper}>
            <FlashList
              data={itemsToRender}
              key={numColumns}
              keyExtractor={(item) => item.id}
              numColumns={numColumns}
              renderItem={({ item }) => (
                <View
                  style={{
                    marginRight: cardSpacing,
                    marginBottom: cardSpacing,
                  }}
                >
                  {item.isInstallment ? (
                    <InstallmentCard
                      item={item}
                      onEdit={() => onEdit(item)}
                      onDelete={() => onDelete(item.id)}
                      onMarkPaid={() => markPaid(item.id)}
                    />
                  ) : (
                    <BillCard
                      item={item}
                      onMarkPaid={() => markPaid(item.id)}
                      onEdit={() => onEdit(item)}
                    />
                  )}
                </View>
              )}
              contentContainerStyle={{
                paddingVertical: tokens.spacing.sm,
              }}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
            {hasMore && (
              <Button
                onPress={() => setExpanded(!expanded)}
                textColor={theme.colors.primary}
                style={styles.seeAllButton}
                labelStyle={{ textTransform: "none" }}
              >
                {expanded ? "Show less" : "See all"}
              </Button>
            )}
          </View>
        )}
      </View>
    );
  }
);

const localStyles = StyleSheet.create({
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

EntrySection.displayName = "EntrySection";
export default EntrySection;
