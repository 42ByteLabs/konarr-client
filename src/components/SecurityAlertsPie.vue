<script setup lang="ts">
import { computed } from "vue";
import colors from "tailwindcss/colors";
import { AgCharts } from 'ag-charts-vue3';

import type { KonarrSecuritySummary } from "@/types";

const props = defineProps<{
    alerts: KonarrSecuritySummary;
}>();

const data = computed(() => {
    return {
        data: [
            {
                label: "Critical",
                amount: props.alerts.critical,
            },
            {
                label: "High",
                amount: props.alerts.high,
            },
            {
                label: "Medium",
                amount: props.alerts.medium,
            },
            {
                label: "Low",
                amount: props.alerts.low,
            },
            {
                label: "Info",
                amount: props.alerts.informational,
            },
            {
                label: "Malware",
                amount: props.alerts.malware,
            },
            {
                label: "Unmaintained",
                amount: props.alerts.unmaintained,
            },
            {
                label: "Unknown",
                amount: props.alerts.other,
            },
        ],
        series: [
            {
                type: 'donut',
                calloutLabelKey: 'label',
                angleKey: 'amount',
                innerRadiusRatio: 0.6,
                innerLabels: [
                    {
                        text: 'Total',
                        fontWeight: 'bold',
                    },
                    {
                        text: props.alerts.total.toString(),
                    },
                ],
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
    };
});
</script>

<template>
    <div class="text-black dark:text-white">
        <ag-charts :options="data"> </ag-charts>
    </div>
</template>
