<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import Title from "@/components/Title.vue";
import { useProjectsStore } from "@/stores/projects";

const projects = useProjectsStore();

const name = ref("");
const description = ref("");
const type = ref(0);
const parent = ref(0);

const create = async () => {
    await projects.create(name.value, type.value, description.value, parent.value);
};

onMounted(() => {
    projects.fetchProjects(0, 24, false, true);
});

</script>

<template>
    <main>
        <div class="container mt-4 mb-6 w-full mx-auto">
            <Title title="New Project" />
        </div>
        <div class="container mt-4 mb-6 w-full max-w-xl mx-auto">
            <form>
                <!-- Project Name -->
                <div class="mb-4 grid grid-cols-6">
                    <div class="col-span-4">
                        <label for="username" class="block text-gray-700 dark:text-white text-sm font-bold mb-2">
                            <span class="text-red-500">*</span>
                            Project Name
                        </label>
                        <input type="text" id="name" name="name" placeholder="Project name..." v-model="name"
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div class="col-span-2 pl-6">
                        <!-- Project Type -->
                        <label for="type" class="block text-gray-700 dark:text-white text-sm font-bold mb-2">
                            <span class="text-red-500">*</span>
                            Project Type
                        </label>
                        <select id="type" name="type" v-model="type"
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                            <option value="Server" selected>Server</option>
                            <option value="Group">Group</option>
                            <option value="Container">Container</option>
                        </select>
                    </div>
                </div>
                <!-- Project Description (optional) -->
                <div class="mb-4">
                    <label for="description" class="block text-gray-700 dark:text-white text-sm font-bold mb-2">
                        Project Description
                    </label>
                    <textarea id="description" name="description" placeholder="Project description..."
                        v-model="description"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    </textarea>
                </div>
                <!-- Parent Project (optional) -->
                <div class="mb-4">
                    <label for="parent" class="block text-gray-700 dark:text-white text-sm font-bold mb-2">
                        Parent Project
                    </label>
                    <select id="parent" name="parent" v-model="parent"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <option value="0">None</option>
                        <option v-for="p in projects.data" :key="p.id" :value="p.id">{{ p.name }}
                        </option>
                    </select>
                </div>
                <!-- Create Project Button -->
                <div class="grid grid-cols-6 mt-6">
                    <button
                        class="col-span-2 col-start-3 bg-accent-500 hover:bg-accent-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button" @click="create">
                        Create Project
                    </button>
                </div>
            </form>
        </div>
    </main>
</template>
