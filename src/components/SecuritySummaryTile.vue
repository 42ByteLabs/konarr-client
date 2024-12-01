<script setup lang="ts">
import { computed } from "vue";
import { router } from "@/router";

import SvgIcon from "@jamescoyle/vue-icon";
import { mdiSecurity, mdiBug, mdiStopCircleOutline, mdiInformationSlabCircleOutline } from "@mdi/js";
import SecurityIcon from "@/components/SecurityIcon.vue";

import { useSecurityStore } from "@/stores/security";

const security = useSecurityStore();

const props = defineProps<{
    name: string;
    count: number;
    snapshot?: number;
    description?: string;
}>();

// Update on click 
const update = () => {
    security.fetchAlerts(0, 24, props.name.toLowerCase());
    router.push({
        name: 'Security',
        query: {
            severity: props.name.toLowerCase(),
            snapshot: snapshot.value
        }
    });
}

const snapshot = computed(() => {
    return props.snapshot || router.currentRoute.value.query.search;
});

const color = computed(() => {
    switch (props.name) {
        case "Total":
            return "bg-blue-300 dark:db-blue-200";
        case "Critical":
            return "bg-sec-critical-500 dark:bg-sec-critical-400";
        case "High":
            return "bg-sec-high-500 dark:bg-sec-high-400";
        case "Medium":
            return "bg-sec-medium-500 dark:bg-sec-medium-400";
        case "Low":
            return "bg-sec-low-500 dark:bg-sec-low-400";
        case "Informational":
            return "bg-sec-information-300 dark:bg-sec-information-200";
        case "Malware":
            return "bg-sec-malware-300 dark:bg-sec-malware-200";
        case "Unmaintained":
            return "bg-sec-unmaintained-300 dark:bg-sec-unmaintained-200";
        default:
            return "bg-gray-300 dark:bg-gray-200";
    }
});
const severity = computed(() => {
    return props.name.toLowerCase();
});

</script>

<template>
    <button @click="update" :class="['shadow-md rounded-lg md:p-4 sm:p-2 hover:shadow-lg text-center', color]">
        <div class="grid grid-cols-6">
            <SecurityIcon class="col-span-1 text-accent-500 dark:text-gray-800" :severity="props.name" :size="24" />
            <h5 class="col-span-4 font-bold">
                {{ props.name }}
            </h5>
            <div class="col-span-1"></div>
            <span class="col-span-6">
                <strong>
                    {{ props.count }}
                </strong>
            </span>
        </div>
    </button>
</template>
