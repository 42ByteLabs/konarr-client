<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { router } from "@/router";
import type { KonarrProject } from "@/types";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiLanguageMarkdown } from "@mdi/js";

import Title from "@/components/Title.vue";
import ProjectNav from "@/components/ProjectNav.vue";
import { useProjectsStore } from "@/stores/projects";
import { useServerStore } from "@/stores/server";

const server = useServerStore();
const projects = useProjectsStore();

const project_id = parseInt(router.currentRoute.value.params.id);

const update = async () => {
    await projects.update({
        id: project_id,
        title: project.title,
        type: project.type,
        description: project.description,
        parent: project.parent || 0,
    });
};

const project = computed(() => {
    // Check if the project is already present in the store
    return projects.data.find((p: KonarrProject) => p.id === project_id)
        || {
        id: project_id,
        title: "Untitled Project",
        type: "Server",
        description: "",
        parent: 0,
    };
});

onMounted(() => {
    // Get the top projects
    projects.fetchProjects(0, 24, false, true);
    projects.fetchProject(project_id);
});

</script>

<template>
    <main>
        <div class="container mt-4 mb-6 w-full mx-auto">
            <ProjectNav title="Edit Project" :id="project.id" :parent="project.parent" />
        </div>
        <div class="container mt-4 mb-6 w-full max-w-xl mx-auto">
            <form>
                <!-- Project Title -->
                <div class="mb-4 grid grid-cols-6">
                    <div class="col-span-4">
                        <label for="username" class="block text-gray-700 dark:text-white text-sm font-bold mb-2">
                            <span class="text-red-500">*</span>
                            Project Title
                        </label>
                        <input type="text" id="title" name="title" placeholder="Project title..." :value="project.title"
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div class="col-span-2 pl-6">
                        <!-- Project Type -->
                        <label for="type" class="block text-gray-700 dark:text-white text-sm font-bold mb-2">
                            <span class="text-red-500">*</span>
                            Project Type
                        </label>
                        <select id="type" name="type" v-model="project.type"
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                            <option value="Server" selected>Server</option>
                            <option value="Group">Group</option>
                            <option value="Container">Container</option>
                        </select>
                    </div>
                </div>
                <!-- Parent Project (optional) -->
                <div class="mb-4">
                    <label for="parent" class="block text-gray-700 dark:text-white text-sm font-bold mb-2">
                        Parent Project
                    </label>
                    <select id="parent" name="parent" v-model="project.parent"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <option value="0">None / Root</option>
                        <option v-for="p in projects.data" :key="p.id" :value="p.id"
                            :selected="p.id === project.parent">
                            {{ p.name }}
                        </option>
                    </select>
                </div>
                <!-- Project Description (optional) -->
                <div class="mb-4">
                    <label for="description" class="block text-gray-700 dark:text-white text-sm font-bold mb-2">
                        Project Description
                    </label>
                    <textarea id="description" name="description" placeholder="Project description..."
                        v-model="project.description"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 h-40 leading-tight focus:outline-none focus:shadow-outline">
                    </textarea>
                    <label class="text-accent-500">
                        <svg-icon type="mdi" :path="mdiLanguageMarkdown" />
                    </label>
                </div>
                <!-- Create Project Button -->
                <div class="grid grid-cols-6 mt-6">
                    <button
                        class="col-span-2 col-start-3 bg-accent-500 hover:bg-accent-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button" @click="update">
                        Update
                    </button>
                </div>
            </form>
        </div>
    </main>
</template>
