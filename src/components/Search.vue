<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
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

// Custom select dropdown arrow SVG as data URI
const selectArrowStyle = computed(() => ({
  backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
  backgroundPosition: "right 0.5rem center",
  backgroundSize: "1.5em 1.5em",
}));

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
  <div class="mb-6 mt-4">
    <div
      class="relative flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-800/30 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <!-- Decorative gradient border effect -->
      <div
        class="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-500/10 via-transparent to-accent-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      ></div>

      <!-- Search Icon with animated background -->
      <div
        class="relative flex items-center justify-center sm:justify-start text-accent-500 dark:text-accent-400 z-10"
      >
        <div
          class="absolute inset-0 bg-accent-500/10 dark:bg-accent-500/20 rounded-full blur-md animate-pulse"
        ></div>
        <svg-icon
          type="mdi"
          :path="mdiTextSearchVariant"
          class="h-6 w-6 relative z-10"
          aria-hidden="true"
        />
      </div>

      <!-- Count Display with badge style -->
      <div class="hidden sm:flex items-center justify-center min-w-[90px] z-10">
        <div
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-500/10 dark:bg-accent-500/20 border border-accent-500/20 dark:border-accent-500/30"
        >
          <span
            class="text-sm font-bold text-accent-600 dark:text-accent-400 tabular-nums"
            >{{ props.count }}</span
          >
          <span class="text-xs text-gray-500 dark:text-gray-400">/</span>
          <span
            class="text-sm font-medium text-gray-600 dark:text-gray-400 tabular-nums"
            >{{ props.total }}</span
          >
        </div>
      </div>

      <!-- Search Input with enhanced styling -->
      <div class="flex-1 min-w-0 z-10 relative group">
        <input
          id="search"
          type="text"
          :placeholder="props.placeholder"
          class="w-full bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 hover:border-accent-400 dark:hover:border-accent-500 transition-all duration-200 shadow-inner group-hover:shadow-md"
          @input="typeSearch"
        />
        <!-- Animated underline effect -->
        <div
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-500 via-pink-500 to-accent-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-center rounded-full"
        ></div>
      </div>

      <!-- Select Dropdown with enhanced styling -->
      <div v-if="selectables" class="sm:min-w-[150px] z-10 relative group">
        <select
          id="search-select"
          v-model="selected"
          class="w-full bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200 cursor-pointer hover:border-accent-400 dark:hover:border-accent-500 shadow-inner hover:shadow-md appearance-none bg-no-repeat bg-right pr-10 font-medium"
          :style="selectArrowStyle"
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
        <!-- Animated underline effect for select -->
        <div
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-500 via-pink-500 to-accent-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-center rounded-full"
        ></div>
      </div>

      <!-- Mobile Count Display with enhanced badge -->
      <div class="flex sm:hidden items-center justify-center py-2 z-10">
        <div
          class="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent-500/10 to-pink-500/10 dark:from-accent-500/20 dark:to-pink-500/20 border border-accent-500/30 dark:border-accent-500/40 shadow-sm"
        >
          <span
            class="text-sm font-bold text-accent-600 dark:text-accent-400 tabular-nums"
            >{{ props.count }}</span
          >
          <span class="text-xs text-gray-500 dark:text-gray-400">/</span>
          <span
            class="text-sm font-medium text-gray-600 dark:text-gray-400 tabular-nums"
            >{{ props.total }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
