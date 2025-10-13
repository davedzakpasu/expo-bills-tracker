export type Frequency = "Monthly" | "Bi-Monthly" | "Weekly" | "One-time";

type Bill = {
  id: string;
  name: string;
  amount: number; // recurring payment amount
  remainingBalance?: number;
  frequency: Frequency;
  nextDueDate?: string; // ISO date string yyyy-mm-dd
  endDate?: string;
  notes?: string;
  isInstallment?: false;
  autoAdvance?: boolean;
};

type Installment = {
  id: string;
  name: string;
  amount: number; // installment payment amount
  remainingBalance?: number; // keeps track
  frequency: Frequency;
  nextDueDate?: string;
  endDate?: string; // when installments end
  lastPaymentDate?: string;
  status?: string;
  isInstallment: true;
  autoAdvance?: boolean;
  payments?: { dueDate: string; amount: number; paid: boolean }[];
};

export type UserProfile = {
  nickname?: string;
};

export type Entry = Bill | Installment;
