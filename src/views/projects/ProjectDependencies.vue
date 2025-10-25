<script setup lang="ts">
import type { Project } from "@/types";
import DependenciesList from "@/components/DependenciesList.vue";

const props = defineProps<{ project: Project }>();
</script>

<template>
  <div>
    <div v-if="props.project.snapshot && props.project.type === 'Container'">
      <DependenciesList
        :snapid="props.project.snapshot.id"
        :projectid="props.project.id"
        :total="props.project.snapshot.dependencies"
        :limit="12"
      />
    </div>
    <div v-else class="text-center text-gray-500 dark:text-gray-400">
      No dependencies available
    </div>
  </div>
</template>
