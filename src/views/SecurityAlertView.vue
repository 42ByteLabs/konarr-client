<script setup lang="ts">
import { onMounted, computed } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import type { KonarrSecurityAlert } from "@/types";

import Title from "@/components/Title.vue";
import DependencyIcon from "@/components/DependencyIcon.vue";

import { useSecurityStore } from "@/stores/security";

const security = useSecurityStore();

onMounted(() => {
  // Get ID from the URL
  const current = parseInt(window.location.pathname.split("/").pop()!);
  security.fetchAlert(current);
});

var alert = computed(() => {
  return security.data.find(
    (c: KonarrSecurityAlert) => c.id === security.current,
  );
});
</script>

<template>
  <main>
    <div
      v-if="alert"
      class="container mt-4 mb-12 w-full mx-auto dark:text-white px-2"
    >
      <div class="grid md:grid-cols-10 sm:grid-cols-1">
        <div class="md:col-span-2 sm:grid-cols-1"></div>
        <div class="md:col-span-6 sm:grid-cols-1">
          <Title :title="alert.name" :subtitle="alert.severity" />
        </div>
      </div>
      <div v-if="alert.dependency && typeof alert.dependency === 'object'">
        <h3 class="text-xl font-semibold text-center">Dependencies</h3>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-4 mt-8"
        >
          <router-link
            :to="{
              name: 'Dependency',
              params: { id: (alert.dependency as any).id },
            }"
            class="bg-white dark:bg-gray-700 dark:text-white hover:bg-accent-500 shadow-md rounded-lg p-4"
          >
            <div class="grid grid-cols-8">
              <div class="col-span-1">
                <DependencyIcon :dep="(alert.dependency as any).type" />
              </div>
              <div class="col-span-6">
                <h3 class="ml-2 text-lg font-semibold">
                  {{ (alert.dependency as any).name }} @
                  {{ (alert.dependency as any).version }}
                </h3>
              </div>
              <div class="col-span-1">
                <svg-icon
                  type="mdi"
                  path="mdiCheckCircle"
                  class="h-6 w-6 ml-2"
                ></svg-icon>
              </div>
            </div>
          </router-link>
        </div>
      </div>
      <div v-if="alert.description">
        <h3 class="text-xl font-semibold text-center">Description</h3>
        <p class="text-center">{{ alert.description }}</p>
      </div>
    </div>
    <div v-else class="container mt-4 mb-6 w-full max-w-xs mx-auto">
      <Title
        title="Alert"
        subtitle="Alert not found"
        description="Please try again with a correct id"
      />
    </div>
  </main>
</template>
