import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { View, useColorScheme, useWindowDimensions } from "react-native";
import {
  Button,
  Card,
  Dialog,
  IconButton,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import { useThemeContext } from "../context/ThemeContext";
import { createAppStyles, metrics, palette } from "../theme/styles";
import { Entry } from "../types";
import { daysUntil, formatCurrency } from "../utils/formatters";

export default function BillCard({
  item,
  onMarkPaid,
  onEdit,
  onDelete,
}: {
  item: Entry;
  onMarkPaid: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const theme = useTheme();
  const { mode } = useThemeContext();
  const colorScheme = useColorScheme();
  const [showConfirm, setShowConfirm] = useState(false);
  const { width } = useWindowDimensions();
  const isWeb = width > 768;

  const effectiveMode: "light" | "dark" =
    mode === "system" ? (colorScheme === "dark" ? "dark" : "light") : mode;

  const cardWidth = isWeb
    ? Math.min(350, width * 0.75) // Max 350px or 75% of screen width
    : width - metrics.spacing * 2.6;

  const styles = createAppStyles(theme);
  const dueDays = daysUntil(item.nextDueDate);
  const textColor = palette[effectiveMode].text;
  const surfaceColor = palette[effectiveMode].surface;

  const handleDelete = () => {
    setShowConfirm(false);
    onDelete?.();
  };

  return (
    <>
      <Card
        style={{
          marginVertical: metrics.spacing * 0.7,
          backgroundColor: surfaceColor,
          borderRadius: metrics.radius,
          elevation: 2,
          width: cardWidth,
        }}
      >
        {/* Header */}
        <Card.Title
          title={item.name}
          titleStyle={[
            styles.cardTitle,
            { fontWeight: "600", fontSize: isWeb ? 18 : 16 },
          ]}
          subtitle={item.frequency}
          subtitleStyle={[
            styles.subtitle,
            { color: textColor, fontSize: isWeb ? 14 : 13 },
          ]}
          right={() => (
            <View style={{ flexDirection: "row", marginRight: isWeb ? 8 : 0 }}>
              {onEdit && (
                <IconButton
                  icon={({ size, color }) => (
                    <Ionicons
                      name="create-outline"
                      size={size}
                      color={theme.colors.primary}
                    />
                  )}
                  size={isWeb ? 22 : 20}
                  onPress={onEdit}
                />
              )}
              {!onDelete && (
                <IconButton
                  icon={({ size, color }) => (
                    <Ionicons
                      name="trash-outline"
                      size={size}
                      color={theme.colors.error}
                    />
                  )}
                  size={isWeb ? 22 : 20}
                  onPress={() => setShowConfirm(true)}
                />
              )}
            </View>
          )}
        />

        {/* Content */}
        <Card.Content
          style={{
            paddingBottom: metrics.spacing,
            paddingHorizontal: isWeb ? 20 : 16,
          }}
        >
          <View style={{ gap: isWeb ? 12 : 10, marginVertical: 8 }}>
            {/* Amount Row */}
            <Row
              icon="dollar-sign"
              label="Amount"
              value={formatCurrency(item.amount)}
              textColor={textColor}
              theme={theme}
            />

            {/* Remaining Balance */}
            {item.isInstallment && (
              <Row
                icon="wallet"
                label="Remaining balance"
                value={formatCurrency(item.remainingBalance ?? 0)}
                textColor={textColor}
                theme={theme}
                // isWeb={isWeb}
              />
            )}

            {/* Next Due Date */}
            {item.nextDueDate && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginTop: 4,
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <FontAwesome6
                    name="calendar"
                    size={isWeb ? 20 : 18}
                    color={theme.colors.outline}
                  />
                  <Text
                    style={[
                      styles.dueDate,
                      { color: textColor, fontSize: isWeb ? 15 : 14 },
                    ]}
                  >
                    Next due date
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={[
                      styles.dueDate,
                      { color: textColor, fontSize: isWeb ? 15 : 14 },
                    ]}
                  >
                    {new Date(item.nextDueDate).toLocaleDateString()}
                  </Text>
                  {dueDays !== null && (
                    <Text
                      style={[
                        styles.dueDate,
                        {
                          color: theme.colors.outline,
                          fontSize: isWeb ? 13 : 12,
                          marginTop: 2,
                        },
                      ]}
                    >
                      in {dueDays} days
                    </Text>
                  )}
                </View>
              </View>
            )}
          </View>
        </Card.Content>

        {/* Footer */}
        <Card.Actions
          style={{
            padding: isWeb ? 16 : 12,
            paddingTop: isWeb ? 12 : 8,
          }}
        >
          <Button
            mode="contained"
            onPress={onMarkPaid}
            icon="checkbox-marked-circle-outline"
            buttonColor={theme.colors.primary}
            style={{ flex: 1, borderRadius: metrics.radius }}
            contentStyle={{
              paddingHorizontal: metrics.spacing,
              paddingVertical: isWeb
                ? metrics.spacing * 0.7
                : metrics.spacing * 0.5,
            }}
            labelStyle={{ fontSize: isWeb ? 15 : 14 }}
          >
            Mark as Paid
          </Button>
        </Card.Actions>
      </Card>

      {/* Delete Confirmation Modal */}
      <Portal>
        <Dialog
          visible={showConfirm}
          onDismiss={() => setShowConfirm(false)}
          style={[
            styles.deleteConfirm,
            { maxWidth: isWeb ? 400 : "90%", width: isWeb ? 400 : "90%" },
          ]}
        >
          <Dialog.Title style={{ fontSize: isWeb ? 20 : 18 }}>
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
            <Button onPress={() => setShowConfirm(false)}>Cancel</Button>
            <Button
              buttonColor={theme.colors.error}
              mode="contained"
              onPress={handleDelete}
            >
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

/** Reusable row component inside the card */
function Row({
  icon,
  label,
  value,
  textColor,
  theme,
}: {
  icon: any;
  label: string;
  value: string;
  textColor: string;
  theme: any;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <FontAwesome6 name={icon} size={18} color={theme.colors.outline} />
        <Text style={{ color: textColor, fontSize: 14 }}>{label}</Text>
      </View>
      <Text style={{ color: textColor, fontWeight: "600", fontSize: 14 }}>
        {value}
      </Text>
    </View>
  );
}
