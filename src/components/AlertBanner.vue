<!--
AlertBanner Component
A reusable alert banner component for displaying notifications and warnings.

Props:
- variant?: 'info' | 'warning' | 'success' | 'danger' - Controls the alert color scheme
- icon?: string - MDI icon path to display
- dismissible?: boolean - Whether the alert can be dismissed
- action?: { label: string, handler: () => void } - Optional action button

Slots:
- title: Alert title (optional)
- default: Alert content

Events:
- dismiss: Emitted when the alert is dismissed

Example usage:
<AlertBanner variant="warning" :icon="mdiAlertCircle">
  <template #title>Security attention needed</template>
  You have 5 critical alerts that require immediate attention.
</AlertBanner>
-->
<script setup lang="ts">
import { computed } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiClose } from "@mdi/js";

interface Props {
  variant?: "info" | "warning" | "success" | "danger";
  icon?: string;
  dismissible?: boolean;
  action?: {
    label: string;
    handler: () => void;
  };
}

const props = withDefaults(defineProps<Props>(), {
  variant: "info",
  dismissible: false,
  icon: undefined,
  action: undefined,
});

const emit = defineEmits<{
  dismiss: [];
}>();

// Get variant-specific color classes using Tailwind config
const variantClasses = computed(() => {
  switch (props.variant) {
    case "warning":
      return {
        bg: "bg-warning-50 dark:bg-warning-900/20",
        border: "border-warning-400",
        icon: "text-warning-600 dark:text-warning-400",
        title: "text-warning-800 dark:text-warning-200",
        text: "text-warning-700 dark:text-warning-300",
        button: "bg-warning-600 hover:bg-warning-700",
      };
    case "success":
      return {
        bg: "bg-success-50 dark:bg-success-900/20",
        border: "border-success-400",
        icon: "text-success-600 dark:text-success-400",
        title: "text-success-800 dark:text-success-200",
        text: "text-success-700 dark:text-success-300",
        button: "bg-success-600 hover:bg-success-700",
      };
    case "danger":
      return {
        bg: "bg-error-50 dark:bg-error-900/20",
        border: "border-error-400",
        icon: "text-error-600 dark:text-error-400",
        title: "text-error-800 dark:text-error-200",
        text: "text-error-700 dark:text-error-300",
        button: "bg-error-600 hover:bg-error-700",
      };
    default: // info
      return {
        bg: "bg-sec-information-50 dark:bg-sec-information-900/20",
        border: "border-sec-information-400",
        icon: "text-sec-information-600 dark:text-sec-information-400",
        title: "text-sec-information-800 dark:text-sec-information-200",
        text: "text-sec-information-700 dark:text-sec-information-300",
        button: "bg-sec-information-600 hover:bg-sec-information-700",
      };
  }
});

const handleDismiss = () => {
  emit("dismiss");
};
</script>

<template>
  <div
    class="border-l-4 p-4 rounded-lg"
    :class="[variantClasses.bg, variantClasses.border]"
  >
    <div class="flex items-start">
      <svg-icon
        v-if="icon"
        type="mdi"
        :path="icon"
        :class="['mr-3 flex-shrink-0', variantClasses.icon]"
        :size="24"
      ></svg-icon>

      <div class="flex-1 min-w-0">
        <p
          v-if="$slots.title"
          class="text-sm font-medium mb-1"
          :class="variantClasses.title"
        >
          <slot name="title" />
        </p>
        <p class="text-sm" :class="variantClasses.text">
          <slot />
        </p>
      </div>

      <div class="flex items-center gap-2 ml-4 flex-shrink-0">
        <button
          v-if="action"
          class="px-4 py-2 text-white rounded-md text-sm font-medium transition-colors"
          :class="variantClasses.button"
          @click="action.handler"
        >
          {{ action.label }}
        </button>

        <button
          v-if="dismissible"
          class="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          :class="variantClasses.icon"
          aria-label="Dismiss alert"
          @click="handleDismiss"
        >
          <svg-icon type="mdi" :path="mdiClose" :size="20"></svg-icon>
        </button>
      </div>
    </div>
  </div>
</template>
