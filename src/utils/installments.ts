import { FREQUENCIES, Frequency, Installment } from "../types/index";
import { getRelativeStatusLabel } from "./dueStatus";

export function generateInstallmentSchedule(
  total: number,
  count: number,
  startDate: string,
  frequency: Frequency,
  paidCount = 0
) {
  const interval = FREQUENCIES.find((f) => f.label === frequency)?.days ?? 30;
  const amount = total / count;
  const installments = [];

  for (let i = 0; i < count; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i * interval);
    installments.push({
      id: crypto.randomUUID(),
      date: date.toISOString().slice(0, 10),
      amount,
      status: i < paidCount ? "paid" : "upcoming",
    });
  }

  return installments;
}

export const getInstallmentTotals = (item: Installment) => {
  const totalAmount = item.payments?.reduce((a, p) => a + p.amount, 0) ?? 0;
  const remainingBalance =
    item.payments?.filter((p) => !p.paid).reduce((a, p) => a + p.amount, 0) ??
    0;
  const paidCount = item.payments?.filter((p) => p.paid).length ?? 0;
  const totalCount = item.payments?.length ?? 0;
  const progress = totalCount > 0 ? (paidCount / totalCount) * 100 : 0;
  const nextDue = item.payments?.find((p) => !p.paid)?.dueDate ?? item.endDate;
  return {
    totalAmount,
    remainingBalance,
    progress,
    paidCount,
    totalCount,
    nextDue,
  };
};

export const updateInstallmentProgress = (item: Installment) => {
  const payments = item.payments ?? [];
  const totalCount = payments.length;
  const paidPayments = payments.filter((p) => p.paid);
  const unpaidPayments = payments.filter((p) => !p.paid);

  const paidCount = paidPayments.length;
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const remainingBalance = unpaidPayments.reduce((sum, p) => sum + p.amount, 0);

  const progressPercent = totalCount > 0 ? (paidCount / totalCount) * 100 : 0;

  const nextDue =
    unpaidPayments.length > 0 ? unpaidPayments[0].dueDate : undefined;

  const today = new Date();
  let status = "Active";
  let diffDays: number | null = null;

  if (totalCount === 0) {
    status = "Pending";
  } else if (paidCount === totalCount) {
    status = "Completed";
  } else if (nextDue) {
    const dueDate = new Date(nextDue);
    diffDays = Math.ceil(
      (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) status = "Overdue";
    else if (diffDays <= 3) status = "Due Soon";
    else status = "Upcoming";
  }

  const relativeLabel =
    diffDays !== null ? getRelativeStatusLabel(diffDays) : status;

  const statusInfo = {
    label:
      status === "Overdue" || status === "Due Soon" || status === "Upcoming"
        ? `${status} (${relativeLabel})`
        : status,
    color:
      status === "Overdue"
        ? "#E53935"
        : status === "Due Soon"
        ? "#FF9800"
        : status === "Completed"
        ? "#00B16A"
        : status === "Upcoming"
        ? "#1E88E5"
        : "#9E9E9E",
  };

  return {
    totalCount,
    paidCount,
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    remainingBalance: parseFloat(remainingBalance.toFixed(2)),
    nextDue,
    progressPercent,
    status,
    statusInfo,
  };
};
