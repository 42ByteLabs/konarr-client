<script setup lang="ts">
import { computed } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import {
    mdiInformationSlabCircleOutline,
    mdiBug,
    mdiStopCircleOutline,
    mdiSecurity,
} from "@mdi/js";

const props = defineProps<{
    severity: string;
    size?: string;
}>();

const icon = computed(() => {
    switch (props.severity) {
        case "Informational":
            return mdiInformationSlabCircleOutline;
        case "Malware":
            return mdiBug;
        case "Unmaintained":
            return mdiStopCircleOutline;
        default:
            return mdiSecurity;
    }
});
const color = computed(() => {
    switch (props.severity) {
        case "Total":
            return "text-blue-300";
        case "Critical":
            return "text-sec-critical-500";
        case "High":
            return "text-sec-high-500";
        case "Medium":
            return "text-sec-medium-500";
        case "Low":
            return "text-sec-low-500";
        case "Informational":
            return "text-sec-information-300";
        case "Malware":
            return "text-sec-malware-300";
        case "Unmaintained":
            return "text-sec-unmaintained-300";
        default:
            return "text-gray-300";
    }
});
const size = computed(() => {
    return props.size || 24;
});
// Add support for hover text and color 

</script>
<template>
    <div :class="[color]">
        <svg-icon type="mdi" :path="icon" :style="{ width: `${size}px`, height: `${size}px` }"></svg-icon>
    </div>
</template>
