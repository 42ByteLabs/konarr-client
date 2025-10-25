<script setup lang="ts">
import { onMounted, onUpdated, computed } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import {
  mdiMenuLeft,
  mdiPackageVariantClosed,
  mdiCodeTags,
  mdiSourceBranch,
} from "@mdi/js";

import { router } from "@/router";

import Title from "@/components/Title.vue";
import type { Dependency } from "@/types";

import { useDependenciesStore } from "@/stores/dependencies";
import ProjectTile from "@/components/ProjectTile.vue";
import DependencyIcon from "@/components/DependencyIcon.vue";
import Feedback from "@/components/Feedback.vue";

const dependencies = useDependenciesStore();

const props = defineProps<{
  id?: number;
  snapshot?: number;
}>();

onMounted(() => {
  const snapshotParam = router.currentRoute.value.query.snapshot;
  const snapshot = Array.isArray(snapshotParam)
    ? parseInt(snapshotParam[0] || "0")
    : snapshotParam
      ? parseInt(snapshotParam)
      : undefined;

  if (props.id) {
    dependencies.getDependency(props.id, snapshot);
  } else {
    // Get ID from the URL
    const current = parseInt(window.location.pathname.split("/").pop()!);
    dependencies.fetchDependency(current, snapshot);
  }
});

onUpdated(() => {
  const snapshotParam = router.currentRoute.value.query.snapshot;
  const snapshot = Array.isArray(snapshotParam)
    ? parseInt(snapshotParam[0] || "0")
    : snapshotParam
      ? parseInt(snapshotParam)
      : undefined;
  dependencies.getDependency(props.id, snapshot);
});

var dependency = computed(() => {
  return dependencies.data.find(
    (c: Dependency) => c.id === dependencies.current
  );
});
var dependency_type = computed(() => {
  switch (dependency.value?.type) {
    case "OperatingSystem":
      return "Operating System";
    case "PackageManager":
      return "Package Manager";
    case "CryptographyLibrary":
      return "Cryptography Library";
    case "ProgrammingLanguage":
      return "Programming Language";
    case "OperatingEnvironment":
      return "OS Environment";
    case "CompressionLibrary":
      return "Compression Library";
    default:
      return dependency.value?.type;
  }
});
</script>

<template>
  <main>
    <div
      v-if="dependency"
      class="container mt-4 mb-12 w-full mx-auto dark:text-white px-2"
    >
      <!-- Back Button and Catalogue Request -->
      <div class="flex justify-between items-center mb-6">
        <router-link
          v-if="dependency.version"
          :to="{ name: 'Dependency', params: { id: props.id } }"
          class="inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 px-3 py-2 text-sm rounded-md bg-accent-500 hover:bg-accent-600 text-white shadow-sm hover:shadow-md"
        >
          <svg-icon
            type="mdi"
            :path="mdiMenuLeft"
            class="h-4 w-4 mr-1.5"
          ></svg-icon>
          <span>Back to Dependency</span>
        </router-link>
        <router-link
          v-else
          :to="{ name: 'Dependencies' }"
          class="inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 px-3 py-2 text-sm rounded-md bg-accent-500 hover:bg-accent-600 text-white shadow-sm hover:shadow-md"
        >
          <svg-icon
            type="mdi"
            :path="mdiMenuLeft"
            class="h-4 w-4 mr-1.5"
          ></svg-icon>
          <span>Back to Dependencies</span>
        </router-link>
        <Feedback
          title="Catalogue Request"
          issue_template="catalogue-request"
          info="Request a component catalogue entry or update for this dependency"
          labels="comp-catalogue"
          :input="'[Catalogue]:+' + dependency.name"
        />
      </div>

      <!-- Dependency Header Card -->
      <div
        class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-6 border-l-4 border-accent-500"
      >
        <div class="flex items-start">
          <div class="flex-shrink-0 mr-4">
            <DependencyIcon :dep="dependency" size="64" />
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between mb-2">
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ dependency.name }}
              </h1>
              <span
                v-if="dependency.version"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300"
              >
                v{{ dependency.version }}
              </span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {{ dependency.purl }}
            </p>
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
            >
              {{ dependency_type }}
            </span>
          </div>
        </div>
      </div>

      <!-- Versions and Projects Sections -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Versions Section -->
        <div v-if="dependency.versions" class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h2
              class="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center"
            >
              <svg-icon
                type="mdi"
                :path="mdiSourceBranch"
                class="h-6 w-6 mr-2 text-accent-500"
              ></svg-icon>
              Versions
              <span
                class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                {{ dependency.versions.length }}
              </span>
            </h2>

            <div class="space-y-2 max-h-96 overflow-y-auto">
              <div
                v-for="version in dependency.versions"
                :key="version"
                class="bg-gray-50 dark:bg-gray-700 rounded-md px-3 py-2 text-sm font-mono text-gray-700 dark:text-gray-300 hover:bg-accent-50 dark:hover:bg-accent-900/20 transition-colors"
              >
                {{ version }}
              </div>
            </div>
          </div>
        </div>

        <!-- Projects Section -->
        <div
          v-if="dependency.projects"
          :class="dependency.versions ? 'lg:col-span-2' : 'lg:col-span-3'"
        >
          <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <h2
              class="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center"
            >
              <svg-icon
                type="mdi"
                :path="mdiCodeTags"
                class="h-6 w-6 mr-2 text-accent-500"
              ></svg-icon>
              Projects Using This Dependency
              <span
                class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                {{ dependency.projects.length }}
              </span>
            </h2>

            <div
              class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
              :class="{ 'xl:grid-cols-2': dependency.versions }"
            >
              <div v-for="child in dependency.projects" :key="child.id">
                <ProjectTile :id="child.id" :project="child" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="container mt-4 mb-6 w-full max-w-2xl mx-auto px-2">
      <div
        class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 text-center"
      >
        <svg-icon
          type="mdi"
          :path="mdiPackageVariantClosed"
          class="h-16 w-16 mx-auto mb-4 text-gray-400"
        ></svg-icon>
        <Title
          title="Dependency Not Found"
          subtitle="The requested dependency could not be found"
          description="Please check the dependency ID and try again"
        />
        <router-link
          :to="{ name: 'Dependencies' }"
          class="inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 px-3 py-2 text-sm rounded-md bg-accent-500 hover:bg-accent-600 text-white shadow-sm hover:shadow-md mt-4"
        >
          Back to Dependencies
        </router-link>
      </div>
    </div>
  </main>
</template>
