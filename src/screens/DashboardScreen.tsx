import DashboardFooter from "@components/DashboardFooter";
import DashboardSummary from "@components/DashboardSummary";
import EntrySection from "@components/EntrySection";
import { Spacer } from "@components/Spacer";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  ScrollView,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";
import BillModal from "src/modals/BillModal";
import InstallmentModal from "src/modals/InstallmentModal";
import { useAppContext } from "../context/AppContext";
import { useThemeContext } from "../context/ThemeContext";
import { createAppStyles, tokens } from "../theme/styles";
import { billmode, Entry, SectionConfig } from "../types";

const createSectionsConfig = (
  bills: Entry[],
  installmentBills: Entry[]
): SectionConfig[] => [
  {
    title: "Bills",
    data: bills,
    emptyTitle: "No bills yet",
    emptyMessage: "Add a recurring or single bill to get started.",
    actionLabel: "Add Bill",
    mode: "bill",
  },
  {
    title: "Installments",
    data: installmentBills,
    emptyTitle: "No installments yet",
    emptyMessage: "Add a multi-payment item to track your installments.",
    actionLabel: "Add Installment",
    mode: "installment",
  },
];

export default function DashboardScreen({ navigation }: any) {
  const {
    bills,
    user,
    markPaid,
    updateEntry: updateBill,
    addEntry: addBill,
    resetApp,
  } = useAppContext();
  const theme = useTheme();
  const styles = createAppStyles(theme);
  const { mode, toggleTheme } = useThemeContext();
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | undefined>(
    undefined
  );
  const [billMode, setBillMode] = useState<"bill" | "installment">("bill");
  const isWideScreen = width >= 768;

  const [selected, setSelected] = useState<null | (typeof bills)[0]>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);

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
  }, [user?.nickname]);

  /** Derived Data **/
  const {
    regularBills,
    installmentBills,
    totalMonthly,
    totalRemaining,
    overdue,
  } = useMemo(() => {
    const regular = bills.filter((b) => !b.isInstallment);
    const installments = bills.filter((b) => b.isInstallment);

    const monthly = regular.reduce((sum, b) => sum + (b.amount ?? 0), 0);
    const remaining = installments.reduce(
      (sum, b) => sum + ((b as any).remainingBalance ?? 0),
      0
    );
    const overdueCount = bills.filter(
      (b) => b.nextDueDate && new Date(b.nextDueDate) < new Date()
    ).length;

    return {
      regularBills: regular,
      installmentBills: installments,
      totalMonthly: monthly,
      totalRemaining: remaining,
      overdue: overdueCount,
    };
  }, [bills]);

  const sections = createSectionsConfig(regularBills, installmentBills);

  const handleExit = () => {
    resetApp();
    navigation.reset({
      index: 0,
      routes: [{ name: "Onboarding" }],
    });
  };

  const openAddModal = (mode: billmode) => {
    setEditingEntry(undefined);
    setBillMode(mode);
    setModalVisible(true);
  };

  const openEditModal = (entry: Entry) => {
    setEditingEntry(entry);
    setBillMode(entry.isInstallment ? "installment" : "bill");
    setModalVisible(true);
  };

  const handleModalDismiss = () => {
    setModalVisible(false);
    setEditingEntry(undefined);
  };

  const handleCardPress = (entry: any) => {
    setSelected(entry);
    setDetailsVisible(true);
  };

  /** Section renderer **/
  // const renderSection = (
  //   title: string,
  //   data: Entry[],
  //   displayedData: Entry[],
  //   // expanded: boolean,
  //   // setExpanded: (v: boolean) => void,
  //   emptyTitle: string,
  //   emptyMsg: string,
  //   actionLabel: string,
  //   onAddPress: () => void
  // ) => {
  //   const visibleItems = data.slice(0, 3);
  //   const hasMore = data.length > 3;
  //   const [expanded, setExpanded] = useState(false);
  //   const itemsToRender = expanded ? data : visibleItems;

  //   return (
  //     <View style={styles.card}>
  //       <View style={styles.sectionHeader}>
  //         <Text style={styles.title}>{title}</Text>
  //       </View>

  //       {data.length === 0 ? (
  //         <EmptyState
  //           title="Nothing yet"
  //           message="Add a new item to get started."
  //           actionLabel="Add"
  //           onActionPress={onAddPress}
  //         />
  //       ) : (
  //         <>
  //           <FlatList
  //             data={itemsToRender}
  //             keyExtractor={(item) => item.id}
  //             renderItem={({ item }) => (
  //               <BillCard
  //                 item={item}
  //                 onMarkPaid={() => markPaid(item.id)}
  //                 onEdit={() => openEditModal(item)}
  //                 onPress={() => handleCardPress(item)}
  //               />
  //             )}
  //             scrollEnabled={false}
  //             ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
  //           />

  //           {hasMore && (
  //             <Button
  //               onPress={() => setExpanded(!expanded)}
  //               textColor={theme.colors.primary}
  //               style={styles.seeAllButton}
  //             >
  //               {expanded ? "Show less" : "See all"}
  //             </Button>
  //           )}
  //         </>
  //       )}
  //     </View>
  //   );
  // };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.elevation.level2 }}>
      {/* Sticky Header */}
      <View style={styles.stickyHeader}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name="apps-outline"
            size={28}
            color={theme.colors.primary}
            style={{ marginRight: tokens.spacing.md * 0.7 }}
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
          <IconButton
            icon={() => (
              <Ionicons
                name={effectiveMode === "light" ? "sunny" : "moon"}
                size={24}
                color={theme.colors.primary}
              />
            )}
            style={{ marginHorizontal: tokens.spacing.md * 0.3 }}
            onPress={toggleTheme}
          />

          <IconButton
            icon={() => (
              <Ionicons
                name="settings-outline"
                size={24}
                color={theme.colors.primary}
              />
            )}
            style={{ marginHorizontal: tokens.spacing.md * 0.3 }}
            onPress={() => navigation.navigate("Settings")}
          />

          <IconButton
            icon={() => (
              <Ionicons
                name="exit-outline"
                size={24}
                color={theme.colors.primary}
              />
            )}
            style={{ marginHorizontal: tokens.spacing.md * 0.3 }}
            onPress={handleExit}
          />
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.screen}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <Text style={styles.title}>{greeting}</Text>

        {/* Summary */}
        <DashboardSummary
          totalMonthly={totalMonthly}
          totalRemaining={totalRemaining}
          overdue={overdue}
        />
        <Spacer />

        {/* Sections Container - Responsive Layout */}
        <View
          style={{
            flexDirection: isWideScreen ? "row" : "column",
            gap: tokens.spacing.md,
            width: "100%",
          }}
        >
          {sections.map((section) => (
            <View
              key={section.mode}
              style={{
                flex: isWideScreen ? 1 : undefined,
                width: isWideScreen ? undefined : "100%",
              }}
            >
              <EntrySection
                title={section.title}
                data={section.data}
                emptyTitle={section.emptyTitle}
                emptyMessage={section.emptyMessage}
                actionLabel={section.actionLabel}
                onAddPress={() => openAddModal(section.mode)}
                onEdit={openEditModal}
              />
            </View>
          ))}
        </View>
        <Spacer />
        <DashboardFooter totalBills={bills.length} lastUpdated={undefined} />
      </ScrollView>

      {/* Add / Edit Bill Modal */}
      <BillModal
        visible={modalVisible && billMode === "bill"}
        onDismiss={handleModalDismiss}
        entry={
          editingEntry && !editingEntry.isInstallment ? editingEntry : undefined
        }
      />

      {/* Add / Edit Installment Modal */}
      <InstallmentModal
        visible={modalVisible && billMode === "installment"}
        onDismiss={handleModalDismiss}
        entry={
          editingEntry && editingEntry.isInstallment ? editingEntry : undefined
        }
      />
    </View>
  );
}
