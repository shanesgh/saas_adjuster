export const addOrdinalSuffix = (date: string | number | Date) => {
  const day = new Date(date).getDate();
  const suffix = ["th", "st", "nd", "rd"][
    day % 10 > 3 || [11, 12, 13].includes(day) ? 0 : day % 10
  ];
  return `${new Date(date).toLocaleDateString("en-US", {
    month: "long",
  })} ${day}${suffix}, ${new Date(date).getFullYear()}`;
};
