<script setup lang="ts">
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiSecurity } from "@mdi/js";

import type { KonarrSecuritySummary } from "@/types";

const props = defineProps<{
    summary: KonarrSecuritySummary,
    snapshot?: number,
}>();
</script>
<template>
    <div class="mb-10 mt-6">
        <div class="flex justify-center items-center mb-4">
            <svg-icon type="mdi" :path="mdiSecurity" class="mr-2"></svg-icon>
            <h2 class="text-2xl font-semibold">
                Security - {{ props.summary.total }}
            </h2>
        </div>
        <div class="grid md:grid-cols-10 sm:grid-cols-4 gap-2 w-full mx-auto dark:text-black">
            <!-- on hover, make the card slightly bigger and change the color -->
            <router-link :to="{ name: 'Security', query: { snapshot: props.snapshot, severity: 'critical' } }"
                class="col-span-2 shadow-md rounded-lg md:p-4 sm:p-2 bg-sec-critical-200 dark:bg-sec-critical-400 hover:bg-sec-critical-300 dark:hover:bg-sec-critical-500 hover:shadow-lg text-center">
                <h5 class="">
                    Critical
                </h5>
                <span>
                    <strong>
                        {{ props.summary.critical }}
                    </strong>
                </span>
            </router-link>
            <router-link :to="{ name: 'Security', query: { snapshot: props.snapshot, severity: 'high' } }"
                class="col-span-2 shadow-md rounded-lg md:p-4 sm:p-2 bg-sec-high-200 dark:bg-sec-high-300 hover:bg-sec-high-300 dark:hover:bg-sec-high-400 hover:shadow-lg text-center">
                <h5 class="">
                    High
                </h5>
                <span>
                    <strong>
                        {{ props.summary.high }}
                    </strong>
                </span>
            </router-link>
            <router-link :to="{ name: 'Security', query: { snapshot: props.snapshot, severity: 'medium' } }"
                class="col-span-2 shadow-md rounded-lg md:p-4 sm:p-2 bg-sec-medium-200 dark:bg-sec-medium-300 hover:bg-sec-medium-300 dark:hover:bg-sec-medium-400 hover:shadow-lg text-center">
                <h5 class="">
                    Medium
                </h5>
                <span>
                    <strong>
                        {{ props.summary.medium }}
                    </strong>
                </span>
            </router-link>
            <router-link :to="{ name: 'Security', query: { snapshot: props.snapshot, severity: 'low' } }"
                class="col-span-2 shadow-md rounded-lg md:p-4 sm:p-2 bg-sec-low-200 dark:bg-sec-low-300 hover:bg-sec-low-300 dark:hover:bg-sec-low-400 hover:shadow-lg text-center">
                <h5 class="">
                    Low
                </h5>
                <span>
                    <strong>
                        {{ props.summary.low }}
                    </strong>
                </span>
            </router-link>
            <router-link :to="{ name: 'Security', query: { snapshot: props.snapshot, severity: 'other' } }"
                class="col-span-2 shadow-md rounded-lg md:p-4 sm:p-2 bg-sec-other-200 dark:bg-sec-other-300 hover:bg-sec-other-300 dark:hover:bg-sec-other-400 hover:shadow-lg text-center">
                <h5 class="">
                    Other
                </h5>
                <span>
                    <strong>
                        {{ props.summary.other }}
                    </strong>
                </span>
            </router-link>
        </div>
    </div class="mb-10">
</template>
