import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { loadJSON, saveJSON } from "../hooks/useStorage";
import { Entry, UserProfile } from "../types";

type AppState = {
  bills: Entry[];
  user?: UserProfile | null;
  addBill: (item: Entry) => Promise<void>;
  updateBill: (id: string, patch: Partial<Entry>) => Promise<void>;
  markPaid: (id: string) => Promise<void>;
  deleteBill: (id: string) => Promise<void>;
  setUser: (u: UserProfile) => Promise<void>;
  resetApp: () => void;
};

const ctx = createContext<AppState>({} as AppState);

const STORAGE_KEYS = {
  BILLS: "@bills_tracker_bills_v1",
  USER: "@bills_tracker_user_v1",
};

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
  const addBill = async (item: Entry) => {
    setBills((prev) => [item, ...prev]);
  };

  // 🧩 Update bill
  const updateBill = async (id: string, patch: Partial<Entry>) => {
    setBills((prev) =>
      prev.map((b) => (b.id === id ? ({ ...b, ...patch } as Entry) : b))
    );
  };

  // ✅ Smart markPaid logic
  const markPaid = async (id: string) => {
    const target = bills.find((b) => b.id === id);
    if (!target) return;

    const now = new Date();

    if (target.isInstallment) {
      // --- INSTALLMENT LOGIC ---
      const inst = target as Entry;
      const newRemaining = Math.max(
        0,
        (inst.remainingBalance || 0) - inst.amount
      );

      const updates: Partial<Entry> = {
        remainingBalance: newRemaining,
        lastPaymentDate: now.toISOString().slice(0, 10),
      };

      if (newRemaining === 0) {
        updates.nextDueDate = undefined;
        updates.status = "Completed";
        Alert.alert("Installment", `${inst.name} fully paid.`);
      } else if (inst.nextDueDate) {
        const next = new Date(inst.nextDueDate);
        // Use frequency (in weeks or months)
        if (inst.frequency?.toLowerCase().includes("week")) {
          next.setDate(next.getDate() + 7);
        } else if (inst.frequency?.toLowerCase().includes("bi")) {
          next.setDate(next.getDate() + 14);
        } else {
          next.setMonth(next.getMonth() + 1);
        }
        updates.nextDueDate = next.toISOString().slice(0, 10);
      }

      await updateBill(id, updates);
    } else {
      // --- RECURRING BILL LOGIC ---
      const b = target as Entry;
      if (!b.nextDueDate) {
        Alert.alert("Bill", "No next due date set for this bill.");
        return;
      }

      const next = new Date(b.nextDueDate);
      const freq = b.frequency?.toLowerCase() || "monthly";

      if (freq.includes("week")) {
        next.setDate(next.getDate() + 7);
      } else if (freq.includes("bi")) {
        next.setDate(next.getDate() + 14);
      } else {
        next.setMonth(next.getMonth() + 1);
      }

      await updateBill(id, {
        nextDueDate: next.toISOString().slice(0, 10),
        lastPaymentDate: now.toISOString().slice(0, 10),
      });
    }
  };

  // 🗑 Delete bill/installment
  const deleteBill = async (id: string) => {
    setBills((prev) => prev.filter((b) => b.id !== id));
  };

  const setUser = async (u: UserProfile) => {
    setUserState(u);
  };

  const resetApp = () => {
    setUserState(null);
  };

  return (
    <ctx.Provider
      value={{
        bills,
        user,
        addBill,
        updateBill,
        markPaid,
        deleteBill,
        setUser,
        resetApp,
      }}
    >
      {children}
    </ctx.Provider>
  );
};

export const useAppContext = () => useContext(ctx);
