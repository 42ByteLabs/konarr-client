<!--
DependencyTile Component
Displays a dependency card with type, name, version, and project count.

Props:
- dependency (KonarrDependency): The dependency object to display
- id (number, optional): Alternative way to specify dependency by ID

Example usage:
<DependencyTile :dependency="dep" />
<DependencyTile :id="123" />
-->
<script setup lang="ts">
import { computed } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiPackageVariantClosed, mdiChevronRight } from "@mdi/js";

import type { KonarrDependency } from "@/types";
import DependencyIcon from "@/components/DependencyIcon.vue";
import { useDependenciesStore } from "@/stores/dependencies";

const dependencies = useDependenciesStore();

const props = defineProps<{
  dependency?: KonarrDependency;
  id?: number;
}>();

const dependency = computed(() => {
  if (props.dependency) {
    return props.dependency;
  } else if (props.id) {
    return dependencies.data.find((d: KonarrDependency) => d.id === props.id);
  }
  return null;
});

// Format the dependency type for display
const formattedType = computed(() => {
  if (!dependency.value) return "";
  const type = dependency.value.type;
  // Convert PascalCase to space-separated words
  return type.replace(/([A-Z])/g, " $1").trim();
});

// Get the number of projects using this dependency
const projectCount = computed(() => {
  return dependency.value?.projects?.length || 0;
});
</script>

<template>
  <router-link
    v-if="dependency"
    :to="{ name: 'Dependency', params: { id: dependency.id } }"
    :aria-label="`View dependency ${dependency.name}`"
    class="block bg-white dark:bg-gray-800 shadow-md hover:shadow-xl rounded-lg p-5 border border-gray-200 dark:border-gray-700 hover:border-accent-500 dark:hover:border-accent-400 transition-all duration-200 transform hover:scale-[1.02] group"
  >
    <!-- Header with Icon and Name -->
    <div class="flex items-start mb-3">
      <div class="flex-shrink-0 mr-3">
        <DependencyIcon
          :dep="dependency"
          size="32"
          aria-hidden="true"
          class="text-accent-500 dark:text-accent-400"
        />
      </div>
      <div class="flex-1 min-w-0">
        <h3
          class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors truncate"
        >
          {{ dependency.name }}
        </h3>
        <p
          v-if="dependency.version"
          class="text-sm text-gray-500 dark:text-gray-400 truncate"
        >
          v{{ dependency.version }}
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

    <!-- PURL (Package URL) -->
    <div
      v-if="dependency.purl"
      class="mb-3 p-2 bg-gray-50 dark:bg-gray-900 rounded text-xs font-mono text-gray-600 dark:text-gray-400 truncate"
      :title="dependency.purl"
    >
      {{ dependency.purl }}
    </div>

    <!-- Footer with Type and Project Count -->
    <div class="flex items-center justify-between text-sm">
      <span
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300"
      >
        {{ formattedType }}
      </span>

      <div
        v-if="projectCount > 0"
        class="flex items-center text-gray-600 dark:text-gray-400"
      >
        <svg-icon
          type="mdi"
          :path="mdiPackageVariantClosed"
          aria-hidden="true"
          class="mr-1"
          :size="16"
        ></svg-icon>
        <span
          >{{ projectCount }}
          {{ projectCount === 1 ? "project" : "projects" }}</span
        >
      </div>
    </div>
  </router-link>
</template>
