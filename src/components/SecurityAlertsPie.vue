<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import colors from "tailwindcss/colors";
import { AgCharts } from "ag-charts-vue3";

import type { KonarrSecuritySummary } from "@/types";

const props = defineProps<{
  alerts: KonarrSecuritySummary;
}>();

const isDarkMode = ref(false);

onMounted(() => {
  // Check if dark mode is enabled
  isDarkMode.value = document.documentElement.classList.contains("dark");

  // Watch for dark mode changes
  const observer = new MutationObserver(() => {
    isDarkMode.value = document.documentElement.classList.contains("dark");
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
});

const data = computed(() => {
  const textColor = isDarkMode.value ? colors.gray[300] : colors.gray[700];
  const backgroundColor = isDarkMode.value ? colors.gray[800] : colors.white;

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
    background: {
      fill: backgroundColor,
    },
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
        calloutLabel: {
          enabled: true,
          color: textColor,
        },
        sectorLabel: {
          enabled: false,
        },
        tooltip: {
          renderer: (params: any) => ({
            title: params.datum.label,
            content: `${params.datum.amount} alerts`,
            backgroundColor: isDarkMode.value ? colors.gray[700] : colors.white,
            color: textColor,
          }),
        },
      },
    ],
    legend: {
      enabled: true,
      position: "bottom" as const,
      item: {
        label: {
          color: textColor,
        },
      },
    },
  } as any;
});
</script>

<template>
  <div class="text-black dark:text-white">
    <ag-charts :options="data"> </ag-charts>
  </div>
</template>
