<script setup lang="ts">
import { onMounted, computed } from "vue";
import Title from "@/components/Title.vue";
import type { KonarrDependency } from "@/types";

import { useDependenciesStore } from "@/stores/dependencies";
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
            <Loading v-if="dependencies.loading" />
        </div>
        <div v-else class="container mt-4 mb-6 w-full max-w-xs mx-auto">
            <Title title="Project" subtitle="Project not found" description="Please try again with a correct id" />
        </div>
    </main>
</template>
