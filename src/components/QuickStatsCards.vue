<!--
QuickStatsCards Component
Displays dashboard statistics cards with metrics and quick navigation.

Props:
- totalProjects (number): Total number of projects
- servers (number): Number of servers
- containers (number): Number of containers
- totalDependencies (number): Total number of dependencies
- libraries (number): Number of libraries
- criticalAlerts (number): Number of critical security alerts
- totalAlerts (number): Total security alerts
- hasSecurityIssues (boolean): Whether there are any security issues

Events:
- navigate-to-projects: Emitted when projects card is clicked
- navigate-to-dependencies: Emitted when dependencies card is clicked
- navigate-to-security: Emitted when security card is clicked

Example usage:
<QuickStatsCards
  :totalProjects="10"
  :servers="5"
  :containers="8"
  :totalDependencies="150"
  :libraries="120"
  :criticalAlerts="2"
  :totalAlerts="15"
  :hasSecurityIssues="true"
  @navigate-to-projects="router.push({ name: 'Projects' })"
  @navigate-to-dependencies="router.push({ name: 'Dependencies' })"
  @navigate-to-security="router.push({ name: 'Security' })"
/>
-->
<script setup lang="ts">
import SvgIcon from "@jamescoyle/vue-icon";
import {
  mdiPackageVariant,
  mdiShieldAlert,
  mdiGraph,
  mdiTrendingUp,
  mdiServer,
  mdiDocker,
  mdiChevronRight,
} from "@mdi/js";

interface Props {
  totalProjects: number;
  servers: number;
  containers: number;
  totalDependencies: number;
  libraries: number;
  criticalAlerts: number;
  totalAlerts: number;
  hasSecurityIssues: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  "navigate-to-projects": [];
  "navigate-to-dependencies": [];
  "navigate-to-security": [];
}>();
</script>

<template>
  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    role="region"
    aria-label="Dashboard Statistics"
  >
    <!-- Projects Card -->
    <button
      type="button"
      aria-label="View all projects"
      class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      @click="emit('navigate-to-projects')"
    >
      <div class="flex items-center justify-between">
        <div>
          <p
            id="projects-label"
            class="text-sm font-medium text-gray-600 dark:text-gray-400"
          >
            Total Projects
          </p>
          <p
            class="text-3xl font-bold text-gray-900 dark:text-white mt-2"
            aria-labelledby="projects-label"
          >
            {{ totalProjects }}
          </p>
        </div>
        <svg-icon
          type="mdi"
          :path="mdiPackageVariant"
          aria-hidden="true"
          class="text-blue-500"
          :size="48"
        ></svg-icon>
      </div>
      <div class="mt-4 flex items-center text-sm">
        <span class="text-gray-500 dark:text-gray-400 mr-1">
          {{ servers }} servers, {{ containers }} containers
        </span>
        <svg-icon
          type="mdi"
          :path="mdiChevronRight"
          aria-hidden="true"
          class="text-gray-400"
          :size="16"
        ></svg-icon>
      </div>
    </button>

    <!-- Dependencies Card -->
    <button
      type="button"
      aria-label="View all dependencies"
      class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      @click="emit('navigate-to-dependencies')"
    >
      <div class="flex items-center justify-between">
        <div>
          <p
            id="dependencies-label"
            class="text-sm font-medium text-gray-600 dark:text-gray-400"
          >
            Dependencies
          </p>
          <p
            class="text-3xl font-bold text-gray-900 dark:text-white mt-2"
            aria-labelledby="dependencies-label"
          >
            {{ totalDependencies }}
          </p>
        </div>
        <svg-icon
          type="mdi"
          :path="mdiGraph"
          aria-hidden="true"
          class="text-green-500"
          :size="48"
        ></svg-icon>
      </div>
      <div class="mt-4 flex items-center text-sm">
        <span class="text-gray-500 dark:text-gray-400 mr-1">
          {{ libraries }} libraries tracked
        </span>
        <svg-icon
          type="mdi"
          :path="mdiChevronRight"
          aria-hidden="true"
          class="text-gray-400"
          :size="16"
        ></svg-icon>
      </div>
    </button>

    <!-- Security Critical Card -->
    <button
      type="button"
      :aria-label="
        criticalAlerts > 0
          ? `View ${criticalAlerts} critical security alerts`
          : 'View security alerts'
      "
      class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border-l-4 hover:shadow-xl transition-shadow cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-offset-2"
      :class="[
        criticalAlerts > 0
          ? 'border-red-500 focus:ring-red-500'
          : hasSecurityIssues
            ? 'border-yellow-500 focus:ring-yellow-500'
            : 'border-gray-300 focus:ring-gray-300',
      ]"
      @click="emit('navigate-to-security')"
    >
      <div class="flex items-center justify-between">
        <div>
          <p
            id="security-label"
            class="text-sm font-medium text-gray-600 dark:text-gray-400"
          >
            Critical Alerts
          </p>
          <p
            class="text-3xl font-bold text-gray-900 dark:text-white mt-2"
            aria-labelledby="security-label"
          >
            {{ criticalAlerts }}
          </p>
        </div>
        <svg-icon
          type="mdi"
          :path="mdiShieldAlert"
          aria-hidden="true"
          :class="
            criticalAlerts > 0
              ? 'text-red-500'
              : hasSecurityIssues
                ? 'text-yellow-500'
                : 'text-gray-400'
          "
          :size="48"
        ></svg-icon>
      </div>
      <div class="mt-4 flex items-center text-sm">
        <span class="text-gray-500 dark:text-gray-400 mr-1">
          {{ totalAlerts }} total alerts
        </span>
        <svg-icon
          type="mdi"
          :path="mdiChevronRight"
          aria-hidden="true"
          class="text-gray-400"
          :size="16"
        ></svg-icon>
      </div>
    </button>

    <!-- Infrastructure Card -->
    <div
      class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow"
      role="status"
      aria-label="Infrastructure statistics"
    >
      <div class="flex items-center justify-between">
        <div>
          <p
            id="infrastructure-label"
            class="text-sm font-medium text-gray-600 dark:text-gray-400"
          >
            Infrastructure
          </p>
          <p
            class="text-3xl font-bold text-gray-900 dark:text-white mt-2"
            aria-labelledby="infrastructure-label"
          >
            {{ servers + containers }}
          </p>
        </div>
        <svg-icon
          type="mdi"
          :path="mdiTrendingUp"
          aria-hidden="true"
          class="text-purple-500"
          :size="48"
        ></svg-icon>
      </div>
      <div class="mt-4 flex items-center text-sm">
        <svg-icon
          type="mdi"
          :path="mdiServer"
          aria-hidden="true"
          class="text-gray-400 mr-1"
          :size="16"
        ></svg-icon>
        <span class="text-gray-500 dark:text-gray-400 mr-2">
          {{ servers }}
        </span>
        <svg-icon
          type="mdi"
          :path="mdiDocker"
          aria-hidden="true"
          class="text-gray-400 mr-1"
          :size="16"
        ></svg-icon>
        <span class="text-gray-500 dark:text-gray-400">
          {{ containers }}
        </span>
      </div>
    </div>
  </div>
</template>
