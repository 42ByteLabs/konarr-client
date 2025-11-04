<script setup lang="ts">
import { computed } from "vue";
import { router } from "@/router";

import SecurityIcon from "@/components/SecurityIcon.vue";

import { useSecurityStore } from "@/stores/security";

const security = useSecurityStore();

const props = defineProps<{
  name: string;
  count: number;
  snapshot?: number;
  description?: string;
}>();

// Update on click
const update = () => {
  if (security.snapshot) {
    security.fetchSnapshotAlerts(
      security.snapshot,
      24,
      undefined,
      props.name.toLowerCase(),
    );
    router.push({
      query: {
        severity: props.name.toLowerCase(),
      },
    });
  } else {
    security.fetchAlerts(0, 24, props.name.toLowerCase());
    router.push({
      name: "Security",
      query: {
        severity: props.name.toLowerCase(),
        snapshot: snapshot.value,
      },
    });
  }
};

const snapshot = computed(() => {
  return props.snapshot || router.currentRoute.value.query.search;
});

// Compute color classes based on severity
// Uses Tailwind color configuration for consistency
const colorClasses = computed(() => {
  const severity = props.name.toLowerCase();
  switch (severity) {
    case "critical":
      return {
        bg: "bg-sec-critical-300 dark:bg-sec-critical-500",
        border:
          "border-l-4 border-sec-critical-600 dark:border-sec-critical-300",
        text: "text-sec-critical-950 dark:text-white",
        count: "text-sec-critical-950 dark:text-white",
        icon: "text-sec-critical-900 dark:text-white",
        hover: "hover:bg-sec-critical-400 dark:hover:bg-sec-critical-600",
      };
    case "high":
      return {
        bg: "bg-sec-high-300 dark:bg-sec-high-500",
        border: "border-l-4 border-sec-high-600 dark:border-sec-high-300",
        text: "text-sec-high-950 dark:text-white",
        count: "text-sec-high-950 dark:text-white",
        icon: "text-sec-high-900 dark:text-white",
        hover: "hover:bg-sec-high-400 dark:hover:bg-sec-high-600",
      };
    case "medium":
      return {
        bg: "bg-sec-medium-300 dark:bg-sec-medium-500",
        border: "border-l-4 border-sec-medium-500 dark:border-sec-medium-300",
        text: "text-sec-medium-950 dark:text-white",
        count: "text-sec-medium-950 dark:text-white",
        icon: "text-sec-medium-900 dark:text-white",
        hover: "hover:bg-sec-medium-400 dark:hover:bg-sec-medium-600",
      };
    case "low":
      return {
        bg: "bg-sec-low-300 dark:bg-sec-low-500",
        border: "border-l-4 border-sec-low-600 dark:border-sec-low-300",
        text: "text-sec-low-950 dark:text-white",
        count: "text-sec-low-950 dark:text-white",
        icon: "text-sec-low-900 dark:text-white",
        hover: "hover:bg-sec-low-400 dark:hover:bg-sec-low-600",
      };
    case "info":
    case "informational":
      return {
        bg: "bg-sec-information-50 dark:bg-sec-information-500",
        border:
          "border-l-4 border-sec-information-500 dark:border-sec-information-300",
        text: "text-sec-information-900 dark:text-white",
        count: "text-sec-information-700 dark:text-white",
        icon: "text-sec-information-600 dark:text-white",
        hover: "hover:bg-sec-information-100 dark:hover:bg-sec-information-600",
      };
    case "malware":
      return {
        bg: "bg-sec-malware-300 dark:bg-sec-malware-500",
        border: "border-l-4 border-sec-malware-600 dark:border-sec-malware-300",
        text: "text-sec-malware-950 dark:text-white",
        count: "text-sec-malware-950 dark:text-white",
        icon: "text-sec-malware-900 dark:text-white",
        hover: "hover:bg-sec-malware-400 dark:hover:bg-sec-malware-600",
      };
    case "unmaintained":
      return {
        bg: "bg-sec-unmaintained-50 dark:bg-sec-unmaintained-500",
        border:
          "border-l-4 border-sec-unmaintained-500 dark:border-sec-unmaintained-300",
        text: "text-sec-unmaintained-900 dark:text-white",
        count: "text-sec-unmaintained-700 dark:text-white",
        icon: "text-sec-unmaintained-600 dark:text-white",
        hover:
          "hover:bg-sec-unmaintained-100 dark:hover:bg-sec-unmaintained-600",
      };
    case "unknown":
      return {
        bg: "bg-sec-unknown-50 dark:bg-sec-unknown-500",
        border: "border-l-4 border-sec-unknown-400 dark:border-sec-unknown-300",
        text: "text-sec-unknown-900 dark:text-white",
        count: "text-sec-unknown-700 dark:text-white",
        icon: "text-sec-unknown-600 dark:text-white",
        hover: "hover:bg-sec-unknown-100 dark:hover:bg-sec-unknown-600",
      };
    case "total":
      return {
        bg: "bg-sec-total-50 dark:bg-sec-total-500",
        border: "border-l-4 border-sec-total-500 dark:border-sec-total-300",
        text: "text-sec-total-900 dark:text-white",
        count: "text-sec-total-700 dark:text-white",
        icon: "text-sec-total-600 dark:text-white",
        hover: "hover:bg-sec-total-100 dark:hover:bg-sec-total-600",
      };
    default:
      return {
        bg: "bg-slate-50 dark:bg-slate-500",
        border: "border-l-4 border-slate-400 dark:border-slate-300",
        text: "text-slate-900 dark:text-white",
        count: "text-slate-700 dark:text-white",
        icon: "text-slate-600 dark:text-white",
        hover: "hover:bg-slate-100 dark:hover:bg-slate-600",
      };
  }
});
</script>

<template>
  <button
    :class="[
      colorClasses.bg,
      colorClasses.border,
      colorClasses.hover,
      'shadow-md rounded-lg p-3 md:p-4 hover:shadow-xl transition-all duration-200 w-full transform hover:scale-[1.02] relative group',
    ]"
    @click="update"
  >
    <div class="flex items-center justify-center">
      <div class="absolute left-3 md:left-4">
        <SecurityIcon
          :class="colorClasses.icon"
          :severity="props.name"
          :size="28"
        />
      </div>
      <span :class="['font-bold text-2xl', colorClasses.count]">
        {{ props.count }}
      </span>
    </div>

    <!-- Tooltip on hover -->
    <div
      class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10"
    >
      {{ props.name }}
      <div
        class="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"
      ></div>
    </div>
  </button>
</template>
