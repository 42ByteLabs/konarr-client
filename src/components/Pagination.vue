<script setup lang="ts">
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import { primaryButton, neutralButton } from "@/utils/buttonClasses";

const props = defineProps<{
  page: number;
  pages: number;
  prev: () => void;
  next: () => void;
}>();
</script>

<template>
  <nav
    class="flex items-center justify-center mt-6 mb-2 gap-3"
    role="navigation"
    aria-label="Pagination Navigation"
  >
    <button
      :aria-label="`Go to previous page, page ${props.page}`"
      :class="props.page !== 0 ? primaryButton() : neutralButton()"
      :disabled="props.page === 0"
      @click="props.prev()"
    >
      <svg-icon type="mdi" :path="mdiChevronLeft" class="h-4 w-4" />
      <span>Previous</span>
    </button>
    <p
      class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
      aria-current="page"
      role="status"
    >
      Page {{ props.page + 1 }} / {{ props.pages + 1 }}
    </p>
    <button
      :aria-label="`Go to next page, page ${props.page + 2}`"
      :class="props.page < props.pages ? primaryButton() : neutralButton()"
      :disabled="props.page >= props.pages"
      @click="props.next()"
    >
      <span>Next</span>
      <svg-icon type="mdi" :path="mdiChevronRight" class="h-4 w-4" />
    </button>
  </nav>
</template>
