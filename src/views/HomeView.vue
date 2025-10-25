<script setup lang="ts">
import { computed, onMounted } from "vue";
import { router } from "@/router";
import SvgIcon from "@jamescoyle/vue-icon";
import {
  mdiViewDashboard,
  mdiAlertCircle,
  mdiLock,
  mdiCodeBraces,
  mdiApplication,
  mdiServer,
} from "@mdi/js";

import Welcome from "@/components/Welcome.vue";
import SecurityAlertsPie from "@/components/SecurityAlertsPie.vue";
import ProjectTile from "@/components/ProjectTile.vue";
import DependencySummaryTile from "@/components/DependencySummaryTile.vue";
import QuickStatsCards from "@/components/QuickStatsCards.vue";

import { useServerStore } from "@/stores/server";
import { useProjectsStore } from "@/stores/projects";

const server = useServerStore();
const projects = useProjectsStore();

onMounted(async () => {
  // Fetch recent projects and security alerts for dashboard
  await projects.fetchProjects(0, 4, false, "containers");
});

// Quick stats computed properties
const criticalAlerts = computed(() => {
  return server.security?.critical || 0;
});

const totalProjects = computed(() => {
  return server.projects?.total || 0;
});

const totalDependencies = computed(() => {
  return server.dependencies?.total || 0;
});

const hasSecurityIssues = computed(() => {
  return Boolean(
    server.security &&
      (server.security.critical > 0 ||
        server.security.high > 0 ||
        server.security.medium > 0)
  );
});

// Quick actions
const navigateToProjects = () => {
  router.push({ name: "Projects" });
};

const navigateToSecurity = () => {
  router.push({ name: "Security" });
};

const navigateToDependencies = () => {
  router.push({ name: "Dependencies" });
};
</script>

<template>
  <main>
    <div class="container mt-4 mb-6 w-full mx-auto px-2 md:px-4">
      <Welcome v-if="!server.user" />

      <div v-else class="space-y-6">
        <!-- Dashboard Header -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              <svg-icon
                type="mdi"
                :path="mdiViewDashboard"
                class="inline-block mr-2"
                :size="32"
              ></svg-icon>
              Dashboard
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Welcome back, {{ server.user.username }}
            </p>
          </div>
        </div>

        <!-- Quick Stats Cards -->
        <QuickStatsCards
          :total-projects="totalProjects"
          :servers="server.projects?.servers || 0"
          :containers="server.projects?.containers || 0"
          :total-dependencies="totalDependencies"
          :libraries="server.dependencies?.libraries || 0"
          :critical-alerts="criticalAlerts"
          :total-alerts="server.security?.total || 0"
          :has-security-issues="hasSecurityIssues"
          @navigate-to-projects="navigateToProjects"
          @navigate-to-dependencies="navigateToDependencies"
          @navigate-to-security="navigateToSecurity"
        />

        <!-- Alert Banner (if critical issues exist) -->
        <div
          v-if="hasSecurityIssues"
          class="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-lg"
        >
          <div class="flex items-center">
            <svg-icon
              type="mdi"
              :path="mdiAlertCircle"
              class="text-yellow-600 dark:text-yellow-400 mr-3"
              :size="24"
            ></svg-icon>
            <div class="flex-1">
              <p
                class="text-sm font-medium text-yellow-800 dark:text-yellow-200"
              >
                Security attention needed
              </p>
              <p class="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                You have {{ server.security?.critical || 0 }} critical and
                {{ server.security?.high || 0 }} high severity alerts that
                require immediate attention.
              </p>
            </div>
            <button
              class="ml-4 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md text-sm font-medium transition-colors"
              @click="navigateToSecurity"
            >
              Review Alerts
            </button>
          </div>
        </div>

        <!-- Main Dashboard Content -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left Column: Recent Projects & Dependency Summaries -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Recent Projects Section -->
            <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                  Recent Projects
                </h2>
                <button
                  class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  @click="navigateToProjects"
                >
                  View All
                </button>
              </div>
              <div
                v-if="projects.loading"
                class="flex justify-center items-center py-12"
              >
                <div
                  class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"
                ></div>
              </div>
              <div
                v-else-if="projects.projects.length === 0"
                class="text-center py-12"
              >
                <p class="text-gray-500 dark:text-gray-400">
                  No projects found. Create your first project to get started.
                </p>
                <button
                  class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
                  @click="router.push({ name: 'New Project' })"
                >
                  Create Project
                </button>
              </div>
              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProjectTile
                  v-for="project in projects.projects.slice(0, 6)"
                  :key="project.id"
                  :project="project"
                />
              </div>
            </div>

            <!-- Dependency Summaries Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Operating Systems Summary -->
              <DependencySummaryTile
                v-if="server.dependencies?.['operating-systems']"
                title="Operating Systems"
                :count="server.dependencies['operating-systems']"
                :icon="mdiServer"
                subtitle="Unique OS instances tracked"
                info-text="Operating systems are tracked across all your projects and containers to help you maintain consistency and security."
                variant="blue"
                dep-type="os"
              />

              <!-- Applications Summary -->
              <DependencySummaryTile
                v-if="server.dependencies?.applications"
                title="Applications"
                :count="server.dependencies.applications"
                :icon="mdiApplication"
                subtitle="Standalone apps tracked"
                info-text="Monitor standalone applications and tools used across your infrastructure."
                variant="orange"
                dep-type="application"
              />

              <!-- Cryptographic Libraries Summary -->
              <DependencySummaryTile
                v-if="server.dependencies?.['cryptographic-libraries']"
                title="Cryptographic Libraries"
                :count="server.dependencies['cryptographic-libraries']"
                :icon="mdiLock"
                subtitle="Encryption & security libs"
                info-text="Cryptographic libraries are critical for security. Keep them updated to protect against vulnerabilities."
                variant="purple"
                dep-type="cryptography"
              />

              <!-- Programming Languages Summary -->
              <DependencySummaryTile
                v-if="server.dependencies?.languages"
                title="Programming Languages"
                :count="server.dependencies.languages"
                :icon="mdiCodeBraces"
                subtitle="Languages used in projects"
                info-text="Track the programming languages used across your projects to understand your technology stack."
                variant="green"
                dep-type="language"
              />
            </div>
          </div>

          <!-- Right Column: Security Overview & Dependency Types -->
          <div class="space-y-6">
            <!-- Security Overview -->
            <div
              v-if="server.security"
              class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6"
            >
              <h2
                class="text-xl font-semibold text-gray-900 dark:text-white mb-4"
              >
                Security Overview
              </h2>
              <div class="mb-4">
                <SecurityAlertsPie :alerts="server.security" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
