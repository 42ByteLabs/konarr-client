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
  security.fetchAlerts(0, 24, props.name.toLowerCase());
  router.push({
    name: "Security",
    query: {
      severity: props.name.toLowerCase(),
      snapshot: snapshot.value,
    },
  });
};

const snapshot = computed(() => {
  return props.snapshot || router.currentRoute.value.query.search;
});

// Compute color classes based on severity
const colorClasses = computed(() => {
  const severity = props.name.toLowerCase();
  switch (severity) {
    case "critical":
      return {
        bg: "bg-red-400 dark:bg-red-400",
        border: "border-l-4 border-red-700",
        text: "text-red-900 dark:text-red-100",
        count: "text-black dark:text-black",
        icon: "text-red-900 dark:text-red-900",
        hover: "hover:bg-red-500 dark:hover:bg-red-500",
      };
    case "high":
      return {
        bg: "bg-orange-500 dark:bg-orange-500",
        border: "border-l-4 border-orange-800",
        text: "text-orange-950 dark:text-orange-100",
        count: "text-black dark:text-black",
        icon: "text-orange-950 dark:text-orange-950",
        hover: "hover:bg-orange-600 dark:hover:bg-orange-600",
      };
    case "medium":
      return {
        bg: "bg-yellow-500 dark:bg-yellow-500",
        border: "border-l-4 border-yellow-800",
        text: "text-yellow-950 dark:text-yellow-100",
        count: "text-black dark:text-black",
        icon: "text-yellow-900 dark:text-yellow-900",
        hover: "hover:bg-yellow-600 dark:hover:bg-yellow-600",
      };
    case "low":
      return {
        bg: "bg-green-500 dark:bg-green-500",
        border: "border-l-4 border-green-700",
        text: "text-blue-950 dark:text-blue-100",
        count: "text-black dark:text-black",
        icon: "text-green-900 dark:text-green-900",
        hover: "hover:bg-green-600 dark:hover:bg-green-600",
      };
    case "info":
    case "informational":
      return {
        bg: "bg-purple-500 dark:bg-purple-500",
        border: "border-l-4 border-purple-700",
        text: "text-gray-950 dark:text-cyan-100",
        count: "text-black dark:text-black",
        icon: "text-purple-900 dark:text-purple-900",
        hover: "hover:bg-purple-600 dark:hover:bg-purple-600",
      };
    case "malware":
      return {
        bg: "bg-pink-300 dark:bg-pink-300",
        border: "border-l-4 border-pink-700",
        text: "text-pink-950 dark:text-pink-100",
        count: "text-black dark:text-black",
        icon: "text-pink-900 dark:text-pink-900",
        hover: "hover:bg-pink-400 dark:hover:bg-pink-400",
      };
    case "unmaintained":
      return {
        bg: "bg-slate-500 dark:bg-slate-500",
        border: "border-l-4 border-slate-700",
        text: "text-slate-950 dark:text-amber-100",
        count: "text-black dark:text-black",
        icon: "text-slate-900 dark:text-slate-900",
        hover: "hover:bg-slate-600 dark:hover:bg-slate-600",
      };
    case "unknown":
      return {
        bg: "bg-gray-600 dark:bg-gray-600",
        border: "border-l-4 border-gray-800",
        text: "text-gray-950 dark:text-slate-100",
        count: "text-black dark:text-black",
        icon: "text-gray-900 dark:text-gray-900",
        hover: "hover:bg-gray-700 dark:hover:bg-gray-700",
      };
    case "total":
      return {
        bg: "bg-blue-600 dark:bg-blue-600",
        border: "border-l-4 border-blue-800",
        text: "text-blue-950 dark:text-purple-100",
        count: "text-black dark:text-black",
        icon: "text-blue-900 dark:text-blue-900",
        hover: "hover:bg-blue-700 dark:hover:bg-blue-700",
      };
    default:
      return {
        bg: "bg-gray-700 dark:bg-gray-700",
        border: "border-l-4 border-gray-800",
        text: "text-gray-900 dark:text-gray-100",
        count: "text-black dark:text-black",
        icon: "text-gray-900 dark:text-gray-300",
        hover: "hover:bg-gray-600 dark:hover:bg-gray-600",
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
