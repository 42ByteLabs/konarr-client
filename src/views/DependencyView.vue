<script setup lang="ts">
import { onMounted, computed } from "vue";
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

const dependency = computed(() => {
    return dependencies.data.find(
        (c: KonarrDependency) => c.id === dependencies.current,
    );
});
</script>

<template>
    <main>
        <div v-if="dependency" class="container mt-4 mb-6 w-full mx-auto">
            <Title :title="dependency.name" :subtitle="dependency.purl" />

            <div v-if="dependency.projects">"
                <hr class="my-6 bg-gray-400" />
                <h3 class="text-2xl text-center dark:text-white mb-6">
                    Dependency Projects - {{ dependency.projects.length }}
                </h3>

                <div class="grid grid-cols-2 gap-2">
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
