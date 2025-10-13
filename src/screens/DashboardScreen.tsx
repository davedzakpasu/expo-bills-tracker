import DashboardSummary from "@components/DashboardSummary";
import { EmptyState } from "@components/EmptyState";
import { Spacer } from "@components/Spacer";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { FAB, Text, useTheme } from "react-native-paper";
import AddBillModal from "src/modals/AddBillModal";
import BillCard from "../components/BillCard";
import { useAppContext } from "../context/AppContext";
import { useThemeContext } from "../context/ThemeContext";
import { createAppStyles, metrics } from "../theme/styles";
import { Entry } from "../types";

export default function DashboardScreen({ navigation }: any) {
  const { bills, user, markPaid, updateBill, addBill, resetApp } =
    useAppContext();
  const theme = useTheme();
  const styles = createAppStyles(theme);
  const { mode, toggleTheme } = useThemeContext();
  const colorScheme = useColorScheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | undefined>(
    undefined
  );

  const [expandedBills, setExpandedBills] = useState(false);
  const [expandedInstallments, setExpandedInstallments] = useState(false);

  const effectiveMode: "light" | "dark" =
    mode === "system" ? (colorScheme === "dark" ? "dark" : "light") : mode;

  /** Greeting **/
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    const time =
      hour < 12
        ? "Good morning"
        : hour < 18
        ? "Good afternoon"
        : "Good evening";
    return `${time}, ${user?.nickname ?? "User"}`;
  }, [user]);

  /** Derived Data **/
  const regularBills = bills.filter((b) => !b.isInstallment);
  const installmentBills = bills.filter((b) => b.isInstallment);

  const displayedRegularBills = expandedBills
    ? regularBills
    : regularBills.slice(0, 3);
  const displayedInstallments = expandedInstallments
    ? installmentBills
    : installmentBills.slice(0, 3);

  const totalMonthly = regularBills.reduce((s, b) => s + (b.amount ?? 0), 0);
  const totalRemaining = installmentBills.reduce(
    (s, b) => s + ((b as any).remainingBalance ?? 0),
    0
  );
  const overdue = bills.filter(
    (b) => b.nextDueDate && new Date(b.nextDueDate) < new Date()
  ).length;

  const handleExit = () => {
    resetApp();
    navigation.reset({
      index: 0,
      routes: [{ name: "Onboarding" }],
    });
  };

  const openEditModal = (entry: Entry) => {
    setEditingEntry(entry);
    setModalVisible(true);
  };

  /** Section renderer **/
  const renderSection = (
    title: string,
    data: Entry[],
    displayedData: Entry[],
    expanded: boolean,
    setExpanded: (v: boolean) => void,
    emptyTitle: string,
    emptyMsg: string,
    actionLabel: string
  ) => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {data.length > 3 && (
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <Text style={styles.seeAll}>
              {expanded ? "Show Less" : "See All"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View
        style={[
          styles.listContainer,
          {
            borderRadius: metrics.radius,
            padding: metrics.spacing * 1.3,
            shadowColor: theme.dark ? "#000" : "#333",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: theme.dark ? 0.3 : 0.12,
            shadowRadius: 6,
            elevation: 4,
          },
        ]}
      >
        <FlatList
          data={displayedData}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <BillCard
              item={item}
              onMarkPaid={() => markPaid(item.id)}
              onEdit={() => openEditModal(item)}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              title={emptyTitle}
              message={emptyMsg}
              actionLabel={actionLabel}
              onActionPress={() => setModalVisible(true)}
            />
          }
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
      {/* Sticky Header */}
      <View style={styles.stickyHeader}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name="apps-outline"
            size={28}
            color={theme.colors.primary}
            style={{ marginRight: metrics.spacing * 0.7 }}
          />
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: theme.colors.primary,
            }}
          >
            Bills Tracker
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={toggleTheme}
            style={{ marginHorizontal: metrics.spacing * 0.5 }}
          >
            <Ionicons
              name={effectiveMode === "light" ? "moon" : "sunny"}
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Settings")}
            style={{ marginHorizontal: metrics.spacing * 0.5 }}
          >
            <Ionicons
              name="settings-outline"
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleExit}
            style={{ marginHorizontal: metrics.spacing * 0.5 }}
          >
            <Ionicons
              name="exit-outline"
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: metrics.spacing * 1.3,
          paddingBottom: metrics.spacing * 4,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <Text style={styles.greeting}>{greeting}</Text>

        {/* Summary */}
        <DashboardSummary
          totalMonthly={totalMonthly}
          totalRemaining={totalRemaining}
          overdue={overdue}
        />
        <Spacer />

        {/* Bills */}
        {renderSection(
          "Your Bills",
          regularBills,
          displayedRegularBills,
          expandedBills,
          setExpandedBills,
          "No bills yet",
          "Add a recurring or single bill to get started.",
          "Add Bill"
        )}

        {/* Installments */}
        {renderSection(
          "Your Installments",
          installmentBills,
          displayedInstallments,
          expandedInstallments,
          setExpandedInstallments,
          "No installments yet",
          "Add a multi-payment item to track your installments.",
          "Add Installment"
        )}
      </ScrollView>

      {/* Add / Edit Bill Modal */}
      <AddBillModal
        visible={modalVisible}
        onDismiss={() => {
          setModalVisible(false);
          setEditingEntry(undefined);
        }}
        entry={editingEntry}
      />

      {/* FAB */}
      <FAB
        style={{
          position: "absolute",
          right: metrics.spacing,
          bottom: metrics.spacing * 2,
          backgroundColor: theme.colors.primary,
        }}
        icon={({ size }) => (
          <Ionicons name="add" size={size} color={theme.colors.surface} />
        )}
        onPress={() => setModalVisible(true)}
      />
    </View>
  );
}
