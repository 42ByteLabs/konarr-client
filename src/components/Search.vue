<script setup lang="ts">
import { onMounted, ref } from "vue";
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
    count.value = admin.userStats?.active || 0;
    total.value = admin.userStats?.total || 0;
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
});
</script>

<template>
  <!-- Search -->
  <div class="flex flex-col sm:flex-row gap-4 mb-6 mt-4 items-stretch">
    <!-- Search Input with Icon -->
    <div class="relative flex-1 group">
      <div
        class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
      >
        <svg-icon
          type="mdi"
          :path="mdiTextSearchVariant"
          class="w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-accent-500 dark:group-focus-within:text-accent-400 transition-colors duration-200"
        />
      </div>
      <input
        id="search"
        type="text"
        class="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500 dark:focus:ring-accent-400 focus:border-accent-500 dark:focus:border-accent-400 focus:shadow-xl transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 transform focus:scale-[1.01]"
        :placeholder="props.placeholder"
        @input="typeSearch"
      />
    </div>

    <!-- Stats Counter -->
    <div
      class="hidden sm:flex items-center justify-center px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md text-gray-700 dark:text-gray-300 font-semibold text-sm min-w-[100px] whitespace-nowrap"
    >
      <span class="text-accent-600 dark:text-accent-400">
        {{ props.count }}
      </span>
      <span class="mx-1.5">/</span>
      <span class="text-gray-500 dark:text-gray-400">
        {{ props.total }}
      </span>
    </div>

    <!-- Filter Dropdown -->
    <div v-if="selectables" class="sm:min-w-[140px]">
      <select
        id="search-filter"
        v-model="selected"
        class="w-full h-[50px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg shadow-md hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500 dark:focus:ring-accent-400 focus:border-accent-500 dark:focus:border-accent-400 px-4 py-3 transition-all duration-200 text-center font-semibold cursor-pointer transform focus:scale-[1.01]"
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
