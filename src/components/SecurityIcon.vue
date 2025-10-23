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
  const severity = props.severity.toLowerCase();
  switch (severity) {
    case "info":
    case "informational":
      return mdiInformationSlabCircleOutline;
    case "malware":
      return mdiBug;
    case "unmaintained":
      return mdiStopCircleOutline;
    default:
      return mdiSecurity;
  }
});
const color = computed(() => {
  if (!props.color) {
    return "text-gray-800 dark:text-gray-200";
  }
  const severity = props.severity.toLowerCase();
  switch (severity) {
    case "total":
      return "text-blue-900 dark:text-blue-900";
    case "critical":
      return "text-red-900 dark:text-red-900";
    case "high":
      return "text-orange-950 dark:text-orange-950";
    case "medium":
      return "text-blue-900 dark:text-blue-900";
    case "low":
      return "text-green-900 dark:text-green-900";
    case "info":
    case "informational":
      return "text-purple-900 dark:text-purple-900";
    case "malware":
      return "text-pink-900 dark:text-pink-900";
    case "unmaintained":
      return "text-slate-900 dark:text-slate-900";
    case "unknown":
      return "text-gray-900 dark:text-gray-900";
    default:
      return "text-gray-900 dark:text-gray-300";
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
