<script setup lang="ts">
import { computed } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiGraph, mdiSecurity, mdiGroup, mdiCloudOffOutline, mdiCloudCheckOutline } from "@mdi/js";

import type { KonarrProject } from "@/types";
import ProjectIcon from "@/components/ProjectIcon.vue";
import { useProjectsStore } from "@/stores/projects";

const projects = useProjectsStore();

const props = defineProps<{
    project?: KonarrProject;
    id?: number;
}>();

const project = computed(() => {
    if (props.project) {
        return props.project;
    } else {
        projects.getCurrentProject(props.id);
        return projects.projects.find(
            (p: KonarrProject) => p.id === projects.current,
        );
    }
});

const link = computed(() => {
    return `/projects/${props.project.id}`;
});
</script>

<template>
    <div class="bg-white dark:bg-gray-700 shadow-md rounded-lg hover:bg-accent-500 py-2">
        <router-link :to="{ name: 'Project', params: { id: project.id } }"
            class="dark:text-white hover:bg-pink-500 hover:shadow-lg">
            <h3 class="flex justify-center text-lg font-semibold">
                {{ props.project.title || props.project.name }}
            </h3>

            <div class="grid grid-cols-4 mt-4 mb-2">
                <!-- Type -->
                <div class="flex items-center justify-center col-span-1">
                    <ProjectIcon :type="project.type" />
                    <span v-if="project.children" class="ml-1">
                        {{ project.children.length || 0 }}
                    </span>
                </div>
                <!-- Online Status -->
                <div class="flex items-center justify-center col-span-1 mr-2">
                    <svg-icon v-if="project.status === true" type="mdi" :path="mdiCloudCheckOutline"
                        class="text-blue-400"></svg-icon>
                    <svg-icon v-else type="mdi" :path="mdiCloudOffOutline" class="text-red-400"></svg-icon>
                </div>
                <!-- Dependencies -->
                <div v-if="project.snapshot && project.snapshot.dependencies"
                    class="flex items-center justify-center col-span-1 mr-2">
                    <svg-icon type="mdi" :path="mdiGraph" class="text-green-400"></svg-icon>
                    <span class="ml-1">
                        {{ project.snapshot.dependencies || 0 }}
                    </span>
                </div>
                <!-- Security -->
                <div v-if="project.security" class="flex items-center justify-center col-span-1 mr-2">
                    <svg-icon type="mdi" :path="mdiSecurity"></svg-icon>
                    <span class="ml-1">
                        {{ project.security || 0 }}
                    </span>
                </div>
            </div>
        </router-link>
    </div>
</template>
