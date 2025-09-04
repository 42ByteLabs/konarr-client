<script setup lang="ts">
import { computed } from "vue";

import type { KonarrSecurityAlert } from "@/types";
import { useSecurityStore } from "@/stores/security";

const security = useSecurityStore();

const props = defineProps<{
  alert?: KonarrSecurityAlert;
  id?: number;
}>();

const alert = computed(() => {
  if (props.alert) {
    return props.alert;
  } else if (props.id) {
    security.fetchAlert(props.id);
    return security.data.find(
      (p: KonarrSecurityAlert) => p.id === security.current,
    );
  }
  return null;
});
</script>

<template>
  <div
    class="bg-white dark:bg-gray-800 shadow-md rounded-lg hover:bg-accent-500 py-2"
  >
    <router-link
      :to="{ name: 'Security Alert', params: { id: alert?.id } }"
      class="dark:text-white hover:bg-pink-500 hover:shadow-lg"
    >
      <h3 class="flex justify-center text-lg font-semibold">
        {{ props.alert?.name }}
      </h3>

      <div class="grid grid-cols-4 mt-4 mb-2">
        <!-- Alert Info Display -->
        <div class="flex items-center justify-center col-span-4">
          <span class="text-sm text-gray-600 dark:text-gray-300">
            {{ alert?.description || "Security Alert" }}
          </span>
        </div>
      </div>
    </router-link>
  </div>
</template>
