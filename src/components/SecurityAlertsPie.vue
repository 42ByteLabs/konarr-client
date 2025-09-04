<script setup lang="ts">
import { computed } from "vue";
import colors from "tailwindcss/colors";
import { AgCharts } from "ag-charts-vue3";

import type { KonarrSecuritySummary } from "@/types";

const props = defineProps<{
  alerts: KonarrSecuritySummary;
}>();

const data = computed(() => {
  return {
    data: [
      {
        label: "Critical",
        amount: props.alerts.critical || 0,
      },
      {
        label: "High",
        amount: props.alerts.high || 0,
      },
      {
        label: "Medium",
        amount: props.alerts.medium || 0,
      },
      {
        label: "Low",
        amount: props.alerts.low || 0,
      },
      {
        label: "Info",
        amount: props.alerts.informational || 0,
      },
      {
        label: "Malware",
        amount: props.alerts.malware || 0,
      },
      {
        label: "Unmaintained",
        amount: props.alerts.unmaintained || 0,
      },
      {
        label: "Unknown",
        amount: props.alerts.other || 0,
      },
    ],
    series: [
      {
        type: "pie" as const,
        calloutLabelKey: "label",
        angleKey: "amount",
        fills: [
          colors.red[500],
          colors.orange[500],
          colors.blue[500],
          colors.emerald[500],
          colors.purple[500],
          colors.red[300],
          colors.gray[500],
          colors.gray[300],
        ],
      },
    ],
  } as any;
});
</script>

<template>
  <div class="text-black dark:text-white">
    <ag-charts :options="data"> </ag-charts>
  </div>
</template>
