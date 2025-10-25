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
        bg: "bg-yellow-50 dark:bg-yellow-900/20",
        border: "border-yellow-400",
        icon: "text-yellow-600 dark:text-yellow-400",
        title: "text-yellow-800 dark:text-yellow-200",
        text: "text-yellow-700 dark:text-yellow-300",
        button: "bg-yellow-600 hover:bg-yellow-700",
      };
    case "success":
      return {
        bg: "bg-green-50 dark:bg-green-900/20",
        border: "border-green-400",
        icon: "text-green-600 dark:text-green-400",
        title: "text-green-800 dark:text-green-200",
        text: "text-green-700 dark:text-green-300",
        button: "bg-green-600 hover:bg-green-700",
      };
    case "danger":
      return {
        bg: "bg-red-50 dark:bg-red-900/20",
        border: "border-red-400",
        icon: "text-red-600 dark:text-red-400",
        title: "text-red-800 dark:text-red-200",
        text: "text-red-700 dark:text-red-300",
        button: "bg-red-600 hover:bg-red-700",
      };
    default: // info
      return {
        bg: "bg-blue-50 dark:bg-blue-900/20",
        border: "border-blue-400",
        icon: "text-blue-600 dark:text-blue-400",
        title: "text-blue-800 dark:text-blue-200",
        text: "text-blue-700 dark:text-blue-300",
        button: "bg-blue-600 hover:bg-blue-700",
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
