<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { router } from "@/router";
import type { Project } from "@/types";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiLanguageMarkdown, mdiContentSave } from "@mdi/js";

import ProjectNav from "@/components/ProjectNav.vue";
import { primaryButton, outlineButton } from "@/utils/buttonClasses";
import { useProjectsStore } from "@/stores/projects";

const projects = useProjectsStore();

const project_id = parseInt(
  Array.isArray(router.currentRoute.value.params.id)
    ? router.currentRoute.value.params.id[0]
    : router.currentRoute.value.params.id,
);

// persistent fallback project used until the store returns the real project
const localProject = ref<Project>({
  id: project_id,
  name: "",
  title: "Untitled Project",
  type: "Server",
  status: true,
  description: "",
  created_at: new Date().toISOString(),
  parent: 0,
  parents: [],
});

const update = async () => {
  await projects.update({
    id: project_id,
    title: project.value?.title || "",
    type: project.value?.type || "Server",
    description: project.value?.description || "",
    parent: project.value?.parent || 0,
  } as Project);
};

const cancel = () => {
  router.push({ name: "Project", params: { id: project_id } });
};

const project = computed(() => {
  // Return the project from the store if present, otherwise the local fallback
  const foundProject = projects.projects.find(
    (p: Project) => p.id === project_id,
  );
  return foundProject ?? localProject.value;
});

// Computed parents list (no side-effects) used by the parent select
const parentsList = computed(() => {
  const found = projects.projects.find((p: Project) => p.id === project_id);
  if (found && Array.isArray(found.parents) && found.parents.length > 0) {
    return found.parents;
  }
  return projects.projects.filter((p: Project) => p.id !== project_id);
});

onMounted(() => {
  projects.fetchProject(project_id, true);
});
</script>

<template>
  <main>
    <div class="container mt-4 mb-6 w-full mx-auto">
      <ProjectNav
        :id="project.id"
        title="Edit Project"
        :parent="project.parent"
      />
    </div>
    <div class="container mt-6 mb-10 w-full max-w-2xl mx-auto">
      <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <form>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white">
              Edit Project
            </h2>
            <div class="flex gap-2">
              <button type="button" :class="outlineButton()" @click="cancel">
                Cancel
              </button>
              <button type="button" :class="primaryButton()" @click="update">
                <svg-icon type="mdi" :path="mdiContentSave" />
                Save
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-2">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                >Project Title <span class="text-red-500">*</span></label
              >
              <input
                id="title"
                v-model="project.title"
                type="text"
                name="title"
                placeholder="Project title..."
                class="block w-full rounded-md border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-300"
              />
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
                >Project Type</label
              >
              <select
                id="type"
                v-model="project.type"
                name="type"
                class="block w-full rounded-md border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-3 py-2"
              >
                <option value="Server">Server</option>
                <option value="Group">Group</option>
                <option value="Container">Container</option>
              </select>
            </div>
          </div>

          <div class="mt-4">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
              >Parent Project</label
            >
            <select
              id="parent"
              v-model.number="project.parent"
              name="parent"
              class="block w-full rounded-md border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-3 py-2"
            >
              <option :value="0">None / Root</option>
              <option v-for="p in parentsList" :key="p.id" :value="p.id">
                {{ p.name }}
              </option>
            </select>
          </div>

          <div class="mt-4">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
              >Project Description</label
            >
            <textarea
              id="description"
              v-model="project.description"
              name="description"
              placeholder="Project description..."
              class="block w-full rounded-md border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-3 py-2 h-40 resize-vertical"
            ></textarea>
            <div
              class="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2"
            >
              <svg-icon type="mdi" :path="mdiLanguageMarkdown" />
              Supports Markdown
            </div>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>
