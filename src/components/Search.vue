<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { router } from "@/router";

import SvgIcon from "@jamescoyle/vue-icon";
import { mdiTextSearchVariant } from "@mdi/js";

import { useProjectsStore } from "@/stores/projects";
import { useDependenciesStore } from "@/stores/dependencies";
import { useAdminStore } from "@/stores/admin";

const projects = useProjectsStore();
const dependencies = useDependenciesStore();
const admin = useAdminStore();

const props = defineProps<{
  searching: string;
  placeholder?: string;
  selectables?: Record<string, string>;
  limit?: number;
  count?: number;
  total?: number;
}>();

const count = ref(props.count || 0);
const total = ref(props.total || 0);

const typeSearch = (event: Event) => {
  const target = event.target as HTMLInputElement;
  search(target.value);
};

const search = (value: string) => {
  // Search for projects
  if (props.searching === "projects") {
    if (value === "") {
      router.push({ query: {} });
      projects.fetchProjects(0, props.limit || 10);
    } else {
      router.push({ query: { search: value } });
      projects.searchProjects(value);
    }
    count.value = projects.count;
    total.value = projects.total;

    // Search for dependencies
  } else if (props.searching === "dependencies") {
    if (value === "") {
      // Remove from URL
      router.push({ query: {} });
      dependencies.fetchDependencies(0, props.limit || 10);
    } else {
      // Push onto URL
      router.push({ query: { search: value } });
      dependencies.searchDependencies(value);
    }
    count.value = dependencies.count || 0;
    total.value = dependencies.total || 0;

    // Search for users (admin store)
  } else if (props.searching === "users") {
    if (value === "") {
      router.push({ query: {} });
      admin.getUsers({ page: 0, limit: props.limit || 10 });
    } else {
      router.push({ query: { search: value } });
      admin.getUsers({ page: 0, limit: props.limit || 10, search: value });
    }
    count.value = admin.adminSettings.userStats?.active || 0;
    total.value = admin.adminSettings.userStats?.total || 0;
  } else {
    console.error("Unknown searching type: " + props.searching);
  }
};

const selected = ref("Top");

const select = (value: Event) => {
  const target = value.target as HTMLSelectElement;
  selected.value = target.value;

  if (props.searching === "projects") {
    if (selected.value === "Top") {
      router.push({ query: {} });
      projects.fetchProjects(0, props.limit || 10, true);
    } else if (selected.value === "All") {
      router.push({ query: { select: "all" } });
      projects.fetchProjects(0, props.limit || 10, false);
    } else {
      router.push({ query: { select: selected.value } });
      projects.fetchProjects(0, props.limit || 10, false, selected.value);
    }
  } else if (props.searching === "dependencies") {
    if (selected.value === "Top") {
      router.push({ query: {} });
      dependencies.fetchDependencies(0, props.limit || 10, true);
    } else if (selected.value === "All") {
      router.push({ query: { select: "all" } });
      dependencies.fetchDependencies(0, props.limit || 10, false);
    } else {
      router.push({ query: { select: selected.value } });
      dependencies.fetchDependencies(
        0,
        props.limit || 10,
        false,
        selected.value,
      );
    }
  }
};

const handleSlashKey = (event: KeyboardEvent) => {
  // Only focus if the user is not already typing in an input or textarea
  const target = event.target as HTMLElement;
  const isInputField =
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.isContentEditable;

  if (event.key === "/" && !isInputField) {
    event.preventDefault();
    const searchInput = document.getElementById("search") as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  }
};

onMounted(() => {
  const squery = router.currentRoute.value.query.search;
  const selectParam = router.currentRoute.value.query.select;
  selected.value =
    (Array.isArray(selectParam) ? selectParam[0] : selectParam) || "Top";

  if (squery) {
    // Update the search input
    const input = document.getElementById("search") as HTMLInputElement;
    if (input) {
      input.value = Array.isArray(squery) ? (squery[0] ?? "") : (squery ?? "");
    }
  }

  // Add keyboard event listener for '/' key
  window.addEventListener("keydown", handleSlashKey);
});

onUnmounted(() => {
  // Clean up event listener when component is destroyed
  window.removeEventListener("keydown", handleSlashKey);
});
</script>

<template>
  <!-- Search -->
  <div class="grid grid-cols-12 gap-4 mb-6 mt-4">
    <div
      class="col-span-2 sm:col-span-1 flex justify-center items-center dark:text-white"
    >
      <svg-icon
        type="mdi"
        :path="mdiTextSearchVariant"
        class="w-6 h-6 text-gray-500 dark:text-gray-200"
      />
    </div>
    <div
      class="col-span-1 mb-2 justify-center items-center dark:text-white text-center hidden sm:block"
    >
      {{ props.count }} / {{ props.total }}
    </div>

    <input
      id="search"
      type="text"
      :class="[
        selectables ? 'col-span-9 sm:col-span-8' : 'col-span-10 sm:col-span-9',
      ]"
      class="dark:bg-gray-800 dark:text-white col-start-3 px-4 py-2 border border-gray-600 rounded-md hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
      :placeholder="props.placeholder"
      @input="typeSearch"
    />

    <div v-if="selectables" class="col-span-12 sm:col-span-2 mt-0.5">
      <select
        id="countries"
        v-model="selected"
        class="bg-gray-50 border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center"
        @change="select"
      >
        <option :selected="selected == 'Top'">Top</option>
        <option
          v-for="(value, name) in props.selectables"
          :key="name"
          :value="name"
        >
          {{ value }}
        </option>
      </select>
    </div>
  </div>
</template>
