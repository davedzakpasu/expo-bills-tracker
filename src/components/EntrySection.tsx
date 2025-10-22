import { EmptyState } from "@components/EmptyState";
import { memo, useCallback, useState } from "react";
import { FlatList, LayoutChangeEvent, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { useAppContext } from "../context/AppContext";
import { createAppStyles, tokens } from "../theme/styles";
import { Entry } from "../types";
import BillCard from "./cards/BillCard";
import InstallmentCard from "./cards/InstallmentCard";

interface EntrySectionProps {
  title: string;
  data: Entry[];
  emptyTitle: string;
  emptyMessage: string;
  actionLabel: string;
  onAddPress: () => void;
  onEdit: (entry: Entry) => void;
  onDelete: (id: string) => void;
}

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
  }: EntrySectionProps) => {
    const theme = useTheme();
    const styles = createAppStyles(theme);
    const { markPaid } = useAppContext();
    const [expanded, setExpanded] = useState(false);
    const [containerWidth, setContainerWidth] = useState(0);

    const visibleItems = data.slice(0, 3);
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
          { marginHorizontal: containerWidth < 768 ? 8 : 16 },
        ]}
        onLayout={handleLayout}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.title}>{title}</Text>
          {data.length > 0 && (
            <Button
              mode="contained"
              onPress={onAddPress}
              icon="plus"
              style={{ borderRadius: tokens.radius.md }}
            >
              {actionLabel}
            </Button>
          )}
        </View>

        {data.length === 0 ? (
          <EmptyState
            title={emptyTitle}
            message={emptyMessage}
            actionLabel={actionLabel}
            onActionPress={onAddPress}
          />
        ) : (
          <>
            <FlatList
              key={numColumns}
              data={itemsToRender}
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
                      onMarkPaid={function (id: string): void {
                        throw new Error("Function not implemented.");
                      }}
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
                padding: tokens.spacing.md,
              }}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />

            {hasMore && (
              <Button
                onPress={() => setExpanded(!expanded)}
                textColor={theme.colors.primary}
                style={styles.seeAllButton}
              >
                {expanded ? "Show less" : "See all"}
              </Button>
            )}
          </>
        )}
      </View>
    );
  }
);

EntrySection.displayName = "EntrySection";
export default EntrySection;
