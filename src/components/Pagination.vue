<script setup lang="ts">
const props = defineProps<{
  page: number;
  pages: number;
  prev: () => void;
  next: () => void;
}>();
import { primaryButton, neutralButton } from "@/utils/buttonClasses";
</script>

<template>
  <div class="flex justify-center mt-6 mb-2 dark:text-white">
    <button
      :class="props.page !== 0 ? primaryButton() : neutralButton()"
      :disabled="props.page === 0"
      @click="props.prev()"
    >
      Previous
    </button>
    <p class="mx-4 pt-1.5">Page {{ props.page + 1 }} / {{ props.pages + 1 }}</p>
    <button
      :class="props.page <= props.pages ? primaryButton() : neutralButton()"
      :disabled="props.page >= props.pages"
      @click="props.next()"
    >
      Next
    </button>
  </div>
</template>
