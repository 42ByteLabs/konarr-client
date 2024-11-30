<script setup lang="ts">
import { computed } from "vue";
import colors from "tailwindcss/colors";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'vue-chartjs';

import type { KonarrAlerts } from "@/types";

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{
    alerts: KonarrAlerts;
}>();

const data = computed(() => {
    return {
        labels: ["Critical", "High", "Medium", "Low", "Info", "Malware", "Unmaintained", "Unknown"],
        datasets: [
            {
                data: [
                    props.alerts.critical,
                    props.alerts.high,
                    props.alerts.medium,
                    props.alerts.low,
                    props.alerts.informational,
                    props.alerts.malware,
                    props.alerts.unmaintained,
                    props.alerts.other,
                ],
                backgroundColor: [
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
        <Pie :data="data" />
    </div>
</template>
