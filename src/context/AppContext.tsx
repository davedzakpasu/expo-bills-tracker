import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { loadJSON, saveJSON } from "../hooks/useStorage";
import { Bill, Entry, Installment, UserProfile } from "../types";
import { updateInstallmentProgress } from "../utils/installments";

// ─────────────────────────────────────────────
// Context State Definition
// ─────────────────────────────────────────────

interface AppState {
  bills: Entry[];
  user?: UserProfile | null;
  addEntry: (item: Entry) => Promise<void>;
  updateEntry: <T extends Entry>(
    id: string,
    patch: Partial<T>
  ) => Promise<void>;
  markPaid: (id: string) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  setUser: (u: UserProfile) => Promise<void>;
  resetApp: () => void;
}

const AppContext = createContext<AppState>({} as AppState);

const STORAGE_KEYS = {
  BILLS: "@bills_tracker_bills_v1",
  USER: "@bills_tracker_user_v1",
};

// ─────────────────────────────────────────────
// AppProvider Implementation
// ─────────────────────────────────────────────

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [bills, setBills] = useState<Entry[]>([]);
  const [user, setUserState] = useState<UserProfile | null>(null);

  // 🧠 Load persisted data
  useEffect(() => {
    (async () => {
      const saved = await loadJSON<Entry[]>(STORAGE_KEYS.BILLS);
      if (saved) setBills(saved);
      const u = await loadJSON<UserProfile>(STORAGE_KEYS.USER);
      if (u) setUserState(u);
    })();
  }, []);

  // 💾 Persist on changes
  useEffect(() => {
    saveJSON(STORAGE_KEYS.BILLS, bills);
  }, [bills]);

  useEffect(() => {
    saveJSON(STORAGE_KEYS.USER, user);
  }, [user]);

  // ➕ Add new bill/installment
  const addEntry = async (item: Entry) => {
    setBills((prev) => [item, ...prev]);
  };

  // 🧩 Update existing entry
  const updateEntry = async <T extends Entry>(
    id: string,
    patch: Partial<T>
  ) => {
    setBills((prev) =>
      prev.map((b) => (b.id === id ? ({ ...b, ...patch } as Entry) : b))
    );
  };

  // ✅ Smart markPaid logic
  const markPaid = async (id: string) => {
    const target = bills.find((b) => b.id === id);
    if (!target) return;

    const now = new Date();

    // 🧾 INSTALLMENT LOGIC
    if (target.isInstallment) {
      const inst = target as Installment;
      if (!inst.payments?.length) {
        Alert.alert("Installment", "No payment schedule found.");
        return;
      }

      const payments = [...inst.payments];
      const nextUnpaidIndex = payments.findIndex((p) => !p.paid);

      if (nextUnpaidIndex === -1) {
        Alert.alert("Installment", `${inst.name} is already fully paid.`);
        return;
      }

      payments[nextUnpaidIndex].paid = true;

      const { remainingBalance, nextDue, progressPercent } =
        updateInstallmentProgress({ ...inst, payments });

      const updates: Partial<Installment> = {
        payments,
        lastPaymentDate: now.toISOString().slice(0, 10),
        nextDueDate: nextDue,
        status: nextDue ? "Active" : "Completed",
        remainingBalance,
        progress: progressPercent,
      };

      await updateEntry(id, updates);

      if (!nextDue) {
        Alert.alert("Installment", `${inst.name} is now fully paid!`);
      } else if (inst.autoAdvance !== false) {
        Alert.alert(
          "Installment",
          `Payment recorded. Next due: ${new Date(nextDue).toLocaleDateString(
            "fr"
          )}`
        );
      }

      return;
    }

    // 💸 RECURRING BILL LOGIC
    const bill = target as Bill;
    if (!bill.nextDueDate) {
      Alert.alert("Bill", "No next due date set for this bill.");
      return;
    }

    const next = new Date(bill.nextDueDate);
    const freq = bill.frequency.toLowerCase();

    if (freq.includes("bi-month")) next.setMonth(next.getMonth() + 2);
    else if (freq.includes("month")) next.setMonth(next.getMonth() + 1);
    else if (freq.includes("bi-week")) next.setDate(next.getDate() + 14);
    else if (freq.includes("week")) next.setDate(next.getDate() + 7);

    const updates: Partial<Bill> = {
      nextDueDate: next.toISOString().slice(0, 10),
      lastPaymentDate: now.toISOString().slice(0, 10),
    };

    await updateEntry(id, updates);

    Alert.alert("Bill", `${bill.name} marked as paid.`);
  };

  // 🗑 Delete entry (bill or installment)
  const deleteEntry = async (id: string) => {
    try {
      const updated = bills.filter((b) => b.id !== id);
      setBills(updated);
      await saveJSON(STORAGE_KEYS.BILLS, updated);
    } catch (error) {
      Alert.alert("Error", `Failed to delete the entry: ${id}`);
    }
  };

  // 👤 User Management
  const setUser = async (u: UserProfile) => setUserState(u);

  const resetApp = () => {
    setBills([]);
    setUserState(null);
  };

  return (
    <AppContext.Provider
      value={{
        bills,
        user,
        addEntry,
        updateEntry,
        markPaid,
        deleteEntry,
        setUser,
        resetApp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook
export const useAppContext = () => useContext(AppContext);
