import { useAppContext } from "@context/AppContext";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
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
  const { mode } = useThemeContext();
  const colorScheme = useColorScheme();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteEntry } = useAppContext();
  const { width } = useWindowDimensions();
  const isWeb = width > 768;

  const effectiveMode: "light" | "dark" =
    mode === "system" ? (colorScheme === "dark" ? "dark" : "light") : mode;

  const styles = createAppStyles(theme);
  const surfaceColor = palette[effectiveMode].surface;

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
    amountSize: isWeb ? 22 : 20,
    textSize: isWeb ? 14 : 13,
    smallTextSize: isWeb ? 12 : 11,
    iconSize: isWeb ? 18 : 16,
    buttonIconSize: isWeb ? 22 : 20,
    padding: isWeb ? 20 : width > 480 ? 16 : 12,
    titleSize: isWeb ? 20 : 16,
    buttonHeight: isWeb ? 40 : 36,
    buttonPadding: isWeb ? 12 : 8,
  };

  return (
    <>
      <Card
        onPress={() => onPress?.(item.id)}
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
        <View
          style={[
            localStyles.content,
            {
              paddingHorizontal: sizing.padding,
              paddingBottom: sizing.padding,
            },
          ]}
        >
          <View style={localStyles.contentRow}>
            <View style={localStyles.amountBlock}>
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

            <View style={localStyles.statusBlock}>
              <Badge
                style={[
                  localStyles.statusBadge,
                  { backgroundColor: statusInfo.color },
                ]}
                size={20}
              >
                {statusInfo.label}
              </Badge>
              {item.nextDueDate && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 6,
                    gap: 6,
                    opacity: 0.7,
                  }}
                >
                  <FontAwesome6
                    name="calendar-check"
                    color={theme.colors.onSurfaceVariant}
                  />
                  <Text
                    style={{
                      fontSize: sizing.smallTextSize,
                      color: theme.colors.onSurfaceVariant,

                      textAlign: "right",
                    }}
                  >
                    {new Date(item.nextDueDate).toLocaleDateString("fr")}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Footer */}
        {!isPreview && (
          <View style={[styles.cardActionsArea]}>
            <Button
              mode="contained"
              onPress={() => onMarkPaid(item.id)}
              icon="checkbox-marked-circle-outline"
              contentStyle={{ height: sizing.buttonHeight }}
              buttonColor={theme.colors.primary}
              labelStyle={{ fontWeight: "700" }}
              style={styles.markPaidBtn}
              accessibilityLabel="Mark as paid"
            >
              Mark as Paid
            </Button>
          </View>
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
  amountBlock: {
    flex: 1,
    justifyContent: "center",
  },
  statusBlock: {
    alignItems: "center",
    minWidth: 92,
    marginLeft: 12,
  },
  content: {
    flexDirection: "column",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flex: 1,
    paddingRight: tokens.spacing.sm,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    color: "#fff",
    fontWeight: "700",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  iconButton: {
    margin: 3,
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
    alignSelf: "flex-end",
    minWidth: 120,
    borderRadius: 999,
  },
});
