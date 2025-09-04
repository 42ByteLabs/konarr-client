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
  color?: boolean;
  size?: number;
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
  if (!props.color) {
    return "text-gray-800 dark:text-gray-200";
  }
  switch (props.severity) {
    case "Total":
      return "text-blue-300 dark:text-blue-200";
    case "Critical":
      return "text-sec-critical-500 dark:text-sec-critical-400";
    case "High":
      return "text-sec-high-500 dark:text-sec-high-400";
    case "Medium":
      return "text-sec-medium-500 dark:text-sec-medium-400";
    case "Low":
      return "text-sec-low-500 dark:text-sec-low-400";
    case "Informational":
      return "text-sec-information-300 dark:text-sec-information-200";
    case "Malware":
      return "text-sec-malware-300 dark:text-sec-malware-200";
    case "Unmaintained":
      return "text-sec-unmaintained-300 dark:text-sec-unmaintained-200";
    default:
      return "text-gray-300 dark:text-gray-200";
  }
});
const size = computed(() => {
  return props.size || 24;
});
// Add support for hover text and color
</script>
<template>
  <div :class="[color]">
    <svg-icon
      type="mdi"
      :path="icon"
      :style="{ width: `${size}px`, height: `${size}px` }"
    ></svg-icon>
  </div>
</template>
