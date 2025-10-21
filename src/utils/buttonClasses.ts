export function baseButton() {
  return "inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium";
}

export function primaryButton() {
  return `${baseButton()} bg-accent-500 hover:bg-accent-600 text-white`;
}

export function neutralButton() {
  return `${baseButton()} bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200`;
}

export function outlineButton() {
  return "px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700";
}
