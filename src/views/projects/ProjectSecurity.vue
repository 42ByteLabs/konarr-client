<script setup lang="ts">
import { onMounted } from "vue";
import type { Project } from "@/types";
import { useSecurityStore } from "@/stores/security";
import SecuritySummary from "@/components/SecuritySummary.vue";
import SecurityAlertTile from "@/components/SecurityAlertTile.vue";
import Pagination from "@/components/Pagination.vue";
import Search from "@/components/Search.vue";

const props = defineProps<{ id: number; project: Project }>();

const securityStore = useSecurityStore();

onMounted(() => {
  securityStore.setSnapshot(props.project.snapshot?.id || 0);
  securityStore.fetchSnapshotAlerts(props.project.snapshot?.id || 0, 12);
});
</script>

<template>
  <div>
    <!-- Snapshot Error Alert -->
    <div
      v-if="
        props.project.snapshot &&
        props.project.snapshot.status === 'Failed' &&
        props.project.snapshot.error
      "
      class="bg-error-100 dark:bg-error-900 border border-error-400 dark:border-error-600 text-error-700 dark:text-error-200 px-4 py-3 rounded relative my-4"
      role="alert"
    >
      <strong class="font-bold">Snapshot Processing Failed</strong>
      <span class="block sm:inline ml-2">{{
        props.project.snapshot.error
      }}</span>
    </div>

    <SecuritySummary
      v-if="props.project.snapshot && props.project.security"
      :summary="props.project.security"
      :snapshot="props.project.snapshot.id"
    />

    <div v-if="securityStore.alerts.length > 0" class="w-full">
      <Search
        searching="security"
        placeholder="Find alerts..."
        :total="securityStore.securityAlerts.total"
        :limit="securityStore.limit"
        :count="securityStore.securityAlerts.count"
      />

      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4 mt-8"
      >
        <SecurityAlertTile
          v-for="sec in securityStore.alerts"
          :key="sec.id"
          :alert="sec"
        />
      </div>

      <Pagination
        :page="securityStore.page"
        :pages="securityStore.pages"
        :next="securityStore.fetchNextPage"
        :prev="securityStore.fetchPrevPage"
      />
    </div>
  </div>
</template>
