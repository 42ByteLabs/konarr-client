<script setup lang="ts">
import type { Project } from "@/types";
import SecuritySummary from "@/components/SecuritySummary.vue";
import ProjectInfo from "@/components/ProjectInfo.vue";

const props = defineProps<{ id: number; project: Project }>();
</script>

<template>
  <div>
    <!-- Snapshot Error Alert -->
    <div
      v-if="
        props.project.snapshot &&
        props.project.snapshot.status === 'Failed' &&
        props.project.snapshot.error
      "
      class="bg-error-100 dark:bg-error-900 border border-error-400 dark:border-error-600 text-error-700 dark:text-error-200 px-4 py-3 rounded relative my-4"
      role="alert"
    >
      <strong class="font-bold">Snapshot Processing Failed</strong>
      <span class="block sm:inline ml-2">{{
        props.project.snapshot.error
      }}</span>
    </div>

    <SecuritySummary
      v-if="props.project.snapshot && props.project.security"
      :summary="props.project.security"
      :snapshot="props.project.snapshot.id"
    />

    <div
      v-if="props.project.type === 'Container' && props.project.snapshot"
      class="mt-4"
    >
      <ProjectInfo
        name="Container Image"
        :value="props.project.snapshot.metadata['container.image']"
      />

      <ProjectInfo
        name="Container SHA(256)"
        :value="
          (props.project.snapshot.metadata['container.sha'] || '')
            .replace('sha256:', '')
            .substring(0, 12)
        "
      />
    </div>
  </div>
</template>
