<script setup lang="ts">
import { computed } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiDocker, mdiApplicationBraces, mdiGroup, mdiServer } from "@mdi/js";

const props = defineProps<{
  type?: string;
  size?: string;
}>();

const icon = computed(() => {
  switch (props.type) {
    case "Container":
      return mdiDocker;
    case "Server":
      return mdiServer;
    case "Group":
      return mdiGroup;
    default:
      return mdiApplicationBraces;
  }
});
const size = computed(() => {
  return props.size || 24;
});
</script>
<template>
  <div>
    <svg-icon
      type="mdi"
      :path="icon"
      :style="{ width: `${size}px`, height: `${size}px` }"
    ></svg-icon>
  </div>
</template>
