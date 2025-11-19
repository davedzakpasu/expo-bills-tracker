import { memo } from "react";
import { View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { tokens } from "../theme/styles";

type BillSortKey = "nextDue" | "amount" | "name";
type InstallmentSortKey = "nextDue" | "remaining" | "name";
type SortKey = BillSortKey | InstallmentSortKey;

interface SortControlsProps {
  mode: "bill" | "installment";
  sortKey: SortKey;
  onChangeSortKey: (key: SortKey) => void;
  hasData: boolean;
}

const SortControls = memo(
  ({ mode, sortKey, onChangeSortKey, hasData }: SortControlsProps) => {
    const theme = useTheme();

    if (!hasData) return null;

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
      paddingHorizontal: 8,
      backgroundColor: theme.colors.primaryContainer,
    };

    const activeLabelStyle = {
      ...baseLabelStyle,
      color: theme.colors.onPrimaryContainer,
      fontWeight: "700" as const,
    };

    const inactiveLabelStyle = {
      ...baseLabelStyle,
      color: theme.colors.primary,
    };

    const renderButton = (key: SortKey, label: string) => (
      <Button
        compact
        mode={sortKey === key ? "contained" : "text"}
        onPress={() => onChangeSortKey(key)}
        style={sortKey === key ? activeChipStyle : baseButtonStyle}
        labelStyle={sortKey === key ? activeLabelStyle : inactiveLabelStyle}
        contentStyle={{ padding: 0 }}
      >
        {label}
      </Button>
    );

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
            fontWeight: "700",
            marginRight: 6,
            color: theme.colors.onSurface,
          }}
        >
          Sort:
        </Text>

        {renderButton("nextDue", "Next due")}

        {mode === "bill"
          ? renderButton("amount" as BillSortKey, "Amount")
          : renderButton("remaining" as InstallmentSortKey, "Remaining")}

        {renderButton("name", "Name")}
      </View>
    );
  }
);

SortControls.displayName = "SortControls";
export default SortControls;
