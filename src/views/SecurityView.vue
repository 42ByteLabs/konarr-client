<script setup lang="ts">
import { onMounted } from "vue";
import { router } from "@/router";

import Title from "@/components/Title.vue";
import Search from "@/components/Search.vue";
import Loading from "@/components/Loading.vue";
import Pagination from "@/components/Pagination.vue";
import SecurityIcon from "@/components/SecurityIcon.vue";
import SecuritySummaryTile from "@/components/SecuritySummaryTile.vue";

import { useServerStore } from "@/stores/server";
import { useSecurityStore } from "@/stores/security";

const server = useServerStore();
const security = useSecurityStore();

onMounted(() => {
  const qseverity = router.currentRoute.value.query.severity as string;
  const qsnapshotParam = router.currentRoute.value.query.snapshot;
  const qsnapshot = Array.isArray(qsnapshotParam)
    ? parseInt(qsnapshotParam[0] || "0")
    : qsnapshotParam
      ? parseInt(qsnapshotParam)
      : undefined;
  const qpageParam = router.currentRoute.value.query.page;
  const qpage =
    parseInt((Array.isArray(qpageParam) ? qpageParam[0] : qpageParam) || "1") -
    1;

  if (qsnapshot) {
    security.fetchSnapshotAlerts(qsnapshot, qpage, 24, qseverity);
  } else if (qseverity) {
    security.fetchAlerts(qpage, 24, qseverity);
  } else {
    security.fetchAlerts(qpage, 24);
  }
});
</script>

<template>
  <main>
    <div v-if="server.security" class="container mt-4 mb-6 w-full mx-auto px-2">
      <Title title="Security Alerts" description="List of Security Alerts" />

      <Loading v-if="security.loading" />
      <div v-else class="w-full">
        <div
          v-if="!security.current"
          class="grid lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-1 gap-2 w-full mx-auto dark:text-black my-2"
        >
          <SecuritySummaryTile
            name="Total"
            :count="server.security.total"
            class="col-span-1 bg-sec-total-500 hover:bg-sec-total-600"
          />
          <SecuritySummaryTile
            name="Critical"
            :count="server.security.critical"
            class="col-span-1 bg-sec-critical-500 hover:bg-sec-critical-500"
          />
          <SecuritySummaryTile
            name="High"
            :count="server.security.high"
            class="col-span-1 bg-sec-high-500 hover:bg-sec-high-500"
          />
          <SecuritySummaryTile
            name="Medium"
            :count="server.security.medium"
            class="col-span-1 bg-sec-medium-500 hover:bg-sec-medium-500"
          />
          <SecuritySummaryTile
            name="Low"
            :count="server.security.low"
            class="col-span-1 bg-sec-low-500 hover:bg-sec-low-600"
          />
          <SecuritySummaryTile
            name="Informational"
            :count="server.security.informational"
            class="col-span-1 bg-sec-information-500 hover:bg-sec-information-600"
          />
        </div>
        <div
          v-if="!security.current"
          class="grid lg:grid-cols-3 sm:grid-cols-1 gap-2 w-full mx-auto dark:text-black my-0 md:mt-4 md:mb-8"
        >
          <SecuritySummaryTile
            name="Malware"
            :count="server.security.malware"
            class="col-span-1 bg-sec-malware-500 hover:bg-sec-malware-600"
          />
          <SecuritySummaryTile
            name="Unmaintained"
            :count="server.security.unmaintained"
            class="col-span-1 bg-sec-unmaintained-400 hover:bg-sec-unmaintained-500"
          />
          <SecuritySummaryTile
            name="Unknown"
            :count="server.security.unknown"
            class="col-span-1 bg-sec-unknown-400 dark:bg-sec-unknown-400 hover:bg-sec-unknown-500"
          />
        </div>

        <Search
          searching="security"
          placeholder="Find alerts..."
          :total="security.total"
          :limit="24"
          :count="security.data.length"
        />

        <h2
          v-if="security.current"
          class="text-xl font-semibold mt-8 text-center"
        >
          Security Alerts from Project Snapshot
        </h2>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 my-4 mt-8"
        >
          <router-link
            v-for="sec in security.data"
            :key="sec.id"
            :to="{ name: 'Alert', params: { id: sec.id } }"
            class="dark:text-white dark:bg-gray-800 hover:bg-accent-500 shadow-md rounded-lg p-4"
          >
            <div class="grid grid-cols-8">
              <div class="col-span-7">
                <h3 class="ml-2 text-lg font-semibold">
                  {{ sec.name }}
                </h3>
              </div>
              <div class="col-span-1">
                <SecurityIcon :severity="sec.severity" color />
              </div>
            </div>
          </router-link>
        </div>

        <Pagination
          v-if="security.pages !== 1"
          :page="security.page"
          :pages="security.pages"
          :next="security.fetchNextPage"
          :prev="security.fetchPrevPage"
        />
      </div>
    </div>
    <div v-else class="container mt-4 mb-6 w-full mx-auto">
      <Title
        title="Security"
        description="Security alerts are disabled on this server."
      />
    </div>
  </main>
</template>
