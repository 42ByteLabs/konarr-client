<script setup lang="ts">
import Title from "@/components/Title.vue";
import Loading from "@/components/Loading.vue";
import RegisterPanel from "@/components/RegisterPanel.vue";
import { useServerStore } from "@/stores/server";

const server = useServerStore();
</script>

<template>
  <main>
    <div class="container mt-4 mb-6 w-full mx-auto px-4">
      <Title title="Registration" subtitle="Create your new account" />

      <Loading v-if="server.logging_in" text="Creating your account..." />

      <div
        v-if="server.config.initialised"
        class="max-w-md mx-auto mb-6 p-4 bg-blue-100 dark:bg-blue-900 border border-blue-400 dark:border-blue-600 rounded"
      >
        <h3
          class="text-center text-xl font-semibold text-blue-800 dark:text-blue-200 mb-2"
        >
          Initial Setup
        </h3>
        <p class="text-center text-blue-700 dark:text-blue-300 text-sm">
          You will be registered as an administrator user.
        </p>
      </div>

      <RegisterPanel />
    </div>
  </main>
</template>
