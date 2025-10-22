/**
 * Shared helper to get due-date based status info
 * Works for both bills and installments.
 */
export const getDueStatusInfo = (nextDueDate?: string) => {
  if (!nextDueDate)
    return { label: "No Due Date", color: "#9E9E9E", diffDays: null };

  const today = new Date();
  const dueDate = new Date(nextDueDate);
  const diffDays = Math.ceil(
    (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  let status = "On Time";
  let color = "#00B16A";

  if (diffDays < 0) {
    status = "Overdue";
    color = "#E53935";
  } else if (diffDays <= 3) {
    status = "Due Soon";
    color = "#FF9800";
  } else if (diffDays > 3) {
    status = "Upcoming";
    color = "#1E88E5";
  }

  return { label: status, color, diffDays };
};

/**
 * Optional: make it more human-friendly for tooltips or labels
 */
export const getRelativeStatusLabel = (diffDays: number | null): string => {
  if (diffDays === null) return "";
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  if (diffDays > 1) return `In ${diffDays} days`;
  if (diffDays === -1) return "1 day late";
  return `${Math.abs(diffDays)} days late`;
};
