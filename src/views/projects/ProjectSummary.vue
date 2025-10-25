<script setup lang="ts">
import { computed } from "vue";
import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";

import type { Project, SecuritySummary } from "@/types";

import SvgIcon from "@jamescoyle/vue-icon";
import { mdiGraph, mdiSecurity, mdiAccessPointNetwork } from "@mdi/js";

const md = new MarkdownIt();

const props = defineProps<{
  project: Project;
}>();

const description = computed(() => {
  return DOMPurify.sanitize(md.render(props.project?.description || ""));
});

const securitySummary = computed<SecuritySummary>(() => {
  // Prefer snapshot security (fresh), fall back to project.security, otherwise zeroed summary
  const s = props.project?.snapshot?.security || props.project?.security;
  if (s) return s as SecuritySummary;
  return {
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    malware: 0,
    unmaintained: 0,
    informational: 0,
    unknown: 0,
  } as SecuritySummary;
});

const dependencyCount = computed(() => {
  return props.project?.snapshot?.dependencies || 0;
});
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-4xl mt-2 text-center">
        {{ project.title }}
      </h2>
      <p
        class="text-center text-gray-500 dark:text-gray-300 mt-2"
        v-html="description"
      ></p>
    </div>
    <hr />
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div
        class="bg-white dark:bg-gray-900 dark:text-white shadow-md rounded-lg p-4 flex flex-col items-center justify-center"
      >
        <svg-icon
          type="mdi"
          :path="mdiAccessPointNetwork"
          class="h-8 w-8 mb-2"
        />
        <h3 class="text-lg font-semibold">Status</h3>
        <p class="text-2xl font-bold mt-2">
          {{ props.project.status ? "Online" : "Offline" }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">
          Current Project Status
        </p>
      </div>
      <div
        class="bg-white dark:bg-gray-900 dark:text-white shadow-md rounded-lg p-4 flex flex-col items-center justify-center"
      >
        <svg-icon type="mdi" :path="mdiSecurity" class="h-8 w-8 mb-2" />
        <h3 class="text-lg font-semibold">Alerts</h3>
        <p class="text-2xl font-bold mt-2">{{ securitySummary.total }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">
          Security Alerts
        </p>
      </div>

      <div
        class="bg-white dark:bg-gray-900 dark:text-white shadow-md rounded-lg p-4 flex flex-col items-center justify-center"
      >
        <svg-icon type="mdi" :path="mdiGraph" class="h-8 w-8 mb-2" />
        <h3 class="text-lg font-semibold">Dependencies</h3>
        <p class="text-2xl font-bold mt-2">{{ dependencyCount }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-300 mt-1">
          Dependencies in latest snapshot
        </p>
      </div>
    </div>
  </div>
</template>
