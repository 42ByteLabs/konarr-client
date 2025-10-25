<!--
BaseBadge Component
A reusable badge component for consistent badge styling across the application.

Props:
- variant?: 'default' | 'accent' | 'info' | 'warning' | 'success' | 'danger' - Controls the badge color
- size?: 'sm' | 'md' | 'lg' - Badge size

Slots:
- default: Badge content (text or icon)

Example usage:
<BaseBadge variant="accent">npm</BaseBadge>
<BaseBadge variant="danger" size="sm">Critical</BaseBadge>
-->
<script setup lang="ts">
import { computed } from "vue";

interface Props {
  variant?: "default" | "accent" | "info" | "warning" | "success" | "danger";
  size?: "sm" | "md" | "lg";
}

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
  size: "md",
});

// Get variant-specific color classes using Tailwind config
const variantClasses = computed(() => {
  switch (props.variant) {
    case "accent":
      return "bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300";
    case "info":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case "warning":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "success":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "danger":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
  }
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case "sm":
      return "px-2 py-0.5 text-xs";
    case "lg":
      return "px-3 py-1 text-sm";
    default:
      return "px-2.5 py-0.5 text-xs";
  }
});
</script>

<template>
  <span
    class="inline-flex items-center rounded-full font-medium capitalize"
    :class="[variantClasses, sizeClasses]"
  >
    <slot />
  </span>
</template>
