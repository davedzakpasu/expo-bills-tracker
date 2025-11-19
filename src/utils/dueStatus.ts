/**
 * Shared helper to get due-date based status info
 * Works for both bills and installments.
 */
export const getDueStatusInfo = (nextDueDate?: string) => {
  if (!nextDueDate)
    return { label: "No Due Date", color: "#9E9E9E", diffDays: null };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(nextDueDate);
  dueDate.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil(
    (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  let status: string;
  let color: string;

  if (diffDays < 0) {
    status = "Overdue";
    color = "#E53935";
  } else if (diffDays === 0) {
    status = "Due Today";
    color = "#E53935";
  } else if (diffDays <= 3) {
    status = "Due Soon";
    color = "#FF9800";
  } else {
    status = "Upcoming";
    color = "#00B16A";
  }
  return { label: status, color, diffDays };
};

/**
 * Optional: make it more human-friendly for tooltips or labels
 */
export const getRelativeStatusLabel = (diffDays: number | null): string => {
  if (diffDays === null || diffDays === 0) return "";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays > 1) return `in ${diffDays} days`;
  const daysLate = Math.abs(diffDays);
  return daysLate === 1 ? "1 day late" : `${daysLate} days late`;
};
