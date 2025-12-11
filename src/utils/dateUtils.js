export const getStartOfWeek = (d = new Date()) => {
  const date = new Date(d);
  const day = date.getDay(); // 0 (Sun) to 6 (Sat)
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const getEndOfWeek = (d = new Date()) => {
  const date = getStartOfWeek(d);
  date.setDate(date.getDate() + 6);
  date.setHours(23, 59, 59, 999);
  return date;
};

export const isDateInThisWeek = (dateCheck, referenceDate = new Date()) => {
  const check = new Date(dateCheck).getTime();
  const start = getStartOfWeek(referenceDate).getTime();
  const end = getEndOfWeek(referenceDate).getTime();
  return check >= start && check <= end;
};

export const formatDateRange = (start, end) => {
  const options = { day: "numeric", month: "short" };
  return `${start.toLocaleDateString(
    "id-ID",
    options
  )} - ${end.toLocaleDateString("id-ID", options)}`;
};
