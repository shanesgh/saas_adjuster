import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export const addOrdinalSuffix = (date: string | number | Date) => {
  const day = new Date(date).getDate();
  const suffix = ["th", "st", "nd", "rd"][
    day % 10 > 3 || [11, 12, 13].includes(day) ? 0 : day % 10
  ];
  return `${new Date(date).toLocaleDateString("en-US", {
    month: "long",
  })} ${day}${suffix}, ${new Date(date).getFullYear()}`;
};

let cachedJsPDF: typeof import("jspdf").jsPDF | null = null;

export async function loadJsPDF() {
  if (!cachedJsPDF) {
    const module = await import("jspdf");
    cachedJsPDF = module.jsPDF;
  }
  return cachedJsPDF;
}
