import {
  BillSortKey,
  compareDates,
  Entry,
  InstallmentSortKey,
} from "../types/index";

export const makeBillComparator = (key: BillSortKey) => {
  return (a: Entry, b: Entry) => {
    // Overdue first (for any sort mode)
    const aOverdue = a.nextDueDate && new Date(a.nextDueDate) < new Date();
    const bOverdue = b.nextDueDate && new Date(b.nextDueDate) < new Date();
    if (aOverdue !== bOverdue) return aOverdue ? -1 : 1;

    switch (key) {
      case "amount":
        return (b.amount ?? 0) - (a.amount ?? 0); // high → low
      case "name":
        return a.name.localeCompare(b.name);
      case "nextDue":
      default:
        return compareDates(a.nextDueDate, b.nextDueDate);
    }
  };
};

export const makeInstallmentComparator = (key: InstallmentSortKey) => {
  return (a: Entry, b: Entry) => {
    const aOverdue = a.nextDueDate && new Date(a.nextDueDate) < new Date();
    const bOverdue = b.nextDueDate && new Date(b.nextDueDate) < new Date();
    if (aOverdue !== bOverdue) return aOverdue ? -1 : 1;

    switch (key) {
      case "remaining":
        return (
          ((b as any).remainingBalance ?? 0) -
          ((a as any).remainingBalance ?? 0)
        );
      case "name":
        return a.name.localeCompare(b.name);
      case "nextDue":
      default:
        return compareDates(a.nextDueDate, b.nextDueDate);
    }
  };
};
