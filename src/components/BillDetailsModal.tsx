import React from "react";
import { Modal, View } from "react-native";
import { Button, Divider, Text, useTheme } from "react-native-paper";
import { createAppStyles } from "../theme/styles";
import { Entry } from "../types";

type BillDetailsModalProps = {
  visible: boolean;
  onClose: () => void;
  entry: Entry | null;
};

export const BillDetailsModal: React.FC<BillDetailsModalProps> = ({
  visible,
  onClose,
  entry,
}) => {
  const theme = useTheme();
  const styles = createAppStyles(theme);

  if (!entry) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text variant="titleLarge" style={styles.title}>
            {entry.name}
          </Text>

          <Divider style={{ marginVertical: 8 }} />

          <View style={{ gap: 6 }}>
            <Text variant="bodyMedium">
              <Text style={{ fontWeight: "bold" }}>Amount: </Text>$
              {entry.amount}
            </Text>
            <Text variant="bodyMedium">
              <Text style={{ fontWeight: "bold" }}>Due date: </Text>
              {entry.nextDueDate}
            </Text>
            {entry.notes && (
              <Text variant="bodyMedium">
                <Text style={{ fontWeight: "bold" }}>Notes: </Text>
                {entry.notes}
              </Text>
            )}
          </View>

          <Button
            mode="contained-tonal"
            onPress={onClose}
            style={{ marginTop: 16 }}
          >
            Close
          </Button>
        </View>
      </View>
    </Modal>
  );
};
