<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { router } from "@/router";

import SvgIcon from "@jamescoyle/vue-icon";
import { mdiTextSearchVariant } from "@mdi/js";

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'


import { useProjectsStore } from "@/stores/projects";
import { useDependenciesStore } from "@/stores/dependencies";

const projects = useProjectsStore();
const dependencies = useDependenciesStore();

const props = defineProps<{
    searching: string;
    placeholder?: string;
    selectables?: Object;
    limit?: number;
    count?: number;
    total?: number;
}>();

var count = ref(props.count || 0);
var total = ref(props.total || 0);

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
        count.value = dependencies.count;
        total.value = dependencies.total;
    } else {
        console.error("Unknown searching type: " + props.searching);
    }
};

const selected = ref("Top");

const select = (value) => {
    selected.value = value.target.value;

    if (selected.value === "Top") {
        router.push({ query: {} });
        dependencies.fetchDependencies(0, props.limit || 10, true);
    } else if (selected.value === "All") {
        router.push({ query: { select: "all" } });
        dependencies.fetchDependencies(0, props.limit || 10, false);
    }
    else if (props.searching === "dependencies") {
        router.push({ query: { select: selected.value } });
        dependencies.fetchDependencies(0, props.limit || 10, false, selected.value);
    } else {
        console.error("Unknown searching type: " + props.searching);
    }

    count.value = dependencies.count;
    total.value = dependencies.total;
};

var active = ref();
var current = ref();

onMounted(() => {
    const squery = router.currentRoute.value.query.search;
    selected.value = router.currentRoute.value.query.select || "Top";

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
        <div class="col-span-2 flex justify-center items-center">
            <svg-icon type="mdi" :path="mdiTextSearchVariant"
                class="w-6 h-6 text-gray-500 dark:text-gray-200"></svg-icon>
            <span class="ml-4 text-center">{{ count }} / {{ total }}</span>
        </div>

        <input type="text" id="search" :class="[selectables ? 'col-span-7' : 'col-span-8']"
            class="dark:bg-gray-700 dark:text-white col-start-3 px-4 py-2 border border-gray-300 rounded-md hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            @input="typeSearch" :placeholder="props.placeholder" />

        <div v-if="selectables" class="col-span-1 mt-1">
            <select id="countries"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-auto p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                @change="select" v-model="selected">
                <option :selected="selected == 'Top'">
                    Top
                </option>
                <option :selected="selected == 'All'">
                    All
                </option>
                <option v-for="(value, name, index) in props.selectables" key="name" :value="name"
                    :selected="selected === current">
                    {{ value }}
                </option>
            </select>
        </div>
    </div>
</template>
