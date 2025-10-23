export function baseButton() {
  return "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 px-3 py-2 text-sm rounded-md";
}

export function primaryButton() {
  return `${baseButton()} bg-accent-500 hover:bg-accent-600 text-white shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-accent-500 disabled:hover:shadow-sm`;
}

export function neutralButton() {
  return `${baseButton()} bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed`;
}

export function outlineButton() {
  return "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed";
}
