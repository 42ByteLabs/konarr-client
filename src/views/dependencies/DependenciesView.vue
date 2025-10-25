<script setup lang="ts">
import { onMounted } from "vue";
import { router } from "@/router";

import Title from "@/components/Title.vue";
import DependencyTile from "@/components/DependencyTile.vue";
import Pagination from "@/components/Pagination.vue";
import Search from "@/components/Search.vue";

import { useDependenciesStore } from "@/stores/dependencies";

const dependencies = useDependenciesStore();
const qselect = router.currentRoute.value.query.select as string;

onMounted(() => {
  dependencies.setSnapshot(0);
  const qquery = router.currentRoute.value.query.search as string;
  const qpageParam = router.currentRoute.value.query.page;
  const qpage =
    parseInt((Array.isArray(qpageParam) ? qpageParam[0] : qpageParam) || "1") -
    1;

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
  os: "Operating System",
  lib: "Libraries",
  application: "Applications",
  programming_language: "Programming Languages",
  package_manager: "Package Managers",
  database: "Databases",
  cryptography: "Cryptography",
};
</script>

<template>
  <main>
    <div class="container mt-4 mb-6 w-full mx-auto dark:text-white px-2">
      <Title
        title="Dependencies"
        description="List of Global Components & Dependencies"
        :subtitle="(qselect as string) || undefined"
      />

      <div class="w-full">
        <Search
          searching="dependencies"
          placeholder="Find dependency..."
          :selectables="selectables"
          :count="dependencies.count"
          :total="dependencies.total"
          :limit="24"
        />

        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-4 mt-8"
        >
          <DependencyTile
            v-for="dep in dependencies.dependencies"
            :key="dep.id"
            :dependency="dep"
          />
        </div>

        <Pagination
          v-if="dependencies.pages !== 1"
          :page="dependencies.page"
          :pages="dependencies.pages"
          :next="dependencies.fetchNextPage"
          :prev="dependencies.fetchPrevPage"
        />
      </div>
    </div>
  </main>
</template>
