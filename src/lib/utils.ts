import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { isNull } from "util"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined'
}

export const getItemFromStorage = (key: string): string | null  => {
  if (isBrowser()) {
    return window.localStorage.getItem(key)
  }

  return null
}