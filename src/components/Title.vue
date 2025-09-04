<script setup lang="ts">
import { computed } from "vue";

import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";

const md = new MarkdownIt();

const props = defineProps<{
  title: string;
  subtitle?: string;
  // Description (markdown)
  description?: string;
  logo?: boolean;
}>();

const description = computed(() => {
  // TODO: Validate this is safe
  const result = md.render(props.description || "");
  return DOMPurify.sanitize(result);
});
</script>

<template>
  <div class="mt-8 mb-4">
    <h1 class="text-4xl text-center pr-5 dark:text-white">
      {{ title }}
    </h1>
    <h2 v-if="subtitle" class="text-2xl text-center mb-4 dark:text-white">
      {{ subtitle }}
    </h2>
    <div
      v-if="description"
      class="text-center text-gray-500 dark:text-white text-sm my-2"
      v-html="description"
    ></div>
  </div>
</template>
