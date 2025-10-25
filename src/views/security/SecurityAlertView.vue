<script setup lang="ts">
import { onMounted, computed } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiShieldAlert, mdiMenuLeft, mdiPackageVariantClosed } from "@mdi/js";
import type { SecurityAlert } from "@/types";

import Title from "@/components/Title.vue";
import SecurityIcon from "@/components/SecurityIcon.vue";
import DependencyTile from "@/components/DependencyTile.vue";
import BaseBadge from "@/components/BaseBadge.vue";

import { useSecurityStore } from "@/stores/security";

const security = useSecurityStore();

onMounted(() => {
  // Get ID from the URL
  const current = parseInt(window.location.pathname.split("/").pop()!);
  security.fetchAlert(current);
});

var alert = computed(() => {
  return security.alerts.find((c: SecurityAlert) => c.id === security.current);
});

// Get severity-specific styling and badge variant
const severityStyles = computed(() => {
  if (!alert.value) return { border: "", bg: "" };

  const severity = alert.value.severity.toLowerCase();

  switch (severity) {
    case "critical":
      return {
        border: "border-sec-critical-500",
        bg: "bg-sec-critical-50 dark:bg-sec-critical-900/10",
      };
    case "high":
      return {
        border: "border-sec-high-500",
        bg: "bg-sec-high-50 dark:bg-sec-high-900/10",
      };
    case "medium":
      return {
        border: "border-sec-medium-500",
        bg: "bg-sec-medium-50 dark:bg-sec-medium-900/10",
      };
    case "low":
      return {
        border: "border-sec-low-500",
        bg: "bg-sec-low-50 dark:bg-sec-low-900/10",
      };
    case "info":
    case "informational":
      return {
        border: "border-sec-information-500",
        bg: "bg-sec-information-50 dark:bg-sec-information-900/10",
      };
    case "malware":
      return {
        border: "border-sec-malware-500",
        bg: "bg-sec-malware-50 dark:bg-sec-malware-900/10",
      };
    case "unmaintained":
      return {
        border: "border-sec-unmaintained-500",
        bg: "bg-sec-unmaintained-50 dark:bg-sec-unmaintained-900/10",
      };
    default:
      return {
        border: "border-gray-500",
        bg: "bg-gray-50 dark:bg-gray-900/10",
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
  <main>
    <div
      v-if="alert"
      class="container mt-4 mb-12 w-full mx-auto dark:text-white px-2"
    >
      <!-- Back Button -->
      <div class="flex justify-start mb-6">
        <router-link
          :to="{ name: 'Security' }"
          class="inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 px-3 py-2 text-sm rounded-md bg-accent-500 hover:bg-accent-600 text-white shadow-sm hover:shadow-md"
        >
          <svg-icon
            type="mdi"
            :path="mdiMenuLeft"
            class="h-4 w-4 mr-1.5"
          ></svg-icon>
          <span>Back to Security Alerts</span>
        </router-link>
      </div>

      <!-- Alert Header Card -->
      <div
        class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-6 border-l-4"
        :class="[severityStyles.border]"
      >
        <div class="flex items-start">
          <div class="flex-shrink-0 mr-4">
            <SecurityIcon :severity="alert.severity" :size="48" color />
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between mb-2">
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ alert.name }}
              </h1>
              <BaseBadge :variant="badgeVariant" size="md">
                {{ alert.severity }}
              </BaseBadge>
            </div>
          </div>
        </div>
      </div>

      <!-- Description Section -->
      <div
        v-if="alert.description"
        class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6"
      >
        <h2
          class="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center"
        >
          <svg-icon
            type="mdi"
            :path="mdiShieldAlert"
            class="h-6 w-6 mr-2 text-accent-500"
          ></svg-icon>
          Description
        </h2>
        <div class="prose dark:prose-invert max-w-none">
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
            {{ alert.description }}
          </p>
        </div>
      </div>

      <!-- Affected Dependencies Section -->
      <div v-if="alert.dependency && typeof alert.dependency === 'object'">
        <h2
          class="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center"
        >
          <svg-icon
            type="mdi"
            :path="mdiPackageVariantClosed"
            class="h-6 w-6 mr-2 text-accent-500"
          ></svg-icon>
          Affected Dependencies
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <DependencyTile :dependency="alert.dependency" />
        </div>
      </div>
    </div>
    <div v-else class="container mt-4 mb-6 w-full max-w-2xl mx-auto px-2">
      <div
        class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 text-center"
      >
        <svg-icon
          type="mdi"
          :path="mdiShieldAlert"
          class="h-16 w-16 mx-auto mb-4 text-gray-400"
        ></svg-icon>
        <Title
          title="Security Alert Not Found"
          subtitle="The requested alert could not be found"
          description="Please check the alert ID and try again"
        />
        <router-link
          :to="{ name: 'Security' }"
          class="inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 px-3 py-2 text-sm rounded-md bg-accent-500 hover:bg-accent-600 text-white shadow-sm hover:shadow-md mt-4"
        >
          Back to Security Alerts
        </router-link>
      </div>
    </div>
  </main>
</template>
