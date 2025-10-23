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
  <nav
    class="flex justify-center mt-6 mb-2 dark:text-white"
    role="navigation"
    aria-label="Pagination Navigation"
  >
    <button
      :aria-label="`Go to previous page, page ${props.page}`"
      :class="props.page !== 0 ? primaryButton() : neutralButton()"
      :disabled="props.page === 0"
      @click="props.prev()"
    >
      Previous
    </button>
    <p class="mx-4 pt-1.5" aria-current="page" role="status">
      Page {{ props.page + 1 }} / {{ props.pages + 1 }}
    </p>
    <button
      :aria-label="`Go to next page, page ${props.page + 2}`"
      :class="props.page <= props.pages ? primaryButton() : neutralButton()"
      :disabled="props.page >= props.pages"
      @click="props.next()"
    >
      Next
    </button>
  </nav>
</template>
