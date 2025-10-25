<script setup lang="ts">
import { computed } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiGraph, mdiSecurity } from "@mdi/js";

import type { Project } from "@/types";
import ProjectIcon from "@/components/ProjectIcon.vue";
import { useProjectsStore } from "@/stores/projects";

const projects = useProjectsStore();

const props = defineProps<{
  project?: Project;
  id?: number;
}>();

const project = computed(() => {
  if (props.project) {
    return props.project;
  } else if (props.id) {
    projects.getCurrentProject(props.id);
    return projects.data.find((p: Project) => p.id === projects.current);
  }
  return null;
});
</script>

<template>
  <router-link
    v-if="project"
    :to="{ name: 'Project', params: { id: project.id } }"
    :aria-label="`View project ${project.title || project.name}`"
    class="block bg-white dark:bg-gray-800 shadow-md hover:shadow-xl rounded-lg p-5 border border-gray-200 dark:border-gray-700 hover:border-accent-500 dark:hover:border-accent-400 transition-all duration-200 transform hover:scale-[1.02] group"
  >
    <!-- Project Title -->
    <div class="flex items-start justify-between mb-4">
      <h3
        class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors line-clamp-2"
      >
        {{ project.title || project.name }}
      </h3>
      <ProjectIcon
        :type="project.type || ''"
        class="flex-shrink-0 ml-2"
        aria-hidden="true"
      />
    </div>

    <!-- Project Metadata -->
    <div
      class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400"
    >
      <!-- Children Count -->
      <div v-if="project.children" class="flex items-center">
        <ProjectIcon
          :type="project.type || ''"
          size="16"
          aria-hidden="true"
          class="mr-1"
        />
        <span>{{ project.children.length }} sub-projects</span>
      </div>

      <!-- Dependencies Count -->
      <div
        v-if="project.snapshot && project.snapshot.dependencies"
        class="flex items-center"
      >
        <svg-icon
          type="mdi"
          :path="mdiGraph"
          aria-hidden="true"
          class="text-green-500 mr-1"
          :size="18"
        ></svg-icon>
        <span>{{ project.snapshot.dependencies }}</span>
      </div>

      <!-- Security Status -->
      <div v-if="project.security" class="flex items-center">
        <svg-icon
          v-if="project.security.critical !== 0"
          type="mdi"
          :path="mdiSecurity"
          aria-hidden="true"
          class="text-red-500 mr-1"
          :size="18"
        ></svg-icon>
        <svg-icon
          v-else-if="project.security.high !== 0"
          type="mdi"
          :path="mdiSecurity"
          aria-hidden="true"
          class="text-orange-500 mr-1"
          :size="18"
        ></svg-icon>
        <svg-icon
          v-else-if="project.security.medium !== 0"
          type="mdi"
          :path="mdiSecurity"
          aria-hidden="true"
          class="text-yellow-500 mr-1"
          :size="18"
        ></svg-icon>
        <svg-icon
          v-else-if="project.security.low !== 0"
          type="mdi"
          :path="mdiSecurity"
          aria-hidden="true"
          class="text-green-500 mr-1"
          :size="18"
        ></svg-icon>
        <svg-icon
          v-else
          type="mdi"
          :path="mdiSecurity"
          aria-hidden="true"
          class="text-gray-400 mr-1"
          :size="18"
        ></svg-icon>
        <span
          :class="{
            'text-red-600 dark:text-red-400 font-semibold':
              project.security.critical > 0,
            'text-orange-600 dark:text-orange-400 font-semibold':
              project.security.high > 0 && project.security.critical === 0,
          }"
        >
          {{ project.security.total }}
        </span>
      </div>
    </div>

    <!-- Optional: Project Type Badge -->
    <div class="mt-3">
      <span
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300"
      >
        {{ project.type }}
      </span>
    </div>
  </router-link>
</template>
