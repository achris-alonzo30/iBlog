import { format } from "date-fns";

export function formatDate(dateString) {
  const formattedDate = format(new Date(dateString), "MMMM d, yyyy");
  return formattedDate;
}

