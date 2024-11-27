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
import { useSecurityStore } from "@/stores/security";

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

onUpdated(() => {
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
        <div class="container mt-4 mb-6 w-full mx-auto">
            <Title title="Security" description="List of Security Alerts" />

            <Loading v-if="security.loading" />
            <div v-else class="w-full">
                <div class="grid md:grid-cols-10 sm:grid-cols-4 gap-2 w-full mx-auto dark:text-black my-8">
                    <router-link :to="{ name: 'Security', query: { severity: 'critical' } }"
                        class="col-span-2 shadow-md rounded-lg md:p-4 sm:p-2 bg-sec-critical-200 dark:bg-sec-critical-400 hover:bg-sec-critical-300 dark:hover:bg-sec-critical-500 hover:shadow-lg text-center">
                        <h5 class="">
                            Critical
                        </h5>
                    </router-link>
                    <router-link :to="{ name: 'Security', query: { severity: 'high' } }"
                        class="col-span-2 shadow-md rounded-lg md:p-4 sm:p-2 bg-sec-high-200 dark:bg-sec-high-300 hover:bg-sec-high-300 dark:hover:bg-sec-high-400 hover:shadow-lg text-center">
                        <h5 class="">
                            High
                        </h5>
                    </router-link>
                    <router-link :to="{ name: 'Security', query: { severity: 'medium' } }"
                        class="col-span-2 shadow-md rounded-lg md:p-4 sm:p-2 bg-sec-medium-200 dark:bg-sec-medium-300 hover:bg-sec-medium-300 dark:hover:bg-sec-medium-400 hover:shadow-lg text-center">
                        <h5 class="">
                            Medium
                        </h5>
                    </router-link>
                    <router-link :to="{ name: 'Security', query: { severity: 'low' } }"
                        class="col-span-2 shadow-md rounded-lg md:p-4 sm:p-2 bg-sec-low-200 dark:bg-sec-low-300 hover:bg-sec-low-300 dark:hover:bg-sec-low-400 hover:shadow-lg text-center">
                        <h5 class="">
                            Low
                        </h5>
                    </router-link>
                    <router-link :to="{ name: 'Security', query: { severity: 'other' } }"
                        class="col-span-2 shadow-md rounded-lg md:p-4 sm:p-2 bg-sec-other-200 dark:bg-sec-other-300 hover:bg-sec-other-300 dark:hover:bg-sec-other-400 hover:shadow-lg text-center">
                        <h5 class="">
                            Other
                        </h5>
                    </router-link>
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
    </main>
</template>
