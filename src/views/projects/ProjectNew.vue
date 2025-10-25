<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useProjectsStore } from "@/stores/projects";
import type { Project } from "@/types";
import { primaryButton, outlineButton } from "@/utils/buttonClasses";

const projects = useProjectsStore();

const title = ref("");
const description = ref("");
const type = ref("Server");
const parent = ref(0);
const parents = ref<Project[]>([]);

const create = async () => {
  await projects.create(
    title.value,
    type.value,
    description.value,
    parent.value
  );
};

const cancel = () => {
  // Go back to the projects list
  window.history.back();
};

// use button helper functions directly in the template (call with ())

onMounted(async () => {
  // Fetch projects and parents list via the store
  projects.fetchProjects(0, 24, false);
  parents.value = await projects.fetchParentsList();
});
</script>

<template>
  <main>
    <div class="container mt-6 mb-10 w-full max-w-2xl mx-auto">
      <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <form>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white">
              New Project
            </h2>
            <div class="flex gap-2">
              <button type="button" :class="outlineButton()" @click="cancel">
                Cancel
              </button>
              <button type="button" :class="primaryButton()" @click="create">
                Create
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
                v-model="title"
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
                v-model="type"
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
              >Project Description</label
            >
            <textarea
              id="description"
              v-model="description"
              name="description"
              placeholder="Project description..."
              class="block w-full rounded-md border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-3 py-2 h-40 resize-vertical"
            ></textarea>
          </div>

          <div class="mt-4">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
              >Parent Project</label
            >
            <select
              id="parent"
              v-model.number="parent"
              name="parent"
              class="block w-full rounded-md border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-3 py-2"
            >
              <option :value="0">None</option>
              <option v-for="p in parents" :key="p.id" :value="p.id">
                {{ p.name }}
              </option>
            </select>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>
