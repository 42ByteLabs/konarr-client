<script setup lang="ts">
import { computed } from "vue";
import { router } from "@/router";

import SvgIcon from "@jamescoyle/vue-icon";
import { mdiSecurity, mdiBug, mdiStopCircleOutline, mdiInformationSlabCircleOutline } from "@mdi/js";

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

const icon = computed(() => {
    if (props.name === "Informational" || props.name === "Other") {
        return mdiInformationSlabCircleOutline;
    } else if (props.name === "Malware") {
        return mdiBug;
    } else if (props.name === "Unmaintained") {
        return mdiStopCircleOutline;
    } else {
        return mdiSecurity;
    }
});
const color = computed(() => {
    const name = props.name.toLowerCase();
    return `bg-sec-${name}-200 dark:bg-sec-${name}-300 hover:bg-sec-${name}-300 dark:hover:bg-sec-${name}-400`
});
const severity = computed(() => {
    return props.name.toLowerCase();
});

</script>

<template>
    <button @click="update" :class="['shadow-md rounded-lg md:p-4 sm:p-2 hover:shadow-lg text-center', color]">
        <div class="grid grid-cols-6">
            <svg-icon class="col-span-1 text-accent-500 dark:text-gray-800" :type="'mdi'" :path="icon" />
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
