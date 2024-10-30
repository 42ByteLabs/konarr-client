<script setup lang="ts">
import { onMounted, onUpdated, computed, ref } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiBookshelf, mdiDevices, mdiMenuLeft } from "@mdi/js";

import { router } from "@/router";

import Title from "@/components/Title.vue";
import type { KonarrDependency } from "@/types";

import { useDependenciesStore } from "@/stores/dependencies";
import ProjectTile from "@/components/ProjectTile.vue";
import DependencyIcon from "@/components/DependencyIcon.vue";

const dependencies = useDependenciesStore();

const props = defineProps<{
    id?: number;
    snapshot?: number,
}>();

onMounted(() => {
    const snapshot = router.currentRoute.value.query.snapshot;

    if (props.id) {
        dependencies.getDependency(props.id, snapshot);
    } else {
        // Get ID from the URL
        const current = parseInt(window.location.pathname.split("/").pop()!);
        dependencies.fetchDependency(current, snapshot);
    }
});

onUpdated(() => {
    const snapshot = router.currentRoute.value.query.snapshot;
    dependencies.getDependency(props.id, snapshot);
});

var dependency = computed(() => {
    return dependencies.data.find(
        (c: KonarrDependency) => c.id === dependencies.current,
    );
});

</script>

<template>
    <main>
        <div v-if="dependency" class="container mt-4 mb-12 w-full mx-auto dark:text-white">
            <div class="grid md:grid-cols-10 sm:grid-cols-1">
                <div class="md:col-span-2 sm:grid-cols-1 text-black dark:text-white flex justify-center content-center">
                    <div v-if="dependency.version" class="mt-6">
                        <router-link :to="{ 'name': 'Dependency', 'params': { 'id': props.id } }"
                            class="text-black hover:text-gray-600 dark:hover:text-gray-100 mt-4">
                            <button
                                class="flex items-center rounded-md bg-accent-400 hover:bg-accent-500 p-2 pr-6 mt-2">
                                <svg-icon type="mdi" :path="mdiMenuLeft" class="h-6 w-6 mr-1">
                                </svg-icon>
                                Dependency
                            </button>
                        </router-link>
                    </div>
                    <div v-else class="mt-6">
                        <router-link :to="{ 'name': 'Dependencies' }"
                            class="text-black hover:text-gray-600 dark:hover:text-gray-100 mt-4">
                            <button
                                class="flex items-center rounded-md bg-accent-400 hover:bg-accent-500 p-2 pr-6 mt-2">
                                <svg-icon type="mdi" :path="mdiMenuLeft" class="h-6 w-6 mr-1">
                                </svg-icon>
                                Dependencies
                            </button>
                        </router-link>
                    </div>
                </div>
                <div class="md:col-span-6 sm:grid-cols-1">
                    <Title :title="dependency.name" />
                </div>
                <div class="md:col-span-2 sm:grid-cols-1 dark:text-white flex justify-center content-center pt-2">
                    <DependencyIcon :dep="dependency" size="96" />
                </div>
                <div class="md:col-span-2 sm:grid-cols-1 flex justify-center content-center">
                    <div v-if="dependency.version" class="text-center">
                        <a class="text-2xl w-full">
                            <strong>{{ dependency.version }}</strong>
                        </a>
                    </div>
                </div>
                <div class="md:col-span-6 sm:grid-cols-1">
                    <h4 class="text-2xl text-center">
                        {{ dependency.purl }}
                    </h4>
                </div>
                <div class="md:col-span-2 sm:grid-cols-1 flex justify-center content-center text-2xl text-center">
                    <span v-if="dependency.type == 'library'">
                        Library
                    </span>
                    <span v-else-if="dependency.type == 'operating_system'">
                        Operating System
                    </span>
                    <span v-else-if="dependency.type == 'application'">
                        Application
                    </span>
                    <span v-else-if="dependency.type == 'package_manager'">
                        Package Manager
                    </span>
                    <span v-else-if="dependency.type == 'cryptography_library'">
                        Cryptography Library
                    </span>
                    <span v-else-if="dependency.type == 'programming_language'">
                        Programming Language
                    </span>
                    <span v-else>
                        {{ dependency.type }}
                    </span>
                </div>
            </div>

            <hr class="my-6 bg-gray-400" />
            <div class="grid grid-cols-10 gap-6">
                <div v-if="dependency.versions" class="col-span-3">
                    <h3 class="text-2xl text-center dark:text-white mb-6 font-semibold">
                        Versions - {{ dependency.versions.length }}
                    </h3>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div v-for="version in dependency.versions" :key="version">
                            <div
                                class="col-span-1 bg-white dark:bg-gray-700 shadow-md rounded-lg hover:bg-accent-500 dark:text-white py-2 text-center">
                                <strong>{{ version }}</strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="dependency.projects" class="col-span-7">
                    <h3 class="text-2xl text-center dark:text-white mb-6 font-semibold">
                        Projects - {{ dependency.projects.length }}
                    </h3>

                    <div class="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
                        <div v-for="child in dependency.projects" :key="child.id">
                            <ProjectTile :project="child" :id="child.id" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="container mt-4 mb-6 w-full max-w-xs mx-auto">
            <Title title="Dependency" subtitle="Dependency not found"
                description="Please try again with a correct id" />
        </div>
    </main>
</template>
