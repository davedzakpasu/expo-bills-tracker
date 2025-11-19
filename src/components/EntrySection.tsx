import { EmptyState } from "@components/EmptyState";
import { memo, useCallback, useState } from "react";
import { FlatList, LayoutChangeEvent, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { moderateScale } from "react-native-size-matters";
import { useAppContext } from "../context/AppContext";
import { createAppStyles, tokens } from "../theme/styles";
import { EntrySectionProps } from "../types";
import BillCard from "./cards/BillCard";
import InstallmentCard from "./cards/InstallmentCard";

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

    const renderSortControls = () => {
      if (!data.length) return null;

      const baseButtonStyle = {
        marginHorizontal: 3,
        minWidth: undefined,
      } as const;

      const baseLabelStyle = {
        fontSize: 13,
        textTransform: "none" as const,
      };

      const activeChipStyle = {
        ...baseButtonStyle,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 2,
        backgroundColor: theme.colors.primaryContainer,
      };

      const activeLabelStyle = {
        ...baseLabelStyle,
        color: theme.colors.onPrimaryContainer,
        fontWeight: "600" as const,
      };

      const inactiveLabelStyle = {
        ...baseLabelStyle,
        color: theme.colors.primary,
      };

      if (mode === "bill") {
        return (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: tokens.spacing.xs,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: 700,
                marginRight: 6,
                color: theme.colors.onSurface,
              }}
            >
              Sort:
            </Text>

            <Button
              compact
              mode={sortKey === "nextDue" ? "contained" : "text"}
              onPress={() => onChangeSortKey("nextDue")}
              style={sortKey === "nextDue" ? activeChipStyle : baseButtonStyle}
              labelStyle={
                sortKey === "nextDue" ? activeLabelStyle : inactiveLabelStyle
              }
              contentStyle={{ paddingHorizontal: 0 }}
            >
              Next due
            </Button>

            <Button
              compact
              mode={sortKey === "amount" ? "contained" : "text"}
              onPress={() => onChangeSortKey("amount")}
              style={sortKey === "amount" ? activeChipStyle : baseButtonStyle}
              labelStyle={
                sortKey === "amount" ? activeLabelStyle : inactiveLabelStyle
              }
              contentStyle={{ paddingHorizontal: 0 }}
            >
              Amount
            </Button>

            <Button
              compact
              mode={sortKey === "name" ? "contained" : "text"}
              onPress={() => onChangeSortKey("name")}
              style={sortKey === "name" ? activeChipStyle : baseButtonStyle}
              labelStyle={
                sortKey === "name" ? activeLabelStyle : inactiveLabelStyle
              }
              contentStyle={{ paddingHorizontal: 0 }}
            >
              Name
            </Button>
          </View>
        );
      }

      // mode === "installment"
      return (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: tokens.spacing.xs,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              marginRight: 6,
              color: theme.colors.onSurface,
            }}
          >
            Sort:
          </Text>

          <Button
            compact
            mode={sortKey === "nextDue" ? "contained" : "text"}
            onPress={() => onChangeSortKey("nextDue")}
            style={sortKey === "nextDue" ? activeChipStyle : baseButtonStyle}
            labelStyle={
              sortKey === "nextDue" ? activeLabelStyle : inactiveLabelStyle
            }
            contentStyle={{ paddingHorizontal: 0 }}
          >
            Next due
          </Button>

          <Button
            compact
            mode={sortKey === "remaining" ? "contained" : "text"}
            onPress={() => onChangeSortKey("remaining")}
            style={sortKey === "remaining" ? activeChipStyle : baseButtonStyle}
            labelStyle={
              sortKey === "remaining" ? activeLabelStyle : inactiveLabelStyle
            }
            contentStyle={{ paddingHorizontal: 0 }}
          >
            Remaining
          </Button>

          <Button
            compact
            mode={sortKey === "name" ? "contained" : "text"}
            onPress={() => onChangeSortKey("name")}
            style={sortKey === "name" ? activeChipStyle : baseButtonStyle}
            labelStyle={
              sortKey === "name" ? activeLabelStyle : inactiveLabelStyle
            }
            contentStyle={{ paddingHorizontal: 0 }}
          >
            Name
          </Button>
        </View>
      );
    };

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
                fontWeight: "700",
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
        {renderSortControls()}

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
                paddingTop: tokens.spacing.md,
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
          </>
        )}
      </View>
    );
  }
);

EntrySection.displayName = "EntrySection";
export default EntrySection;
