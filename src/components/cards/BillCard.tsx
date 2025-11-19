import { useAppContext } from "@context/AppContext";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import {
  Button,
  Card,
  Chip,
  Dialog,
  IconButton,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import { createAppStyles, tokens } from "../../theme/styles";
import { Entry } from "../../types";
import {
  getDueStatusInfo,
  getRelativeStatusLabel,
} from "../../utils/dueStatus";
import { formatCurrency } from "../../utils/formatters";

interface BillCardProps {
  item: Entry;
  onMarkPaid: (id: string) => void;
  onEdit?: (id: string) => void;
  onPress?: (id: string) => void;
  isPreview?: boolean;
}

export default function BillCard({
  item,
  onMarkPaid,
  onEdit,
  onPress,
  isPreview = false,
}: BillCardProps) {
  const theme = useTheme();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteEntry } = useAppContext();
  const { width } = useWindowDimensions();
  const isWeb = width > 768;

  const styles = createAppStyles(theme);

  const { label, color, diffDays } = getDueStatusInfo(item.nextDueDate);
  const relative = getRelativeStatusLabel(diffDays);
  const statusInfo = {
    label: `${label}${relative ? ` (${relative})` : ""}`,
    color,
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteEntry?.(id);
      setShowConfirm(false);
    } catch (error) {
      console.error("Failed to delete bill:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const sizing = {
    subtitleSize: isWeb ? 13 : 12,
    amountSize: isWeb ? 24 : 22,
    textSize: isWeb ? 14 : 13,
    smallTextSize: isWeb ? 13 : 12,
    iconSize: isWeb ? 20 : 18,
    buttonIconSize: isWeb ? 22 : 20,
    padding: isWeb ? 20 : width > 480 ? 16 : 12,
    titleSize: isWeb ? 20 : 16,
    buttonHeight: isWeb ? 48 : 44,
    buttonPadding: isWeb ? 12 : 8,
  };

  return (
    <>
      <Card
        onPress={() => onPress?.(item.id)}
        mode="elevated"
        style={[localStyles.card, { backgroundColor: theme.colors.surface }]}
      >
        <Card.Content style={localStyles.cardContent}>
          {/* HEADER */}
          <View style={[localStyles.header]}>
            <View style={localStyles.headerLeft}>
              <Text style={[styles.title]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  {
                    fontStyle: "italic",
                    marginTop: 2,
                    color: theme.colors.onSurfaceVariant,
                  },
                ]}
              >
                {item.frequency}
              </Text>
            </View>

            {!isPreview && (
              <View style={localStyles.headerRight}>
                <IconButton
                  icon={({ size, color }) => (
                    <FontAwesome6
                      name="pen-to-square"
                      size={size}
                      color={theme.colors.primary}
                    />
                  )}
                  size={sizing.iconSize}
                  onPress={() => onEdit?.(item.id)}
                  accessibilityLabel="Edit bill"
                  style={localStyles.iconButton}
                />
                <IconButton
                  icon={({ size }) => (
                    <FontAwesome6
                      name="trash-can"
                      size={size}
                      color={theme.colors.error}
                    />
                  )}
                  size={sizing.iconSize}
                  onPress={() => setShowConfirm(true)}
                  accessibilityLabel="Delete bill"
                  style={localStyles.iconButton}
                />
              </View>
            )}
          </View>

          {/* MAIN CONTENT */}
          <View style={[localStyles.gridContainer]}>
            <View style={localStyles.amountColumn}>
              <Text
                style={{
                  fontSize: sizing.amountSize,
                  fontWeight: "700",
                  color: theme.colors.primary,
                }}
              >
                {formatCurrency(item.amount)}
              </Text>
            </View>

            <View style={localStyles.rightColumn}>
              <View style={localStyles.statusRow}>
                <Chip
                  compact
                  style={[
                    localStyles.statusChip,
                    { backgroundColor: statusInfo.color },
                  ]}
                  textStyle={localStyles.statusChipText}
                >
                  {statusInfo.label}
                </Chip>
              </View>

              {item.nextDueDate && (
                <View style={localStyles.dateRow}>
                  <FontAwesome6
                    name="calendar-check"
                    color={theme.colors.onSurfaceVariant}
                    style={localStyles.dateIcon}
                  />
                  <Text
                    style={{
                      fontSize: sizing.smallTextSize,
                      color: theme.colors.onSurfaceVariant,
                    }}
                  >
                    {new Date(
                      item.nextDueDate + "T00:00:00"
                    ).toLocaleDateString("fr")}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Card.Content>
        {/* Footer */}
        {!isPreview && (
          <Card.Actions style={styles.actionsRow}>
            <Button
              mode="contained"
              icon="checkbox-marked-circle-outline"
              onPress={() => onMarkPaid(item.id)}
              style={styles.markPaidBtn}
              contentStyle={{ height: sizing.buttonHeight }}
              labelStyle={localStyles.payButtonLabel}
              accessibilityLabel="Mark as paid"
            >
              Mark as Paid
            </Button>
          </Card.Actions>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Portal>
        <Dialog
          visible={showConfirm}
          onDismiss={() => !isDeleting && setShowConfirm(false)}
          style={[
            styles.deleteConfirm,
            {
              maxWidth: isWeb ? 400 : "90%",
              width: isWeb ? 400 : "90%",
              alignSelf: "center",
            },
          ]}
        >
          <Dialog.Title style={{ fontSize: isWeb ? 20 : 18 }}>
            <Ionicons name="trash" size={24} color={theme.colors.error} />
            Confirm Delete
          </Dialog.Title>
          <Dialog.Content>
            <Text
              style={{ fontSize: isWeb ? 16 : 14, lineHeight: isWeb ? 24 : 20 }}
            >
              Are you sure you want to delete{" "}
              <Text style={{ fontWeight: "bold" }}>{item.name}</Text>?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowConfirm(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              buttonColor={theme.colors.error}
              mode="contained"
              onPress={() => handleDelete(item.id)}
              disabled={isDeleting}
              loading={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const localStyles = StyleSheet.create({
  actionsRow: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  amountColumn: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    borderRadius: tokens.radius.lg,
    marginVertical: tokens.spacing.sm,
    overflow: "hidden",
    // Elevation for Android
    elevation: 2,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: tokens.radius.sm,
    shadowOffset: { width: 0, height: 4 },
  },
  cardContent: {
    paddingVertical: 16,
  },
  dateIcon: {
    marginRight: 4,
    opacity: 0.8,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusRow: {
    marginBottom: 4,
  },
  gridContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  rightColumn: {
    flex: 1,
    alignItems: "flex-end",
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerLeft: {
    flexShrink: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  iconButton: {
    margin: 0,
  },
  installmentSection: {
    marginTop: tokens.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.04)",
  },
  installmentTopRow: {
    marginTop: tokens.spacing.sm,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  payButtonLabel: {
    fontWeight: "700",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: tokens.spacing.xs,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: "rgba(0,0,0,0.06)",
    borderRadius: 999,
    overflow: "hidden",
    marginRight: 8,
  },
  progressPct: {
    alignItems: "flex-end",
  },
  markPaidBtn: {
    flex: 1,
    borderRadius: 999,
  },

  statusChip: {
    borderRadius: 999,
  },

  statusChipText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 11,
  },
});
