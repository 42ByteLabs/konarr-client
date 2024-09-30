<script setup lang="ts">
import { computed, onMounted } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiTextSearchVariant } from "@mdi/js";

import router from "@/router";

import { useProjectsStore } from "@/stores/projects";
import { useDependenciesStore } from "@/stores/dependencies";

const projects = useProjectsStore();
const dependencies = useDependenciesStore();

const props = defineProps<{
    searching: string;
    placeholder?: string;
    limit?: number;
}>();

const typeSearch = (event) => {
    search(event.target.value);
};

const search = (value) => {
    // Search for projects
    if (props.searching === "projects") {
        if (value === "") {
            router.push({ query: {} });
            projects.fetchProjects(0, props.limit || 10);
        } else {
            router.push({ query: { search: value } });
            projects.searchProjects(value);
        }
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
    } else {
        console.error("Unknown searching type: " + props.searching);
    }
};

onMounted(() => {
    const squery = new URLSearchParams(window.location.search).get("search");

    if (squery) {
        // Update the search input
        const input = document.getElementById("search");
        if (input) {
            input.value = squery;
        }
    }
});
</script>

<template>
    <!-- Search -->
    <div class="grid grid-cols-12 gap-4 mb-6 mt-4">
        <div class="col-span-1 col-start-2 flex justify-center items-center">
            <svg-icon type="mdi" :path="mdiTextSearchVariant" class="w-6 h-6 text-gray-500"></svg-icon>
        </div>
        <input type="text" id="search"
            class="col-span-8 col-start-3 px-4 py-2 border border-gray-300 rounded-md hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            @input="typeSearch" :placeholder="props.placeholder" />
    </div>
</template>
