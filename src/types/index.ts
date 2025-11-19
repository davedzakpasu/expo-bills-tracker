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

type EntrySectionBaseProps = {
  title: string;
  data: Entry[];
  emptyTitle: string;
  emptyMessage: string;
  actionLabel: string;
  onAddPress: () => void;
  onEdit: (entry: Entry) => void;
  onDelete: (id: string) => void;
};

type BillEntrySectionProps = EntrySectionBaseProps & {
  mode: "bill";
  sortKey: BillSortKey;
  onChangeSortKey: (key: BillSortKey) => void;
};

type InstallmentEntrySectionProps = EntrySectionBaseProps & {
  mode: "installment";
  sortKey: InstallmentSortKey;
  onChangeSortKey: (key: InstallmentSortKey) => void;
};

export type EntrySectionProps =
  | BillEntrySectionProps
  | InstallmentEntrySectionProps;

export type BillSortKey = "nextDue" | "amount" | "name";
export type InstallmentSortKey = "nextDue" | "remaining" | "name";

export const compareDates = (a?: string, b?: string) => {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return new Date(a).getTime() - new Date(b).getTime();
};
