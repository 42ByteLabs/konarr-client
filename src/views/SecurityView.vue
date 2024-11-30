<script setup lang="ts">
import { onMounted, onUpdated } from "vue";
import { router } from "@/router";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiSecurity } from "@mdi/js";

import Title from "@/components/Title.vue";
import Search from "@/components/Search.vue";
import Loading from "@/components/Loading.vue";
import Pagination from "@/components/Pagination.vue";
import SecurityAlertTile from "@/components/SecurityAlertTile.vue";
import SecuritySummaryTile from "@/components/SecuritySummaryTile.vue";

import { useServerStore } from "@/stores/server";
import { useSecurityStore } from "@/stores/security";

const server = useServerStore();
const security = useSecurityStore();

onMounted(() => {
    const squery = router.currentRoute.value.query.search;
    const qseverity = router.currentRoute.value.query.severity;
    const qpage = parseInt(router.currentRoute.value.query.page || 1) - 1;

    if (qseverity) {
        security.fetchAlerts(qpage, 24, qseverity);
    } else {
        security.fetchAlerts(qpage, 24);
    }
});
</script>

<template>
    <main>
        <div v-if="server.security" class="container mt-4 mb-6 w-full mx-auto">
            <Title title="Security" description="List of Security Alerts" />

            <Loading v-if="security.loading" />
            <div v-else class="w-full">
                <div
                    class="grid lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-1 gap-2 w-full mx-auto dark:text-black my-4">
                    <SecuritySummaryTile name="Total" :count="server.security.total"
                        class="col-span-1 bg-sec-total-200" />
                    <SecuritySummaryTile name="Critical" :count="server.security.critical" class="col-span-1" />
                    <SecuritySummaryTile name="High" :count="server.security.high" class="col-span-1" />
                    <SecuritySummaryTile name="Medium" :count="server.security.medium" class="col-span-1" />
                    <SecuritySummaryTile name="Low" :count="server.security.low" class="col-span-1" />
                    <SecuritySummaryTile name="Informational" :count="server.security.informational"
                        class="col-span-1 bg-sec-information-200 dark:bg-sec-information-300" />
                </div>
                <div class="grid lg:grid-cols-3 sm:grid-cols-1 gap-2 w-full mx-auto dark:text-black mt-4 mb-8">
                    <SecuritySummaryTile name="Malware" :count="server.security.malware"
                        class="col-span-1 bg-sec-malware-100 dark:bg-sec-malware-300" />
                    <SecuritySummaryTile name="Unmaintained" :count="server.security.unmaintained"
                        class="col-span-1 bg-sec-unmaintained-200 dark:bg-sec-unmaintained-300" />
                    <SecuritySummaryTile name="Unknown" :count="server.security.unknown"
                        class="col-span-1 bg-sec-information-200 dark:bg-sec-information-300" />
                </div>

                <Search searching="security" placeholder="Find alerts..." :total="security.total" limit="24"
                    :count="security.data.length" />

                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-4 mt-8">
                    <router-link :to="{ name: 'Alert', params: { id: sec.id } }" v-for="sec in security.data"
                        :key="sec.id"
                        class="bg-white dark:bg-gray-700 dark:text-white hover:bg-accent-500 shadow-md rounded-lg p-4">
                        <div class="grid grid-cols-8">
                            <div class="col-span-1">
                                <SvgIcon type="mdi" :path="mdiSecurity" class="h-6 w-6 ml-2" />
                            </div>
                            <div class="col-span-6">
                                <h3 class="ml-2 text-lg font-semibold">
                                    {{ sec.name }}
                                </h3>
                            </div>
                            <div class="col-span-1">
                                {{ sec.severity }}
                            </div>
                        </div>
                    </router-link>
                </div>

                <Pagination v-if="security.pages !== 1" :page="security.page" :pages="security.pages"
                    :next="security.fetchNextPage" :prev="security.fetchPrevPage" />
            </div>
        </div>
        <div v-else class="container mt-4 mb-6 w-full mx-auto">
            <Title title="Security" description="Security alerts are disabled on this server." />
        </div>
    </main>
</template>
