import InstallmentCard from "@components/cards/InstallmentCard";
import { DatePicker } from "@components/DatePicker";
import { useExchangeRate } from "@hooks/useExchangeRate";
import { toLocalISODate } from "@utils/formatters";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import {
  Button,
  Checkbox,
  Chip,
  Divider,
  HelperText,
  IconButton,
  Portal,
  Snackbar,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { createAppStyles, tokens } from "src/theme/styles";
import { v4 as uuidv4 } from "uuid";
import { useAppContext } from "../context/AppContext";
import { Entry, FREQUENCIES, Frequency } from "../types";

type Props = {
  visible: boolean;
  onDismiss: () => void;
  entry?: Entry;
};

export default function InstallmentModal({ visible, onDismiss, entry }: Props) {
  const theme = useTheme();
  const styles = createAppStyles(theme);
  const { addEntry, updateEntry } = useAppContext();
  const { height: screenHeight } = Dimensions.get("window");
  const { width: windowWidth } = useWindowDimensions();

  // Form state
  const [name, setName] = useState(entry?.name ?? "");
  const [amount, setAmount] = useState(entry?.amount?.toString() ?? "");
  const [numPayments, setNumPayments] = useState(
    entry?.numPayments?.toString() ?? ""
  );
  const [frequency, setFrequency] = useState(entry?.frequency ?? "Monthly");
  const [startDate, setStartDate] = useState(
    entry?.startDate ?? toLocalISODate(new Date())
  );
  const [notes, setNotes] = useState(entry?.notes ?? "");
  const [autoAdvance, setAutoAdvance] = useState(entry?.autoAdvance ?? false);
  const [showPreview, setShowPreview] = useState(false);

  const {
    rate: eurToCadRate,
    loading,
    error,
    refresh,
  } = useExchangeRate("EUR", "CAD");

  const [isXof, setIsXof] = useState(false);
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    type: "info" as "info" | "error",
  });
  const RATE_KEY = "@eur_to_cad_rate_v1";

  // ADDED: Track which fields have been touched for validation
  const [touched, setTouched] = useState({
    name: false,
    amount: false,
    numPayments: false,
    startDate: false,
  });

  const isWeb = Platform.OS === "web";
  const isWideScreen = windowWidth >= 768;

  // FIXED: Require at least 2 payments (changed from >= 0 to > 1)
  const canSave =
    name.trim() !== "" &&
    parseFloat(amount) > 0 &&
    startDate.trim() !== "" &&
    parseFloat(numPayments) > 1;

  // Animated values
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const previewAnim = useRef(new Animated.Value(0)).current;

  const showSnackbar = (message: string, type: "info" | "error" = "info") => {
    setSnackbar({ visible: true, message, type });
  };

  // FIXED: Always show preview on wide screens
  useEffect(() => {
    if (isWideScreen) {
      setShowPreview(true);
    }
  }, [isWideScreen]);

  // ADDED: Reset form when modal closes or entry changes
  useEffect(() => {
    if (visible && entry) {
      // Editing existing entry
      setName(entry.name ?? "");
      setAmount(entry.amount?.toString() ?? "");
      setNumPayments(entry.numPayments?.toString() ?? "");
      setFrequency(entry.frequency ?? "Monthly");
      setStartDate(entry.startDate ?? toLocalISODate(new Date()));
      setNotes(entry.notes ?? "");
      setAutoAdvance(entry.autoAdvance ?? false);
      setTouched({
        name: false,
        amount: false,
        numPayments: false,
        startDate: false,
      });
    } else if (visible && !entry) {
      // Adding new entry
      setName("");
      setAmount("");
      setNumPayments("");
      setFrequency("Monthly");
      setStartDate(toLocalISODate(new Date()));
      setNotes("");
      setAutoAdvance(false);
      setShowPreview(false);
      setTouched({
        name: false,
        amount: false,
        numPayments: false,
        startDate: false,
      });
    }
  }, [visible, entry]);

  // Modal animations
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

  useEffect(() => {
    Animated.spring(previewAnim, {
      toValue: showPreview && canSave ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [showPreview, canSave]);

  // Input sanitization
  const sanitizeAmount = (value: string) => {
    if (/^\d*\.?\d*$/.test(value)) setAmount(value);
  };

  const sanitizeNumPayments = (value: string) => {
    if (/^\d*$/.test(value)) setNumPayments(value);
  };

  useEffect(() => {
    if (error) {
      setSnackbar({ visible: true, message: error, type: "error" });
    }
  }, [error]);

  const fromLocalISO = (iso: string) => new Date(iso + "T00:00:00");

  const generateSchedule = (
    paymentAmount: number,
    numPayments: number,
    startDate: string,
    frequency: Frequency
  ) => {
    const payments: { dueDate: string; amount: number; paid: boolean }[] = [];

    const start = fromLocalISO(startDate);

    for (let i = 0; i < numPayments; i++) {
      const nextDate = new Date(start);

      switch (frequency) {
        case "Weekly":
          nextDate.setDate(start.getDate() + i * 7);
          break;
        case "Bi-Weekly":
          nextDate.setDate(start.getDate() + i * 14);
          break;
        case "Bi-Monthly": // every 2 months
          nextDate.setMonth(start.getMonth() + i * 2);
          break;
        case "Monthly":
          nextDate.setMonth(start.getMonth() + i);
          break;
        case "One-time":
        default:
          if (i === 0) {
            nextDate.setMonth(start.getMonth());
          } else {
            continue; // only one payment
          }
          break;
      }

      payments.push({
        dueDate: toLocalISODate(nextDate),
        amount: paymentAmount,
        paid: false,
      });
    }

    return payments;
  };

  const previewSummary = (() => {
    if (!canSave) return null;
    const num = parseInt(numPayments);
    const payment = parseFloat(amount);
    const schedule = generateSchedule(payment, num, startDate, frequency);
    const total = payment * num;
    if (!schedule.length) return null;

    const first = schedule[0].dueDate;
    const last = schedule[schedule.length - 1].dueDate;
    const totalPaid = (schedule.length * schedule[0].amount).toFixed(2);

    return { num, totalPaid, first, last };
  })();

  const handleSave = async () => {
    if (!canSave) return;

    let paymentAmount = parseFloat(amount);

    if (isXof && eurToCadRate > 0) {
      const EUR_PER_XOF = 1 / 655.957;
      const eurAmount = paymentAmount * EUR_PER_XOF;
      const cadAmount = eurAmount * eurToCadRate;
      paymentAmount = cadAmount;
    }

    const num = parseInt(numPayments, 10);
    const payments = generateSchedule(paymentAmount, num, startDate, frequency);

    const newEntry: Entry = {
      id: entry?.id ?? uuidv4(),
      name: name.trim(),
      amount: paymentAmount * num,
      isInstallment: true,
      numPayments: num,
      frequency,
      startDate,
      notes: notes.trim() || undefined,
      autoAdvance,
      payments,
    };

    if (entry) await updateEntry(entry.id, newEntry);
    else await addEntry(newEntry);

    onDismiss();
  };

  // Mark field as touched
  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
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
            isWeb && isWideScreen && { maxWidth: 900 },
            isWeb && !isWideScreen && { maxWidth: 600 },
          ]}
        >
          <Surface
            style={[
              stylesPortal.surface,
              { backgroundColor: theme.colors.surface },
              { maxHeight: isWeb ? screenHeight * 0.85 : screenHeight * 0.8 },
            ]}
          >
            {/* Header */}
            <View style={stylesPortal.header}>
              <Text style={stylesPortal.headerTitle}>
                {entry ? "Edit Installment" : "Add Installment"}
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
              keyboardShouldPersistTaps="handled"
            >
              {/* Two-column layout for wide screens */}
              <View
                style={{
                  flexDirection: isWideScreen ? "row" : "column",
                  gap: tokens.spacing.lg,
                }}
              >
                {/* Left Column: Form Fields */}
                <View style={{ flex: isWideScreen ? 1 : undefined }}>
                  {/* SECTION: Basic Information */}
                  <Text
                    style={[
                      stylesPortal.sectionTitle,
                      { color: theme.colors.primary },
                    ]}
                  >
                    Basic Information
                  </Text>

                  <TextInput
                    label="Name *"
                    value={name}
                    onChangeText={setName}
                    onBlur={() => handleBlur("name")}
                    mode="outlined"
                    dense
                    error={touched.name && name.trim() === ""}
                    style={{ marginBottom: tokens.spacing.xs }}
                  />
                  {touched.name && name.trim() === "" && (
                    <HelperText type="error" visible>
                      Name is required
                    </HelperText>
                  )}

                  <TextInput
                    label="Amount per Payment *"
                    value={amount}
                    onChangeText={sanitizeAmount}
                    onBlur={() => handleBlur("amount")}
                    keyboardType="numeric"
                    mode="outlined"
                    dense
                    error={
                      touched.amount &&
                      (amount === "" ||
                        isNaN(parseFloat(amount)) ||
                        parseFloat(amount) <= 0)
                    }
                    style={{ marginBottom: tokens.spacing.xs }}
                  />
                  {touched.amount &&
                    amount !== "" &&
                    isNaN(parseFloat(amount)) && (
                      <HelperText type="error" visible>
                        Enter a valid number
                      </HelperText>
                    )}
                  {touched.amount &&
                    amount !== "" &&
                    !isNaN(parseFloat(amount)) &&
                    parseFloat(amount) <= 0 && (
                      <HelperText type="error" visible>
                        Amount must be greater than 0
                      </HelperText>
                    )}
                  <View style={stylesPortal.checkboxRow}>
                    <Checkbox
                      status={isXof ? "checked" : "unchecked"}
                      onPress={() => setIsXof(!isXof)}
                    />
                    <Text style={{ flex: 1 }}>
                      Amount is in XOF (convert to CAD)
                    </Text>
                  </View>
                  {isXof && eurToCadRate > 0 && (
                    <Text
                      variant="bodySmall"
                      style={{ color: theme.colors.secondary }}
                    >
                      Current EUR→CAD rate: {eurToCadRate.toFixed(4)}
                    </Text>
                  )}
                  {isXof && (
                    <Button
                      icon="refresh"
                      mode="outlined"
                      loading={loading}
                      onPress={() => refresh()}
                    >
                      Refresh rate
                    </Button>
                  )}

                  {/* SECTION: Installment Details */}
                  <Divider style={{ marginVertical: tokens.spacing.md }} />
                  <Text
                    style={[
                      stylesPortal.sectionTitle,
                      { color: theme.colors.primary },
                    ]}
                  >
                    Installment Details
                  </Text>

                  <View
                    style={{
                      flexDirection: isWideScreen ? "row" : "column",
                      gap: tokens.spacing.md,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <DatePicker
                        label="Start Date *"
                        value={startDate}
                        onChange={(date) => {
                          setStartDate(date);
                          handleBlur("startDate");
                        }}
                      />
                      {touched.startDate && !startDate && (
                        <HelperText type="error" visible>
                          Start date is required
                        </HelperText>
                      )}
                    </View>

                    <View style={{ flex: 1 }}>
                      <TextInput
                        label="Number of Payments *"
                        value={numPayments}
                        onChangeText={sanitizeNumPayments}
                        onBlur={() => handleBlur("numPayments")}
                        keyboardType="numeric"
                        mode="outlined"
                        dense
                        error={
                          touched.numPayments &&
                          (numPayments === "" || parseFloat(numPayments) <= 1)
                        }
                      />
                      {touched.numPayments &&
                        numPayments !== "" &&
                        parseFloat(numPayments) <= 1 && (
                          <HelperText type="error" visible>
                            Must be at least 2 payments
                          </HelperText>
                        )}
                    </View>
                  </View>

                  <View style={stylesPortal.checkboxRow}>
                    <Checkbox
                      status={autoAdvance ? "checked" : "unchecked"}
                      onPress={() => setAutoAdvance((s) => !s)}
                    />
                    <Text style={{ flex: 1 }}>
                      Auto-advance due date after payment
                    </Text>
                  </View>

                  {/* SECTION: Scheduling */}
                  <Divider style={{ marginVertical: tokens.spacing.md }} />
                  <Text
                    style={[
                      stylesPortal.sectionTitle,
                      { color: theme.colors.primary },
                    ]}
                  >
                    Payment Frequency
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: tokens.spacing.sm,
                      marginBottom: tokens.spacing.xs,
                    }}
                  >
                    {FREQUENCIES.map((f) => {
                      const isSelected = frequency === f.label;
                      return (
                        <Chip
                          key={f.label}
                          selected={isSelected}
                          onPress={() => setFrequency(f.label)}
                          mode={isSelected ? "flat" : "outlined"}
                          selectedColor={
                            isSelected ? theme.colors.onPrimary : undefined
                          }
                          style={{
                            backgroundColor: isSelected
                              ? theme.colors.primary
                              : theme.colors.elevation.level2,
                          }}
                          textStyle={{
                            fontWeight: isSelected ? "600" : "400",
                            color: isSelected
                              ? theme.colors.onPrimary
                              : theme.colors.onSurfaceVariant,
                          }}
                        >
                          {f.label}
                        </Chip>
                      );
                    })}
                  </View>

                  {/* SECTION: Additional Info */}
                  <Divider style={{ marginVertical: tokens.spacing.md }} />
                  <TextInput
                    label="Notes (optional)"
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    numberOfLines={3}
                    mode="outlined"
                    dense
                    style={{ marginBottom: tokens.spacing.md }}
                  />

                  {/* Action Buttons */}
                  <View style={stylesPortal.buttonRow}>
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

                  {/* Toggle preview button (mobile only) */}
                  {!isWideScreen && canSave && (
                    <Button
                      mode="text"
                      onPress={() => setShowPreview(!showPreview)}
                      style={{ marginTop: tokens.spacing.sm }}
                    >
                      {showPreview ? "Hide Preview" : "Show Preview"}
                    </Button>
                  )}
                </View>

                {/* Right Column: Preview (wide screens) or conditional (mobile) */}
                {((isWideScreen && canSave) ||
                  (!isWideScreen && showPreview && canSave)) && (
                  <Animated.View
                    style={{
                      flex: isWideScreen ? 1 : undefined,
                      opacity: previewAnim,
                      transform: [{ scale: previewAnim }],
                    }}
                  >
                    <Text style={stylesPortal.sectionTitle}>Preview</Text>
                    <InstallmentCard
                      item={{
                        id: "preview",
                        name,
                        amount: parseFloat(amount) || 0,
                        frequency,
                        isInstallment: true,
                        numPayments: parseFloat(numPayments) || 0,
                        startDate,
                        autoAdvance,
                        payments: [
                          {
                            dueDate: startDate || toLocalISODate(new Date()),
                            amount: parseFloat(amount) || 0,
                            paid: false,
                          },
                        ],
                      }}
                      onMarkPaid={() => {}}
                      isPreview={true}
                    />
                    {previewSummary && (
                      <View style={{ marginBottom: tokens.spacing.sm }}>
                        <Text variant="bodyMedium">
                          {previewSummary.num} payments, total{" "}
                          {previewSummary.totalPaid}
                        </Text>
                        <Text
                          variant="bodySmall"
                          style={{ color: theme.colors.secondary }}
                        >
                          {previewSummary.first} → {previewSummary.last}
                        </Text>
                      </View>
                    )}
                  </Animated.View>
                )}
              </View>
            </ScrollView>
          </Surface>
        </Animated.View>
      </Animated.View>
      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar((s) => ({ ...s, visible: false }))}
        duration={4000}
        style={{
          backgroundColor:
            snackbar.type === "error"
              ? theme.colors.errorContainer
              : theme.colors.inverseSurface,
        }}
        action={{
          label: "OK",
          onPress: () => setSnackbar((s) => ({ ...s, visible: false })),
        }}
      >
        <Text
          style={{
            color:
              snackbar.type === "error"
                ? theme.colors.onErrorContainer
                : theme.colors.inverseOnSurface,
          }}
        >
          {snackbar.message}
        </Text>
      </Snackbar>
    </Portal>
  );
}

const stylesPortal = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000080",
    justifyContent: Platform.OS === "web" ? "center" : "flex-end",
  },
  surface: {
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: Platform.OS === "web" ? 0 : 32,
  },
  webContainer: {
    alignSelf: "center",
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: tokens.spacing.md,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    flexShrink: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: tokens.spacing.sm,
  },
  scrollContent: {
    paddingBottom: tokens.spacing.md,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: tokens.spacing.sm,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: tokens.spacing.md,
    marginTop: tokens.spacing.md,
    flexWrap: "wrap",
  },
});
