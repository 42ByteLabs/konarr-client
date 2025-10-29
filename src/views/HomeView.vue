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
  mdiLogin,
  mdiAccountPlus,
  mdiShieldCheck,
  mdiChartLine,
  mdiPackageVariant,
} from "@mdi/js";

import SecurityAlertsPie from "@/components/SecurityAlertsPie.vue";
import ProjectTile from "@/components/ProjectTile.vue";
import DependencySummaryTile from "@/components/DependencySummaryTile.vue";
import QuickStatsCards from "@/components/QuickStatsCards.vue";
import AlertBanner from "@/components/AlertBanner.vue";

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
        server.security.medium > 0),
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
      <!-- Not Logged In View -->
      <div
        v-if="!server.user"
        class="min-h-[80vh] flex items-center justify-center py-12"
      >
        <div class="max-w-6xl mx-auto w-full">
          <!-- Hero Section -->
          <div class="text-center mb-16">
            <h1
              class="text-6xl font-bold mb-6 bg-gradient-to-r from-accent-600 via-pink-600 to-accent-600 bg-clip-text text-transparent dark:from-accent-400 dark:via-pink-400 dark:to-accent-400"
            >
              Konarr
            </h1>
            <p class="text-2xl text-gray-700 dark:text-gray-300 mb-4">
              Supply Chain Security Monitoring
            </p>
            <p
              class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            >
              Monitor dependencies, track vulnerabilities, and secure your
              software supply chain
            </p>
          </div>

          <!-- Feature Highlights -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <!-- Feature 1 -->
            <div
              class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div
                class="w-12 h-12 bg-accent-500/10 dark:bg-accent-500/20 rounded-lg flex items-center justify-center mb-4"
              >
                <svg-icon
                  type="mdi"
                  :path="mdiShieldCheck"
                  class="h-6 w-6 text-accent-600 dark:text-accent-400"
                ></svg-icon>
              </div>
              <h3
                class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
              >
                Security Monitoring
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Track vulnerabilities and security alerts across all your
                projects
              </p>
            </div>

            <!-- Feature 2 -->
            <div
              class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div
                class="w-12 h-12 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg flex items-center justify-center mb-4"
              >
                <svg-icon
                  type="mdi"
                  :path="mdiPackageVariant"
                  class="h-6 w-6 text-blue-600 dark:text-blue-400"
                ></svg-icon>
              </div>
              <h3
                class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
              >
                Dependency Tracking
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Comprehensive SBOM analysis and dependency management
              </p>
            </div>

            <!-- Feature 3 -->
            <div
              class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div
                class="w-12 h-12 bg-green-500/10 dark:bg-green-500/20 rounded-lg flex items-center justify-center mb-4"
              >
                <svg-icon
                  type="mdi"
                  :path="mdiChartLine"
                  class="h-6 w-6 text-green-600 dark:text-green-400"
                ></svg-icon>
              </div>
              <h3
                class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
              >
                Real-time Insights
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Get actionable insights and visualizations for your supply chain
              </p>
            </div>
          </div>

          <!-- Login/Register Cards -->
          <div
            :class="[
              'grid gap-6 max-w-4xl mx-auto',
              server.config.registration
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1 max-w-md',
            ]"
          >
            <!-- Login Card -->
            <div
              class="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer group"
              @click="router.push({ name: 'Login' })"
            >
              <!-- Decorative gradient -->
              <div
                class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent-500/20 to-pink-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"
              ></div>

              <div class="relative z-10">
                <!-- Icon -->
                <div
                  class="w-16 h-16 bg-accent-500/10 dark:bg-accent-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent-500/20 dark:group-hover:bg-accent-500/30 transition-colors"
                >
                  <svg-icon
                    type="mdi"
                    :path="mdiLogin"
                    class="h-8 w-8 text-accent-600 dark:text-accent-400"
                  ></svg-icon>
                </div>

                <!-- Content -->
                <h2
                  class="text-2xl font-bold text-gray-900 dark:text-white mb-3"
                >
                  Sign In
                </h2>
                <p class="text-gray-600 dark:text-gray-400 mb-6">
                  Access your account and manage your projects
                </p>

                <!-- Arrow indicator -->
                <div
                  class="flex items-center text-accent-600 dark:text-accent-400 font-semibold group-hover:translate-x-2 transition-transform duration-300"
                >
                  <span>Continue to Login</span>
                  <svg
                    class="w-5 h-5 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Register Card (only if registration is enabled) -->
            <div
              v-if="server.config.registration"
              class="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer group"
              @click="router.push({ name: 'Register' })"
            >
              <!-- Decorative gradient -->
              <div
                class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"
              ></div>

              <div class="relative z-10">
                <!-- Icon -->
                <div
                  class="w-16 h-16 bg-blue-500/10 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 dark:group-hover:bg-blue-500/30 transition-colors"
                >
                  <svg-icon
                    type="mdi"
                    :path="mdiAccountPlus"
                    class="h-8 w-8 text-blue-600 dark:text-blue-400"
                  ></svg-icon>
                </div>

                <!-- Content -->
                <h2
                  class="text-2xl font-bold text-gray-900 dark:text-white mb-3"
                >
                  Create Account
                </h2>
                <p class="text-gray-600 dark:text-gray-400 mb-6">
                  Join us and start monitoring your supply chain
                </p>

                <!-- Arrow indicator -->
                <div
                  class="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-2 transition-transform duration-300"
                >
                  <span>Get Started</span>
                  <svg
                    class="w-5 h-5 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Logged In View -->
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
        <AlertBanner
          v-if="hasSecurityIssues"
          variant="warning"
          :icon="mdiAlertCircle"
          :action="{
            label: 'Review Alerts',
            handler: navigateToSecurity,
          }"
        >
          <template #title>Security attention needed</template>
          You have {{ server.security?.critical || 0 }} critical and
          {{ server.security?.high || 0 }} high severity alerts that require
          immediate attention.
        </AlertBanner>

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
                  class="text-sm text-sec-total-600 dark:text-sec-total-400 hover:underline"
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
                  class="animate-spin rounded-full h-12 w-12 border-b-2 border-sec-total-500"
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
                  class="mt-4 px-4 py-2 bg-sec-total-600 hover:bg-sec-total-700 text-white rounded-md text-sm font-medium transition-colors"
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
