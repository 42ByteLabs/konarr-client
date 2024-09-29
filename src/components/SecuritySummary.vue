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
    <div class="mb-10">
        <div class="flex justify-center items-center mb-4">
            <svg-icon type="mdi" :path="mdiSecurity" class="mr-2"></svg-icon>
            <h2 class="text-2xl font-semibold">
                Security - {{ props.summary.total }}
            </h2>
        </div>
        <div class="grid grid-cols-10 gap-2 w-full mx-auto">
            <router-link :to="{ name: 'Security', query: { snapshot: props.snapshot, severity: 'critical' } }"
                class="col-span-2 shadow-md rounded-lg p-4 bg-red-100 hover:bg-red-300 hover:shadow-lg text-center">
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
                class="col-span-2 shadow-md rounded-lg p-4 bg-orange-100 hover:bg-orange-300 hover:shadow-lg text-center">
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
                class="col-span-2 shadow-md rounded-lg p-4 bg-blue-100 hover:bg-blue-300 hover:shadow-lg text-center">
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
                class="col-span-2 shadow-md rounded-lg p-4 bg-green-100 hover:bg-green-300 hover:shadow-lg text-center">
                <h5 class="">
                    Low
                </h5>
                <span>
                    <strong>
                        {{ props.summary.low }}
                    </strong>
                </span>
            </router-link>
            <router-link :to="{ name: 'Security', query: { snapshot: props.snapshot, severity: 'low' } }"
                class="col-span-2 shadow-md rounded-lg p-4 bg-gray-100 hover:bg-gray-300 hover:shadow-lg text-center">
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
