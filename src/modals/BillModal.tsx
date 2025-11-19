import { DatePicker } from "@components/DatePicker";
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
  Chip,
  Divider,
  HelperText,
  IconButton,
  Portal,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { createAppStyles, tokens } from "src/theme/styles";
import { v4 as uuidv4 } from "uuid";
import BillCard from "../components/cards/BillCard";
import { useAppContext } from "../context/AppContext";
import { Entry } from "../types";

const FREQUENCIES = [
  { label: "Weekly", days: 7 },
  { label: "Bi-Weekly", days: 14 },
  { label: "Monthly", days: 30 },
  { label: "Bi-Monthly", days: 60 },
] as const;

type Props = {
  visible: boolean;
  onDismiss: () => void;
  entry?: Entry;
};

export default function BillModal({ visible, onDismiss, entry }: Props) {
  const theme = useTheme();
  const styles = createAppStyles(theme);
  const { addEntry: addBill, updateEntry: updateBill } = useAppContext();
  const { height: screenHeight } = Dimensions.get("window");
  const { width: windowWidth } = useWindowDimensions();

  const [name, setName] = useState(entry?.name ?? "");
  const [amount, setAmount] = useState(entry?.amount?.toString() ?? "");
  const [frequency, setFrequency] = useState(entry?.frequency ?? "Monthly");
  const [nextDueDate, setNextDueDate] = useState(
    entry?.nextDueDate ?? toLocalISODate(new Date())
  );
  const [autoAdvance, setAutoAdvance] = useState(entry?.autoAdvance ?? false);
  const [showPreview, setShowPreview] = useState(false);

  const isWeb = Platform.OS === "web";
  const isWideScreen = windowWidth >= 768;

  const canSave = name.trim() !== "" && parseFloat(amount) > 0;

  // Animated values
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (canSave && (isWideScreen || showPreview)) {
      previewAnim.setValue(0);
      Animated.timing(previewAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      previewAnim.setValue(0);
    }
  }, [canSave, isWideScreen, showPreview]);

  useEffect(() => {
    if (isWideScreen) {
      setShowPreview(true);
    }
  }, [isWideScreen]);

  // ADDED: Reset form when modal closes or entry changes
  useEffect(() => {
    if (visible && entry) {
      setName(entry.name ?? "");
      setAmount(entry.amount?.toString() ?? "");
      setFrequency(entry.frequency ?? "Monthly");
      setNextDueDate(entry.nextDueDate ?? toLocalISODate(new Date()));
      setAutoAdvance(entry.autoAdvance ?? false);
    } else if (visible && !entry) {
      setName("");
      setAmount("");
      setFrequency("Monthly");
      setNextDueDate(toLocalISODate(new Date()));

      setAutoAdvance(false);
      setShowPreview(false);
    }
  }, [visible, entry]);

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

  const previewAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(previewAnim, {
      toValue: showPreview ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [showPreview]);

  const sanitizeAmount = (value: string) => {
    if (/^\d*\.?\d*$/.test(value)) setAmount(value);
  };

  const handleSave = async () => {
    try {
      if (!canSave) return;

      const newEntry: Entry = {
        id: entry?.id ?? uuidv4(),
        name: name.trim(),
        amount: parseFloat(amount),
        frequency,
        nextDueDate: nextDueDate,
        autoAdvance,
      };

      if (entry) {
        await updateBill(entry.id, newEntry);
      } else {
        await addBill(newEntry);
      }
      onDismiss();
    } catch (err) {
      console.error("handleSave error:", err);
    }
  };

  useEffect(() => {
    if (!canSave) setShowPreview(false);
  }, [canSave]);

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
                {entry ? `Edit Bill` : `Add New Bill`}
              </Text>
              <IconButton
                icon="close"
                size={26}
                onPress={onDismiss}
                iconColor={theme.colors.onSurface}
                style={{
                  backgroundColor: theme.dark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                  borderRadius: 999,
                }}
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
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      marginBottom: tokens.spacing.sm,
                      color: theme.colors.primary,
                    }}
                  >
                    Basic Information
                  </Text>
                  <TextInput
                    label="Name"
                    value={name}
                    onChangeText={setName}
                    mode="outlined"
                    dense
                    style={{ marginBottom: tokens.spacing.sm }}
                  />
                  <TextInput
                    label="Amount"
                    value={amount}
                    onChangeText={sanitizeAmount}
                    keyboardType="numeric"
                    mode="outlined"
                    error={amount !== "" && isNaN(parseFloat(amount))}
                    dense
                    style={{ marginBottom: tokens.spacing.xs }}
                  />
                  {amount !== "" && isNaN(parseFloat(amount)) && (
                    <HelperText type="error">Enter a valid number</HelperText>
                  )}

                  {/* SECTION: Scheduling */}
                  <Divider style={{ marginVertical: tokens.spacing.md }} />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      marginBottom: tokens.spacing.sm,
                      color: theme.colors.primary,
                    }}
                  >
                    Scheduling
                  </Text>

                  {/* Frequency */}
                  <Text
                    style={{
                      fontSize: 14,
                      marginBottom: tokens.spacing.xs,
                      color: theme.colors.onSurfaceVariant,
                    }}
                  >
                    Frequency
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: tokens.spacing.sm,
                      marginBottom: tokens.spacing.md,
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

                  <DatePicker
                    label="Next Due Date"
                    value={nextDueDate}
                    onChange={setNextDueDate}
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
                {canSave && (isWideScreen || showPreview) && (
                  <View
                    style={{
                      minHeight: 180,
                      flex: isWideScreen ? 1 : undefined,
                    }}
                  >
                    <Animated.View
                      style={{
                        flex: isWideScreen ? 1 : undefined,
                        opacity: previewAnim,
                        transform: [{ scale: previewAnim }],
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          marginBottom: tokens.spacing.sm,
                          color: theme.colors.primary,
                        }}
                      >
                        Preview
                      </Text>
                      <BillCard
                        item={{
                          id: "preview",
                          name,
                          amount: parseFloat(amount) || 0,
                          frequency,
                          nextDueDate,
                          autoAdvance,
                        }}
                        onMarkPaid={() => {}}
                        isPreview={true}
                      />
                    </Animated.View>
                  </View>
                )}
              </View>
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
    justifyContent: Platform.OS === "web" ? "center" : "flex-end",
  },
  surface: {
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: Platform.OS === "web" ? 0 : 32,
    maxHeight: "90%",
  },
  webContainer: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 600,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: tokens.spacing.md,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", flexShrink: 1 },
  scrollContent: {
    paddingBottom: tokens.spacing.md,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: tokens.spacing.xs,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: tokens.spacing.md,
    marginTop: tokens.spacing.md,
    flexWrap: "wrap",
  },
});
