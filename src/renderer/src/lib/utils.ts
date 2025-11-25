import { today } from "@internationalized/date";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// get next visit date = 7 days ahead, skip Sunday
export function getDefaultNextVisit() {
  let d = today("UTC").add({ days: 7 }); // +7 days

  // If Sunday → move to Monday
  // Sunday is weekday 0
  const jsDate = new Date(d.toString()); // convert YYYY-MM-DD → JS Date
  if (jsDate.getUTCDay() === 0) {
    d = d.add({ days: 1 }); // move to Monday
  }

  return d; // CalendarDate
}
