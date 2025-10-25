<script setup lang="ts">
import { onMounted, watch } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiGraph } from "@mdi/js";

import { useDependenciesStore } from "@/stores/dependencies";
import { router } from "@/router";
import DependencyTile from "@/components/DependencyTile.vue";
import Loading from "@/components/Loading.vue";
import Search from "@/components/Search.vue";
import Pagination from "@/components/Pagination.vue";

const props = defineProps<{
  snapid: number;
  projectid?: number;
  limit?: number;
  total?: number;
}>();

const dependencies = useDependenciesStore();

onMounted(() => {
  dependencies.setSnapshot(props.snapid);
  // Fetch dependencies
  // Read page from URL (1-based in query) and convert to zero-based
  const qpageParam = router.currentRoute.value.query.page;
  let qpageStr = "1";
  if (Array.isArray(qpageParam)) qpageStr = qpageParam[0] || "1";
  else if (qpageParam) qpageStr = qpageParam as string;
  const qpage = parseInt(qpageStr) - 1;
  const page = isNaN(qpage) || qpage < 0 ? 0 : qpage;
  dependencies.fetchDependencies(page, props.limit || 12);
});

// When the store's page changes, update the URL so the page is preserved
watch(
  () => dependencies.page,
  (newPage) => {
    // Keep other existing query params (like select/search)
    const currentQuery = {
      ...(router.currentRoute.value.query as Record<string, any>),
    };
    if (newPage === 0) {
      // Remove page param for first page
      delete currentQuery.page;
    } else {
      // Use 1-based page in the URL
      currentQuery.page = String(newPage + 1);
    }
    // Use replace so we don't add a new history entry and explicitly keep
    // the current route name/params — this ensures only the `page` query
    // parameter is updated in-place.
    router.replace({
      name: router.currentRoute.value.name as any,
      params: router.currentRoute.value.params,
      query: currentQuery,
    });
  },
);
</script>

<template>
  <div>
    <div class="flex justify-center items-center mb-4">
      <svg-icon
        type="mdi"
        :path="mdiGraph"
        class="mr-2 text-accent-500"
      ></svg-icon>
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
        Dependencies
      </h2>
    </div>

    <Loading v-if="dependencies.loading" />

    <div v-else>
      <Search
        searching="dependencies"
        placeholder="Find dependency..."
        :total="dependencies.total"
        :count="dependencies.count"
      />

      <!-- Card Grid Layout -->
      <div
        v-if="dependencies.count > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 my-4"
      >
        <DependencyTile
          v-for="dependency in dependencies.dependencies"
          :key="dependency.id"
          :dependency="dependency"
        />
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 text-center"
      >
        <svg-icon
          type="mdi"
          :path="mdiGraph"
          class="h-16 w-16 mx-auto mb-4 text-gray-400"
        ></svg-icon>
        <p class="text-gray-600 dark:text-gray-400">No dependencies found</p>
      </div>

      <Pagination
        v-if="dependencies.pages > 1"
        :page="dependencies.page"
        :pages="dependencies.pages"
        :next="dependencies.fetchNextPage"
        :prev="dependencies.fetchPrevPage"
      />
    </div>
  </div>
</template>
