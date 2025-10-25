<script setup lang="ts">
import { onMounted, computed } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiShieldAlert, mdiMenuLeft, mdiPackageVariantClosed } from "@mdi/js";
import type { SecurityAlert } from "@/types";

import Title from "@/components/Title.vue";
import SecurityIcon from "@/components/SecurityIcon.vue";
import DependencyTile from "@/components/DependencyTile.vue";

import { useSecurityStore } from "@/stores/security";

const security = useSecurityStore();

onMounted(() => {
  // Get ID from the URL
  const current = parseInt(window.location.pathname.split("/").pop()!);
  security.fetchAlert(current);
});

var alert = computed(() => {
  return security.data.find((c: SecurityAlert) => c.id === security.current);
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
        bg: "bg-red-50 dark:bg-red-900/10",
      };
    case "high":
      return {
        border: "border-orange-500",
        badge:
          "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
        bg: "bg-orange-50 dark:bg-orange-900/10",
      };
    case "medium":
      return {
        border: "border-yellow-500",
        badge:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
        bg: "bg-yellow-50 dark:bg-yellow-900/10",
      };
    case "low":
      return {
        border: "border-green-500",
        badge:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        bg: "bg-green-50 dark:bg-green-900/10",
      };
    case "info":
    case "informational":
      return {
        border: "border-blue-500",
        badge:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        bg: "bg-blue-50 dark:bg-blue-900/10",
      };
    case "malware":
      return {
        border: "border-pink-500",
        badge:
          "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
        bg: "bg-pink-50 dark:bg-pink-900/10",
      };
    case "unmaintained":
      return {
        border: "border-slate-500",
        badge:
          "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300",
        bg: "bg-slate-50 dark:bg-slate-900/10",
      };
    default:
      return {
        border: "border-gray-500",
        badge:
          "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
        bg: "bg-gray-50 dark:bg-gray-900/10",
      };
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
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize"
                :class="severityStyles.badge"
              >
                {{ alert.severity }}
              </span>
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
