<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { router } from "@/router";
import type { KonarrProject } from "@/types";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiLanguageMarkdown } from "@mdi/js";

import ProjectNav from "@/components/ProjectNav.vue";
import { useProjectsStore } from "@/stores/projects";

const projects = useProjectsStore();

const project_id = parseInt(
  Array.isArray(router.currentRoute.value.params.id)
    ? router.currentRoute.value.params.id[0]
    : router.currentRoute.value.params.id,
);
var parent = ref(0);
var type = ref("Server");

const update = async () => {
  await projects.update({
    id: project_id,
    title: project.value?.title || "",
    type: type.value,
    description: project.value?.description || "",
    parent: parent.value || 0,
  } as KonarrProject);
};

const project = computed(() => {
  // Check if the project is already present in the store
  const foundProject = projects.data.find(
    (p: KonarrProject) => p.id === project_id,
  );
  if (foundProject) {
    // Add available parent projects (all projects except this one and its children)
    foundProject.parents = projects.data.filter(
      (p: KonarrProject) => p.id !== project_id,
    );
    return foundProject;
  }
  return {
    id: project_id,
    title: "Untitled Project",
    type: "Server",
    description: "",
    parent: 0,
    parents: projects.data.filter((p: KonarrProject) => p.id !== project_id),
  };
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
    <div class="container mt-4 mb-6 w-full max-w-xl mx-auto">
      <form>
        <!-- Project Title -->
        <div class="mb-4 grid grid-cols-6">
          <div class="col-span-4">
            <label
              for="username"
              class="block text-gray-700 dark:text-white text-sm font-bold mb-2"
            >
              <span class="text-red-500">*</span>
              Project Title
            </label>
            <input
              id="title"
              v-model="project.title"
              type="text"
              name="title"
              placeholder="Project title..."
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div class="col-span-2 pl-6">
            <!-- Project Type -->
            <label
              for="type"
              class="block text-gray-700 dark:text-white text-sm font-bold mb-2"
            >
              <span class="text-red-500">*</span>
              Project Type
            </label>
            <select
              id="type"
              v-model="type"
              name="type"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="Server" selected>Server</option>
              <option value="Group">Group</option>
              <option value="Container">Container</option>
            </select>
          </div>
        </div>
        <!-- Parent Project (optional) -->
        <div class="mb-4">
          <label
            for="parent"
            class="block text-gray-700 dark:text-white text-sm font-bold mb-2"
          >
            Parent Project
          </label>
          <select
            id="parent"
            v-model="parent"
            name="parent"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option
              value="0"
              :selected="project.parent === undefined || project.parent === 0"
            >
              None / Root
            </option>
            <option v-for="p in project.parents" :key="p.id" :value="p.id">
              {{ p.name }}
            </option>
          </select>
        </div>
        <!-- Project Description (optional) -->
        <div class="mb-4">
          <label
            for="description"
            class="block text-gray-700 dark:text-white text-sm font-bold mb-2"
          >
            Project Description
          </label>
          <textarea
            id="description"
            v-model="project.description"
            name="description"
            placeholder="Project description..."
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 h-40 leading-tight focus:outline-none focus:shadow-outline"
          >
          </textarea>
          <label class="text-accent-500">
            <svg-icon type="mdi" :path="mdiLanguageMarkdown" />
          </label>
        </div>
        <!-- Create Project Button -->
        <div class="grid grid-cols-6 mt-6">
          <button
            class="col-span-2 col-start-3 bg-accent-500 hover:bg-accent-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            @click="update"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  </main>
</template>
