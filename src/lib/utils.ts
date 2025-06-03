import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//function to turn number to words
const ones: string[] = [
  "",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];
const teens: string[] = [
  "",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];
const tens: string[] = [
  "",
  "ten",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];
const thousands: string[] = ["", "thousand", "million"];

export function numberToWords(amount: string | number): string {
  function convertToWords(num: number): string {
    if (num === 0) return "zero";
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100)
      return `${tens[Math.floor(num / 10)]}${
        num % 10 ? " " + ones[num % 10] : ""
      }`;
    if (num < 1000)
      return `${ones[Math.floor(num / 100)]} hundred${
        num % 100 ? " and " + convertToWords(num % 100) : ""
      }`;

    let word = "";
    let i = 0;
    while (num > 0) {
      let chunk = num % 1000;
      if (chunk) {
        word = `${convertToWords(chunk)}${
          thousands[i] ? " " + thousands[i] : ""
        }${word ? ", " + word : ""}`;
      }
      num = Math.floor(num / 1000);
      i++;
    }
    return word;
  }
  if (typeof amount === "string") amount = amount.replace(/,/g, "");

  const parsedAmount = parseFloat(amount as string);
  if (isNaN(parsedAmount) || parsedAmount < 0.01 || parsedAmount > 25000000) {
    return "Invalid amount. Must be between $0.01 and $25,000,000.";
  }

  const [dollars, cents] = parsedAmount.toFixed(2).split(".");
  const dollarText = convertToWords(parseInt(dollars));
  const centText = parseInt(cents) > 0 ? convertToWords(parseInt(cents)) : "";

  return `${dollarText} dollar${dollars !== "1" ? "s" : ""}${
    centText ? ` and ${centText} cent${cents !== "01" ? "s" : ""}` : ""
  }`;
}
