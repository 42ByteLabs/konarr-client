<script setup lang="ts">
import { onMounted, computed, ref } from "vue";
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
    // TODO: This is a hack to get the snapshot id from the URL
    const snapshot = parseInt(window.location.search.split("snapshot=")[1]);

    if (props.id) {
        dependencies.fetchDependency(props.id, snapshot);
    } else {
        // Get ID from the URL
        const current = parseInt(window.location.pathname.split("/").pop()!);
        dependencies.fetchDependency(current, snapshot);
    }
});

var dependency = computed(() => {
    return dependencies.data.find(
        (c: KonarrDependency) => c.id === dependencies.current,
    );
});

</script>

<template>
    <main>
        <div v-if="dependency" class="container mt-4 mb-6 w-full mx-auto">
            <div class="grid md:grid-cols-10 sm:grid-cols-1">
                <div class="md:col-span-2 sm:grid-cols-1 dark:text-white flex justify-center content-center">
                    <DependencyIcon :dep="dependency" size="96" />
                </div>
                <div class="md:col-span-6 sm:grid-cols-1">
                    <Title :title="dependency.name" :subtitle="dependency.purl" />
                </div>
                <div class="md:col-span-2 sm:grid-cols-1 dark:text-white flex justify-center content-center">
                    <div v-if="dependency.version" class="mt-6">
                        <a class="text-2xl w-full">
                            <strong>{{ dependency.version }}</strong>
                        </a>
                    </div>
                </div>
            </div>

            <hr class="my-6 bg-gray-400" />
            <div v-if="dependency.projects">
                <h3 class="text-2xl text-center dark:text-white mb-6">
                    Dependency Projects - {{ dependency.projects.length }}
                </h3>

                <div class="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
                    <div v-for="child in dependency.projects" :key="child.id">
                        <ProjectTile :project="child" :id="child.id" />
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
