import { DatePicker } from "@components/DatePicker";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  Button,
  Checkbox,
  IconButton,
  Portal,
  RadioButton,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { createAppStyles, metrics } from "src/theme/styles";
import { v4 as uuidv4 } from "uuid";
import BillCard from "../components/BillCard";
import { useAppContext } from "../context/AppContext";
import { Entry } from "../types";

const FREQUENCIES = ["Monthly", "Bi-Monthly", "Weekly", "One-time"] as const;

type Props = {
  visible: boolean;
  onDismiss: () => void;
  entry?: Entry;
};

export default function AddBillModal({ visible, onDismiss, entry }: Props) {
  const theme = useTheme();
  const styles = createAppStyles(theme);
  const { addBill, updateBill } = useAppContext();
  const { height: screenHeight } = Dimensions.get("window");

  const [name, setName] = useState(entry?.name ?? "");
  const [amount, setAmount] = useState(entry?.amount?.toString() ?? "");
  const [isInstallment, setIsInstallment] = useState(
    entry?.isInstallment ?? false
  );
  const [remainingBalance, setRemainingBalance] = useState(
    entry?.remainingBalance?.toString() ?? ""
  );
  const [frequency, setFrequency] = useState(entry?.frequency ?? "Monthly");
  const [nextDueDate, setNextDueDate] = useState(
    entry?.nextDueDate ?? new Date().toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState(entry?.endDate ?? "");
  const [autoAdvance, setAutoAdvance] = useState(entry?.autoAdvance ?? false);

  const isWeb = Platform.OS === "web";

  // Animated values
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isWeb) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: visible ? 0 : screenHeight,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: visible ? 1 : 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(visible ? 1 : 0);
    }
  }, [visible, screenHeight, isWeb]);

  const canSave =
    name.trim() !== "" &&
    parseFloat(amount) > 0 &&
    (!isInstallment || parseFloat(remainingBalance) >= 0);

  const generateInstallmentSchedule = () => {
    if (!isInstallment) return undefined;
    const total = parseFloat(amount);
    const remaining = parseFloat(remainingBalance);
    const payments: { dueDate: string; amount: number; paid: boolean }[] = [];
    const next = new Date(nextDueDate);
    const n = Math.ceil(remaining / total); // number of remaining payments
    for (let i = 0; i < n; i++) {
      payments.push({
        dueDate: new Date(next).toISOString().slice(0, 10),
        amount: total,
        paid: false,
      });
      next.setDate(next.getDate() + 30); // simple monthly approximation
    }
    return payments;
  };

  const handleSave = async () => {
    if (!canSave) return;

    const newEntry: Entry = {
      id: entry?.id ?? uuidv4(),
      name: name.trim(),
      amount: parseFloat(amount),
      isInstallment,
      remainingBalance: isInstallment
        ? parseFloat(remainingBalance)
        : undefined,
      frequency,
      nextDueDate,
      endDate: isInstallment ? endDate : undefined,
      autoAdvance,
      payments: generateInstallmentSchedule(),
    };

    if (entry) {
      await updateBill(entry.id, newEntry);
    } else {
      await addBill(newEntry);
    }
    onDismiss();
  };

  if (!visible) return null;

  return (
    <Portal>
      <Animated.View
        style={[
          stylesPortal.overlay,
          { opacity: fadeAnim },
          isWeb && { justifyContent: "center" },
        ]}
      >
        <Animated.View
          style={[
            !isWeb && { transform: [{ translateY: slideAnim }] },
            isWeb && stylesPortal.webContainer,
          ]}
        >
          <Surface
            style={[
              stylesPortal.surface,
              { backgroundColor: theme.colors.surface },
              isWeb && stylesPortal.webSurface,
            ]}
          >
            {/* Header */}
            <View style={stylesPortal.header}>
              <Text style={stylesPortal.headerTitle}>
                {entry ? "Edit Bill/Installment" : "Add New Bill/Installment"}
              </Text>
              <IconButton
                icon="close"
                size={24}
                onPress={onDismiss}
                iconColor={theme.colors.onSurface}
              />
            </View>

            <ScrollView
              contentContainerStyle={stylesPortal.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <TextInput
                label="Name"
                value={name}
                onChangeText={setName}
                style={{ marginTop: metrics.spacing }}
              />
              <TextInput
                label="Amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                style={{ marginTop: metrics.spacing }}
              />

              <View style={stylesPortal.checkboxRow}>
                <Checkbox
                  status={isInstallment ? "checked" : "unchecked"}
                  onPress={() => setIsInstallment((s) => !s)}
                />
                <Text>Is this an installment?</Text>
              </View>

              {isInstallment && (
                <>
                  <TextInput
                    label="Remaining Balance"
                    value={remainingBalance}
                    onChangeText={setRemainingBalance}
                    keyboardType="numeric"
                    style={{ marginTop: metrics.spacing }}
                  />
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={setEndDate}
                  />
                  <View style={stylesPortal.checkboxRow}>
                    <Checkbox
                      status={autoAdvance ? "checked" : "unchecked"}
                      onPress={() => setAutoAdvance((s) => !s)}
                    />
                    <Text>Auto-advance due date after payment</Text>
                  </View>
                </>
              )}

              <View style={{ marginTop: metrics.spacing }}>
                <Text>Frequency</Text>
                <RadioButton.Group
                  onValueChange={(v) => setFrequency(v as any)}
                  value={frequency}
                >
                  {FREQUENCIES.map((f) => (
                    <RadioButton.Item key={f} label={f} value={f} />
                  ))}
                </RadioButton.Group>
              </View>

              <DatePicker
                label="Next Due Date"
                value={nextDueDate}
                onChange={setNextDueDate}
              />

              {/* Save / Cancel */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: metrics.spacing * 2,
                }}
              >
                <Button mode="outlined" onPress={onDismiss}>
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSave}
                  disabled={!canSave}
                >
                  Save
                </Button>
              </View>

              {/* Preview */}
              <Text style={[styles.title, { marginTop: metrics.spacing * 2 }]}>
                Preview
              </Text>
              <BillCard
                item={{
                  id: "preview",
                  name,
                  amount: parseFloat(amount),
                  frequency,
                  isInstallment,
                  remainingBalance: isInstallment
                    ? parseFloat(remainingBalance)
                    : undefined,
                  nextDueDate,
                  endDate: isInstallment ? endDate : undefined,
                  autoAdvance,
                  payments: generateInstallmentSchedule(),
                }}
                onMarkPaid={() => {}}
              />
            </ScrollView>
          </Surface>
        </Animated.View>
      </Animated.View>
    </Portal>
  );
}

const stylesPortal = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000080",
  },
  surface: {
    marginTop: 100,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    maxHeight: "90%",
  },
  webContainer: {
    marginHorizontal: 200,
    maxWidth: 600,
  },
  webSurface: {
    marginTop: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  scrollContent: { paddingBottom: 20 },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: metrics.spacing,
  },
});
