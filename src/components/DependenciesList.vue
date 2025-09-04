<script setup lang="ts">
import { onMounted } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiGraph } from "@mdi/js";

import { useDependenciesStore } from "@/stores/dependencies";
import DependencyIcon from "@/components/DependencyIcon.vue";
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
  dependencies.fetchDependencies(0, props.limit || 10);
});
</script>

<template>
  <div>
    <div class="flex justify-center items-center mb-4">
      <svg-icon type="mdi" :path="mdiGraph" class="mr-2"></svg-icon>
      <h2 class="text-2xl font-semibold">Dependencies</h2>
    </div>

    <Loading v-if="dependencies.loading" />

    <div v-else>
      <Search
        searching="dependencies"
        placeholder="Find dependency..."
        :total="dependencies.total"
        :count="dependencies.count"
      />

      <table class="table-auto w-full">
        <thead>
          <tr>
            <th class="px-4 py-2"></th>
            <th class="px-4 py-2">Name</th>
            <th class="px-4 py-2">Version</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="dependency in dependencies.data" :key="dependency.id">
            <td class="border px-4 py-2 w-6">
              <DependencyIcon :dep="dependency" />
            </td>
            <td class="border px-4 py-2">
              <router-link
                :to="{
                  name: 'Dependency',
                  params: { id: dependency.id },
                  query: { snapshot: snapid },
                }"
              >
                {{ dependency.namespace ? dependency.namespace + "/" : ""
                }}{{ dependency.name }}
              </router-link>
              <span class="block text-xs text-gray-500 dark:text-gray-400">
                {{ dependency.purl }}
              </span>
            </td>
            <td class="border px-4 py-2">{{ dependency.version || "" }}</td>
          </tr>
          <tr v-if="dependencies.data.length === 0">
            <td class="border px-4 py-2 text-center" colspan="3">
              No dependencies found
            </td>
          </tr>
        </tbody>
      </table>

      <Pagination
        :page="dependencies.page"
        :pages="dependencies.pages"
        :next="dependencies.fetchNextPage"
        :prev="dependencies.fetchPrevPage"
      />
    </div>
  </div>
</template>
