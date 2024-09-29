<script setup lang="ts">
import { onMounted } from "vue";
import Title from "@/components/Title.vue";
import ProjectTile from "@/components/ProjectTile.vue";
import Search from "@/components/Search.vue";
import Loading from "@/components/Loading.vue";
import Pagination from "@/components/Pagination.vue";
import { useProjectsStore } from "@/stores/projects";

const projects = useProjectsStore();

onMounted(() => {
    const squery = new URLSearchParams(window.location.search).get("search");

    if (squery) {
        projects.searchProjects(squery);
    } else {
        projects.fetchProjects(0, 24);
    }
});
</script>

<template>
    <main>
        <div class="container mt-4 mb-6 w-full mx-auto">
            <Title title="Projects" description="List of Projects" />

            <Loading v-if="projects.loading" />

            <div v-else class="w-full">
                <Search searching="projects" placeholder="Find projects..." />

                <hr class="my-6 border-gray-300" />

                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-4">
                    <ProjectTile v-for="project in projects.data" :key="project.id" :project="project" />
                </div>

                <Pagination :page="projects.page" :pages="projects.pages" :next="projects.fetchNextPage"
                    :prev="projects.fetchPrevPage" />
            </div>
        </div>
    </main>
</template>
