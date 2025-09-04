<script setup lang="ts">
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiSecurity } from "@mdi/js";

import type { KonarrSecuritySummary } from "@/types";
import SecuritySummaryTile from "@/components/SecuritySummaryTile.vue";

const props = defineProps<{
  summary: KonarrSecuritySummary;
  snapshot?: number;
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
    <div
      class="grid lg:grid-cols-10 md:grid-cols-6 sm:grid-cols-4 gap-2 w-full mx-auto dark:text-black"
    >
      <!-- on hover, make the card slightly bigger and change the color -->
      <SecuritySummaryTile
        name="Critical"
        :snapshot="props.snapshot"
        :count="props.summary.critical"
        class="col-span-2 bg-sec-critical-500 hover:bg-sec-critical-600"
      />
      <SecuritySummaryTile
        name="High"
        :snapshot="props.snapshot"
        :count="props.summary.high"
        class="col-span-2 bg-sec-high-500 hover:bg-sec-high-600"
      />
      <SecuritySummaryTile
        name="Medium"
        :snapshot="props.snapshot"
        :count="props.summary.medium"
        class="col-span-2 bg-sec-medium-300 dark:bg-sec-medium-500 dark:hover:bg-sec-medium-600"
      />
      <SecuritySummaryTile
        name="Low"
        :snapshot="props.snapshot"
        :count="props.summary.low"
        class="col-span-2 bg-sec-low-400 dark:bg-sec-low-500 dark:hover:bg-sec-low-600"
      />
      <SecuritySummaryTile
        name="Info"
        :snapshot="props.snapshot"
        :count="props.summary.informational"
        class="col-span-2 bg-sec-information-400 dark:bg-sec-information-500 dark:hover:bg-sec-information-600"
      />
    </div>
    <div
      class="grid lg:grid-cols-6 md:grid-cols-6 sm:grid-cols-4 gap-2 w-full mx-auto dark:text-black mt-4"
    >
      <SecuritySummaryTile
        name="Malware"
        :snapshot="props.snapshot"
        :count="props.summary.malware"
        class="col-span-2 bg-sec-malware-500 dark:bg-sec-malware-500 dark:hover:bg-sec-malware-600"
      />
      <SecuritySummaryTile
        name="Unmaintained"
        :snapshot="props.snapshot"
        :count="props.summary.unmaintained"
        class="col-span-2 bg-sec-unmaintained-500 dark:bg-sec-unmaintained-400 dark:hover:bg-sec-unmaintained-500"
      />
      <SecuritySummaryTile
        name="Unknown"
        :snapshot="props.snapshot"
        :count="props.summary.unknown"
        class="col-span-2 bg-sec-unknown-400 dark:bg-sec-unknown-400 dark:hover:bg-sec-unknown-500"
      />
    </div>
  </div>
</template>
