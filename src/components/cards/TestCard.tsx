import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, IconButton, Text, useTheme } from "react-native-paper";

type TestCardProps = {
  name: string;
  frequency: string;
  amount: string;
  statusLabel: string;
  dateLabel: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onMarkAsPaid?: () => void;
};

export const TestCard: React.FC<TestCardProps> = ({
  name,
  frequency,
  amount,
  statusLabel,
  dateLabel,
  onEdit,
  onDelete,
  onMarkAsPaid,
}) => {
  const theme = useTheme();

  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content style={styles.cardContent}>
        {/* Header: title + frequency + actions */}
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.subtitle}>{frequency}</Text>
          </View>

          <View style={styles.iconRow}>
            <IconButton
              icon="pencil-outline"
              size={20}
              onPress={onEdit}
              style={styles.iconButton}
              iconColor={theme.colors.primary}
            />
            <IconButton
              icon="trash-can-outline"
              size={20}
              onPress={onDelete}
              style={styles.iconButton}
              iconColor={theme.colors.error}
            />
          </View>
        </View>

        {/* Amount + status pill */}
        <View style={styles.amountRow}>
          <Text style={[styles.amount, { color: theme.colors.primary }]}>
            {amount}
          </Text>

          <View
            style={[
              styles.statusPill,
              { backgroundColor: theme.colors.primary },
            ]}
          >
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
        </View>

        {/* Date row */}
        <View style={styles.dateRow}>
          <IconButton
            icon="calendar-blank-outline"
            size={18}
            disabled
            style={styles.calendarIcon}
            iconColor={theme.colors.onSurfaceVariant ?? "#9E9E9E"}
          />
          <Text style={styles.dateText}>{dateLabel}</Text>
        </View>
      </Card.Content>

      {/* Bottom full-width button */}
      <Card.Actions style={styles.actionsRow}>
        <Button
          mode="contained"
          icon="check-circle-outline"
          onPress={onMarkAsPaid}
          style={styles.payButton}
          contentStyle={styles.payButtonContent}
          labelStyle={styles.payButtonLabel}
        >
          Mark as Paid
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: "hidden",
    marginVertical: 8,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    // Elevation for Android
    elevation: 2,
  },
  cardContent: {
    paddingVertical: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  titleContainer: {
    flexShrink: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    color: "#9E9E9E",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    margin: 0,
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  amount: {
    fontSize: 22,
    fontWeight: "700",
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  calendarIcon: {
    marginLeft: -8,
    marginRight: -4,
  },
  dateText: {
    fontSize: 12,
    color: "#9E9E9E",
  },
  actionsRow: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  payButton: {
    flex: 1,
    borderRadius: 999,
  },
  payButtonContent: {
    height: 44,
  },
  payButtonLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
});
