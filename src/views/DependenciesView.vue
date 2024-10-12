<script setup lang="ts">
import { onMounted } from "vue";
import Title from "@/components/Title.vue";

import { useDependenciesStore } from "@/stores/dependencies";
import DependencyIcon from "@/components/DependencyIcon.vue";
import DependencyTable from "@/components/DependencyTable.vue";
import Pagination from "@/components/Pagination.vue";
import Search from "@/components/Search.vue";
import Loading from "@/components/Loading.vue";

const dependencies = useDependenciesStore();

onMounted(() => {
    dependencies.setSnapshot(0);
    const squery = new URLSearchParams(window.location.search).get("search");

    if (squery) {
        dependencies.searchDependencies(squery);
    } else {
        // Set snapshot id to 0 to fetch all dependencies
        dependencies.fetchDependencies(0, 24);
    }
});

const selectables = {
    "operatin_systems": "Operating System",
    "libraries": "Libraries",
};

</script>

<template>
    <main>
        <div class="container mt-4 mb-6 w-full mx-auto">
            <Title :title="'Dependencies - ' + dependencies.total"
                description="List of Global Components & Dependencies" />

            <div class="w-full px-4">
                <Search searching="dependencies" placeholder="Find dependency..." :selectables="selectables"
                    limit="24" />

                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-4 mt-8">
                    <div v-for="dep in dependencies.data" :key="dep.id"
                        class="bg-white dark:bg-gray-700 dark:text-white hover:bg-accent-500 shadow-md rounded-lg p-4">
                        <div class="flex items-center">
                            <DependencyIcon :dep="dep" />
                            <router-link :to="{ name: 'Dependency', params: { id: dep.id } }" class="flex items-center">
                                <h3 class="ml-2 text-lg font-semibold">{{ dep.name }}</h3>
                            </router-link>
                        </div>
                    </div>
                </div>

                <Pagination :page="dependencies.page" :pages="dependencies.pages" :next="dependencies.fetchNextPage"
                    :prev="dependencies.fetchPrevPage" />
            </div>
        </div>
    </main>
</template>
