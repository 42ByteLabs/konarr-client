<!--
SecurityAlertTile Component
Displays a security alert card with severity, name, and visual indicators.

Props:
- alert (KonarrSecurityAlert): The security alert object to display
- id (number, optional): Alternative way to specify alert by ID

Example usage:
<SecurityAlertTile :alert="alert" />
<SecurityAlertTile :id="123" />
-->
<script setup lang="ts">
import { computed } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiChevronRight } from "@mdi/js";

import type { KonarrSecurityAlert } from "@/types";
import SecurityIcon from "@/components/SecurityIcon.vue";
import { useSecurityStore } from "@/stores/security";

const security = useSecurityStore();

const props = defineProps<{
  alert?: KonarrSecurityAlert;
  id?: number;
}>();

const alert = computed(() => {
  if (props.alert) {
    return props.alert;
  } else if (props.id) {
    return security.data.find((a: KonarrSecurityAlert) => a.id === props.id);
  }
  return null;
});

// Get severity-specific styling
const severityStyles = computed(() => {
  if (!alert.value) return {};

  const severity = alert.value.severity.toLowerCase();

  switch (severity) {
    case "critical":
      return {
        border: "border-red-500",
        badge: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
        icon: "text-red-500",
      };
    case "high":
      return {
        border: "border-orange-500",
        badge:
          "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
        icon: "text-orange-500",
      };
    case "medium":
      return {
        border: "border-yellow-500",
        badge:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
        icon: "text-yellow-500",
      };
    case "low":
      return {
        border: "border-green-500",
        badge:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        icon: "text-green-500",
      };
    case "info":
    case "informational":
      return {
        border: "border-blue-500",
        badge:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        icon: "text-blue-500",
      };
    case "malware":
      return {
        border: "border-pink-500",
        badge:
          "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
        icon: "text-pink-500",
      };
    case "unmaintained":
      return {
        border: "border-slate-500",
        badge:
          "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300",
        icon: "text-slate-500",
      };
    default:
      return {
        border: "border-gray-500",
        badge:
          "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
        icon: "text-gray-500",
      };
  }
});
</script>

<template>
  <router-link
    v-if="alert"
    :to="{ name: 'Alert', params: { id: alert.id } }"
    :aria-label="`View ${alert.severity} security alert: ${alert.name}`"
    class="block bg-white dark:bg-gray-800 shadow-md hover:shadow-xl rounded-lg p-5 border-l-4 transition-all duration-200 transform hover:scale-[1.02] group"
    :class="[
      severityStyles.border,
      'border-r border-t border-b border-gray-200 dark:border-gray-700',
      'hover:border-accent-500 dark:hover:border-accent-400',
    ]"
  >
    <!-- Header with Severity Icon and Title -->
    <div class="flex items-start mb-3">
      <div class="flex-shrink-0 mr-3">
        <SecurityIcon
          :severity="alert.severity"
          :size="32"
          color
          aria-hidden="true"
        />
      </div>
      <div class="flex-1 min-w-0">
        <h3
          class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors line-clamp-2"
        >
          {{ alert.name }}
        </h3>
        <p
          v-if="alert.description"
          class="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2"
        >
          {{ alert.description }}
        </p>
      </div>
      <svg-icon
        type="mdi"
        :path="mdiChevronRight"
        aria-hidden="true"
        class="flex-shrink-0 text-gray-400 group-hover:text-accent-500 transition-colors"
        :size="20"
      ></svg-icon>
    </div>

    <!-- Footer with Severity Badge -->
    <div class="flex items-center justify-between text-sm">
      <span
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
        :class="severityStyles.badge"
      >
        {{ alert.severity }}
      </span>

      <!-- Optional: Show dependency name if available -->
      <div
        v-if="alert.dependency && typeof alert.dependency === 'object'"
        class="flex items-center text-gray-600 dark:text-gray-400 text-xs truncate ml-2"
      >
        <span class="truncate">{{ alert.dependency.name }}</span>
      </div>
      <div
        v-else-if="alert.dependency && typeof alert.dependency === 'string'"
        class="flex items-center text-gray-600 dark:text-gray-400 text-xs truncate ml-2"
      >
        <span class="truncate">{{ alert.dependency }}</span>
      </div>
    </div>
  </router-link>
</template>
