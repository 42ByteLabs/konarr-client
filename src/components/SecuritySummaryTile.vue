<script setup lang="ts">
import { computed } from "vue";
import { router } from "@/router";

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
    name: "Security",
    query: {
      severity: props.name.toLowerCase(),
      snapshot: snapshot.value,
    },
  });
};

const snapshot = computed(() => {
  return props.snapshot || router.currentRoute.value.query.search;
});
</script>

<template>
  <button
    :class="['shadow-md rounded-lg p-2 md:p-4 hover:shadow-lg text-center']"
    @click="update"
  >
    <div class="grid grid-cols-6">
      <SecurityIcon
        class="col-span-1 text-accent-500 dark:text-gray-800 ml-4 sm:ml-0"
        :severity="props.name"
        :size="24"
      />
      <h5 class="col-span-3 font-bold">
        {{ props.name }}
      </h5>
      <!-- <div class="col-span-1"></div> -->
      <span class="col-span-2">
        <strong>
          {{ props.count }}
        </strong>
      </span>
    </div>
  </button>
</template>
