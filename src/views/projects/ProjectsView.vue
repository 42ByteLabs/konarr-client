<script setup lang="ts">
import { onMounted } from "vue";
import { router } from "@/router";

import Title from "@/components/Title.vue";
import ProjectTile from "@/components/ProjectTile.vue";
import Search from "@/components/Search.vue";
import Loading from "@/components/Loading.vue";
import Pagination from "@/components/Pagination.vue";
import { useProjectsStore } from "@/stores/projects";

const selectables = {
    "servers": "Servers",
    "containers": "Containers",
    "groups": "Groups",
};

const projects = useProjectsStore();

onMounted(() => {
    const squery = router.currentRoute.value.query.search;
    const sselect = router.currentRoute.value.query.select;

    if (squery) {
        projects.searchProjects(squery);
    } else if (sselect && sselect === "") {
        projects.fetchProjects(0, 24, true)
    } else if (sselect && sselect !== "" && sselect !== "All") {
        projects.fetchProjects(0, 24, false, sselect)
    } else {
        projects.fetchProjects(0, 24, true);
    }
});

</script>

<template>
    <main>
        <div class="container mt-4 mb-6 w-full mx-auto">
            <Title title="Projects" description="List of Projects" />

            <Loading v-if="projects.loading" />

            <div v-else class="w-full">
                <Search searching="projects" placeholder="Find projects..." :total="projects.total" limit="24"
                    :selectables="selectables" :count="projects.data.length" />

                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-12">
                    <ProjectTile v-for="project in projects.data" :key="project.id" :project="project" />
                </div>

                <Pagination v-if="projects.pages !== 1" :page="projects.page" :pages="projects.pages"
                    :next="projects.fetchNextPage" :prev="projects.fetchPrevPage" />
            </div>
        </div>
    </main>
</template>
