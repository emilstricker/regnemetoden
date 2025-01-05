import { startOfDay, addDays, isSameDay } from 'date-fns';

let currentDateOverride: Date | null = null;

export function setCurrentDate(date: Date) {
  currentDateOverride = date;
}

export function getCurrentDate(): Date {
  return currentDateOverride || new Date();
}

export function getCurrentDayStart(): string {
  return startOfDay(getCurrentDate()).toISOString();
}

export function isCurrentDay(date: string): boolean {
  return isSameDay(new Date(date), getCurrentDate());
}

export function getNextDay(date: string): string {
  return addDays(new Date(date), 1).toISOString();
}

export function getPreviousDay(date: string): string {
  return addDays(new Date(date), -1).toISOString();
}
