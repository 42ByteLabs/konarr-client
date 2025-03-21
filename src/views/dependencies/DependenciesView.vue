<script setup lang="ts">
import { onMounted } from "vue";
import { router } from "@/router";
import SvgIcon from "@jamescoyle/vue-icon";

import Title from "@/components/Title.vue";
import DependencyIcon from "@/components/DependencyIcon.vue";
import DependencyTable from "@/components/DependencyTable.vue";
import Pagination from "@/components/Pagination.vue";
import Search from "@/components/Search.vue";
import Loading from "@/components/Loading.vue";

import { useDependenciesStore } from "@/stores/dependencies";

const dependencies = useDependenciesStore();
const qselect = router.currentRoute.value.query.select;

onMounted(() => {
    dependencies.setSnapshot(0);
    const qquery = router.currentRoute.value.query.search;
    const qpage = parseInt(router.currentRoute.value.query.page || 1) - 1;

    if (qquery) {
        dependencies.searchDependencies(qquery);
    } else if (qselect && qselect === "") {
        dependencies.fetchDependencies(qpage, 24, true);
    } else if (qselect && qselect !== "" && qselect !== "All") {
        dependencies.fetchDependencies(qpage, 24, false, qselect);
    } else {
        // Set snapshot id to 0 to fetch all dependencies
        dependencies.fetchDependencies(qpage, 24);
    }
});

const selectables = {
    "os": "Operating System",
    "lib": "Libraries",
    "application": "Applications",
    "programming_language": "Programming Languages",
    "package_manager": "Package Managers",
    "database": "Databases",
    "cryptography": "Cryptography",
};

</script>

<template>
    <main>
        <div class="container mt-4 mb-6 w-full mx-auto dark:text-white px-2">
            <Title title="Dependencies" description="List of Global Components & Dependencies" :subtitle="qselect" />

            <div class="w-full">
                <Search searching="dependencies" placeholder="Find dependency..." :selectables="selectables"
                    :count="dependencies.count" :total="dependencies.total" :limit="24" />

                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 my-4 mt-8">
                    <router-link :to="{ name: 'Dependency', params: { id: dep.id } }" v-for="dep in dependencies.data"
                        :key="dep.id"
                        class="bg-gray-50 dark:bg-gray-800 dark:text-white hover:bg-accent-500 shadow-md rounded-lg p-4">
                        <div class="grid grid-cols-8">
                            <div class="col-span-1">
                                <DependencyIcon :dep="dep" />
                            </div>
                            <div class="col-span-6">
                                <h3 class="ml-2 text-lg font-semibold">
                                    {{ dep.name }}
                                </h3>
                                <h5 class="ml-2 text-sm text-gray-500 hover:text-gray-800">
                                    {{ dep.purl }}
                                </h5>
                            </div>
                            <div class="col-span-1">
                                <svg-icon type="mdi" path="mdiCheckCircle" class="h-6 w-6 ml-2"></svg-icon>
                            </div>
                        </div>
                    </router-link>
                </div>

                <Pagination v-if="dependencies.pages !== 1" :page="dependencies.page" :pages="dependencies.pages"
                    :next="dependencies.fetchNextPage" :prev="dependencies.fetchPrevPage" />
            </div>
        </div>
    </main>
</template>
