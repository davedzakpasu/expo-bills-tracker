import { useAppContext } from "@context/AppContext";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import {
  Badge,
  Button,
  Card,
  Dialog,
  IconButton,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import { useThemeContext } from "../../context/ThemeContext";
import { createAppStyles, palette, tokens } from "../../theme/styles";
import { Installment } from "../../types";
import { formatCurrency } from "../../utils/formatters";
import { updateInstallmentProgress } from "../../utils/installments";

interface InstallmentCardProps {
  item: Installment;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onMarkPaid?: (id: string) => void;
  isPreview?: boolean;
}

export default function InstallmentCard({
  item,
  onEdit,
  onDelete,
  onMarkPaid,
  isPreview = false,
}: InstallmentCardProps) {
  const theme = useTheme();
  const { mode } = useThemeContext();
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  const isWeb = width > 768;

  const { deleteEntry, markPaid } = useAppContext();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMarking, setIsMarking] = useState(false);

  const effectiveMode: "light" | "dark" =
    mode === "system" ? (colorScheme === "dark" ? "dark" : "light") : mode;

  const styles = createAppStyles(theme);
  const surfaceColor = palette[effectiveMode].surface;

  const {
    remainingBalance,
    progressPercent,
    paidCount,
    totalCount,
    nextDue,
    statusInfo,
  } = updateInstallmentProgress(item);

  const allPaid = paidCount === totalCount;

  const sizing = {
    subtitleSize: isWeb ? 13 : 12,
    amountSize: isWeb ? 22 : 20,
    textSize: isWeb ? 14 : 13,
    smallTextSize: isWeb ? 12 : 11,
    iconSize: isWeb ? 18 : 16,
    buttonIconSize: isWeb ? 22 : 20,
    padding: isWeb ? 16 : 12,
    titleSize: isWeb ? 20 : 16,
    buttonHeight: isWeb ? 40 : 36,
  };

  const handleMarkPaid = async () => {
    if (allPaid) {
      Alert.alert("Installment", `${item.name} is already fully paid.`);
      return;
    }

    setIsMarking(true);
    try {
      await markPaid(item.id);
    } catch (error) {
      console.error("Failed to mark installment as paid:", error);
      Alert.alert("Error", "Unable to mark this installment as paid.");
    } finally {
      setIsMarking(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteEntry?.(id);
      setShowConfirm(false);
    } catch (error) {
      console.error("Failed to delete installment:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card
        style={[
          localStyles.card,
          {
            backgroundColor: surfaceColor,
            maxWidth: isWeb ? 420 : "100%",
          },
        ]}
        elevation={2}
      >
        {/* HEADER */}
        <View style={[localStyles.header, { padding: sizing.padding }]}>
          <View style={localStyles.headerLeft}>
            <Text
              style={[
                styles.title,
                { fontSize: sizing.titleSize, fontWeight: "700" },
              ]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <Text
              style={[
                styles.subtitle,
                {
                  fontSize: sizing.subtitleSize,
                  fontStyle: "italic",
                  marginTop: 2,
                  color: theme.colors.onSurfaceVariant,
                },
              ]}
              numberOfLines={1}
            >
              {item.frequency}
            </Text>
          </View>

          {!isPreview && (
            <View style={localStyles.headerRight}>
              <IconButton
                icon={({ size }) => (
                  <FontAwesome6
                    name="pen-to-square"
                    size={size}
                    color={theme.colors.primary}
                  />
                )}
                size={sizing.iconSize}
                onPress={() => onEdit?.(item.id)}
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
                style={localStyles.iconButton}
              />
            </View>
          )}
        </View>

        {/* MAIN CONTENT */}
        <View
          style={[
            localStyles.content,
            {
              paddingHorizontal: sizing.padding,
              paddingBottom: sizing.padding,
            },
          ]}
        >
          {/* Amount + next due date */}
          <View style={localStyles.contentRow}>
            <View style={localStyles.amountBlock}>
              <Text
                style={{
                  fontSize: sizing.amountSize,
                  fontWeight: "700",
                  color: theme.colors.primary,
                }}
              >
                {item.isInstallment && item.payments?.length
                  ? formatCurrency(item.payments[0].amount)
                  : formatCurrency(item.amount)}
              </Text>
              <Text
                style={{
                  fontSize: sizing.smallTextSize,
                  color: theme.colors.onSurfaceVariant,
                  marginTop: 2,
                }}
              >
                {paidCount}/{totalCount} payments
              </Text>
            </View>

            {nextDue && (
              <View style={localStyles.statusBlock}>
                <Badge
                  style={[
                    localStyles.statusBadge,
                    { backgroundColor: statusInfo.color },
                  ]}
                >
                  {statusInfo.label}
                </Badge>
              </View>
            )}
          </View>

          {/* PROGRESS BAR */}
          <View style={localStyles.progressRow}>
            <View style={localStyles.progressTrack}>
              <View
                style={[
                  localStyles.progressFill,
                  {
                    width: `${progressPercent}%`,
                    backgroundColor: theme.colors.primary,
                  },
                ]}
              />
            </View>
            <Text
              style={{
                fontSize: sizing.smallTextSize,
                color: theme.colors.onSurfaceVariant,
              }}
            >
              {progressPercent.toFixed(0)}% paid
            </Text>
          </View>
          {/* REMAINING BALANCE */}
          <Text
            style={{
              fontSize: sizing.smallTextSize,
              color: theme.colors.onSurfaceVariant,
            }}
          >
            Remaining balance : {formatCurrency(remainingBalance)}
          </Text>
        </View>

        {/* FOOTER */}
        {!isPreview && (
          <View style={[styles.cardActionsArea]}>
            <Button
              mode="contained"
              icon={
                allPaid
                  ? "check-circle-outline"
                  : isMarking
                  ? "progress-clock"
                  : "checkbox-marked-circle-outline"
              }
              onPress={handleMarkPaid}
              contentStyle={{ height: sizing.buttonHeight }}
              buttonColor={allPaid ? "#00b16a" : theme.colors.primary}
              labelStyle={{ fontWeight: "700" }}
              style={styles.markPaidBtn}
              disabled={isMarking || allPaid}
              loading={isMarking}
            >
              {allPaid ? "Paid" : isMarking ? "Processing..." : "Mark as Paid"}
            </Button>
          </View>
        )}
      </Card>

      {/* DELETE CONFIRM DIALOG */}
      <Portal>
        <Dialog
          visible={showConfirm}
          onDismiss={() => !isDeleting && setShowConfirm(false)}
          style={{
            maxWidth: isWeb ? 400 : "90%",
            width: isWeb ? 400 : "90%",
            alignSelf: "center",
            backgroundColor: theme.colors.surface,
          }}
        >
          <Dialog.Title style={{ fontSize: isWeb ? 20 : 18 }}>
            <Ionicons name="trash" size={24} color={theme.colors.error} />{" "}
            Confirm Delete
          </Dialog.Title>
          <Dialog.Content>
            <Text style={{ fontSize: isWeb ? 16 : 14 }}>
              Are you sure you want to delete{" "}
              <Text style={{ fontWeight: "bold" }}>{item.name}</Text>?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowConfirm(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              mode="contained"
              buttonColor={theme.colors.error}
              onPress={() => handleDelete(item.id)}
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
  card: {
    flex: 1,
    minWidth: 230,
    marginVertical: tokens.spacing.md * 0.7,
    borderRadius: tokens.radius.md,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
    paddingRight: tokens.spacing.sm,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: { margin: 3 },
  content: { flexDirection: "column" },
  contentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amountBlock: { flex: 1 },
  statusBlock: { alignItems: "center", minWidth: 92 },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    color: "#fff",
    fontWeight: "700",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: tokens.spacing.sm,
    gap: 8,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: "rgba(0,0,0,0.08)",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 999 },
});
