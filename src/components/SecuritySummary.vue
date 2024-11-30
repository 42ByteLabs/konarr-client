<script setup lang="ts">
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiSecurity } from "@mdi/js";

import type { KonarrSecuritySummary } from "@/types";
import SecuritySummaryTile from "@/components/SecuritySummaryTile.vue";

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
        <div class="grid lg:grid-cols-10 md:grid-cols-6 sm:grid-cols-4 gap-2 w-full mx-auto dark:text-black">
            <!-- on hover, make the card slightly bigger and change the color -->
            <SecuritySummaryTile name="Critical" :count="props.summary.critical" class="col-span-2" />
            <SecuritySummaryTile name="High" :count="props.summary.high" class="col-span-2" />
            <SecuritySummaryTile name="Medium" :count="props.summary.medium" class="col-span-2" />
            <SecuritySummaryTile name="Low" :count="props.summary.low" class="col-span-2" />
            <SecuritySummaryTile name="Infomational" :count="props.summary.informational" class="col-span-2" />
        </div>
    </div class="mb-10">
</template>
