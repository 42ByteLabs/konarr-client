<script setup lang="ts">
const props = defineProps<{
    page: number;
    pages: number;
    prev: () => void;
    next: () => void;
}>();
</script>

<template>
    <div class="flex justify-center mt-6 mb-2 dark:text-white">
        <button :class="[
            props.page !== 0
                ? 'bg-accent-500 hover:bg-accent-700'
                : 'bg-gray-300 hover:bg-gray-400',
            'text-white dark:text-black font-bold py-2 px-4 rounded',
        ]" :disabled="props.page === 0" @click="props.prev()">
            Previous
        </button>
        <p class="mx-4 pt-1.5">
            Page {{ props.page + 1 }} / {{ props.pages + 1 }}
        </p>
        <button :class="[
            props.page <= props.pages
                ? 'bg-accent-500 hover:bg-accent-600'
                : 'bg-gray-300 hover:bg-gray-700',
            'text-white dark:text-black font-bold py-2 px-4 rounded',
        ]" :disabled="props.page >= props.pages" @click="props.next()">
            Next
        </button>
    </div>
</template>
