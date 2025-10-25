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

import type { SecurityAlert } from "@/types";
import SecurityIcon from "@/components/SecurityIcon.vue";
import BaseBadge from "@/components/BaseBadge.vue";
import { useSecurityStore } from "@/stores/security";

const security = useSecurityStore();

const props = defineProps<{
  alert?: SecurityAlert;
  id?: number;
}>();

const alert = computed(() => {
  if (props.alert) {
    return props.alert;
  } else if (props.id) {
    return security.find(props.id);
  }
  return null;
});

// Get severity-specific styling and badge variant
const severityStyles = computed(() => {
  if (!alert.value) return { border: "", icon: "" };

  const severity = alert.value.severity.toLowerCase();

  switch (severity) {
    case "critical":
      return {
        border: "border-sec-critical-500",
        icon: "text-sec-critical-500",
      };
    case "high":
      return {
        border: "border-sec-high-500",
        icon: "text-sec-high-500",
      };
    case "medium":
      return {
        border: "border-sec-medium-500",
        icon: "text-sec-medium-500",
      };
    case "low":
      return {
        border: "border-sec-low-500",
        icon: "text-sec-low-500",
      };
    case "info":
    case "informational":
      return {
        border: "border-sec-information-500",
        icon: "text-sec-information-500",
      };
    case "malware":
      return {
        border: "border-sec-malware-500",
        icon: "text-sec-malware-500",
      };
    case "unmaintained":
      return {
        border: "border-sec-unmaintained-500",
        icon: "text-sec-unmaintained-500",
      };
    default:
      return {
        border: "border-gray-500",
        icon: "text-gray-500",
      };
  }
});

const badgeVariant = computed(() => {
  if (!alert.value) return "default";

  const severity = alert.value.severity.toLowerCase();

  switch (severity) {
    case "critical":
      return "danger";
    case "high":
      return "warning";
    case "medium":
      return "warning";
    case "low":
      return "success";
    case "info":
    case "informational":
      return "info";
    default:
      return "default";
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
      <BaseBadge :variant="badgeVariant">
        {{ alert.severity }}
      </BaseBadge>

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
