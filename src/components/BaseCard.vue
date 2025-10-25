<!--
BaseCard Component
A reusable card wrapper component for consistent styling across the application.

Props:
- variant?: 'default' | 'info' | 'warning' | 'success' | 'danger' - Controls the left border color
- hoverable?: boolean - Whether the card should have hover effects (scale, shadow)
- clickable?: boolean - Whether the card is clickable (shows pointer cursor)

Slots:
- default: Main content of the card

Example usage:
<BaseCard variant="info" hoverable>
  <h3>Card Title</h3>
  <p>Card content</p>
</BaseCard>
-->
<script setup lang="ts">
import { computed } from "vue";

interface Props {
  variant?: "default" | "info" | "warning" | "success" | "danger";
  hoverable?: boolean;
  clickable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
  hoverable: false,
  clickable: false,
});

// Get variant-specific border color classes using Tailwind config
const variantClasses = computed(() => {
  switch (props.variant) {
    case "info":
      return "border-sec-information-500";
    case "warning":
      return "border-warning-500";
    case "success":
      return "border-success-500";
    case "danger":
      return "border-error-500";
    default:
      return "border-gray-200 dark:border-gray-700";
  }
});

const hoverClasses = computed(() => {
  if (props.hoverable) {
    return "hover:shadow-xl transform hover:scale-[1.02] hover:border-accent-500 dark:hover:border-accent-400";
  }
  return "";
});

const cursorClass = computed(() => (props.clickable ? "cursor-pointer" : ""));
</script>

<template>
  <div
    class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-5 border transition-all duration-200"
    :class="[variantClasses, hoverClasses, cursorClass]"
  >
    <slot />
  </div>
</template>
