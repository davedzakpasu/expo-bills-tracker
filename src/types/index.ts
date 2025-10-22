// Frequencies
export type Frequency =
  | "Weekly"
  | "Bi-Weekly"
  | "Monthly"
  | "Bi-Monthly"
  | "One-time";

export const FREQUENCIES = [
  { label: "Weekly", days: 7 },
  { label: "Bi-Weekly", days: 14 },
  { label: "Monthly", days: 30 },
  { label: "Bi-Monthly", days: 60 },
  { label: "One-time", days: 0 },
] as const;

// Shared Bill/Installment Base
export type BillMode = "bill" | "installment";

export interface BaseEntry {
  id: string;
  name: string;
  amount: number;
  frequency: Frequency;
  startDate?: string;
  nextDueDate?: string;
  endDate?: string;
  notes?: string;
  lastPaymentDate?: string;
  status?: "Active" | "Completed" | "Overdue" | "Pending";
  autoAdvance?: boolean;
}

// Bill Type (Recurring payments)
export interface Bill extends BaseEntry {
  isInstallment?: false;
  numPayments?: number;
}

// Installment Type (Amortized or multi-payment items)
export interface Installment extends BaseEntry {
  isInstallment: true;
  numPayments: number;
  payments: { dueDate: string; amount: number; paid: boolean }[];
  remainingBalance?: number;
  progress?: number; // 0–100%
}

// Entry Union and User Profile
export type Entry = Bill | Installment;

export interface UserProfile {
  nickname?: string;
}

// Section Config (used in Dashboard)
export interface SectionConfig {
  title: string;
  data: Entry[];
  emptyTitle: string;
  emptyMessage: string;
  actionLabel: string;
  mode: BillMode;
}
