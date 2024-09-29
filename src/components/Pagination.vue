<script setup lang="ts">
const props = defineProps<{
    page: number;
    pages: number;
    prev: () => void;
    next: () => void;
}>();
</script>

<template>
    <div class="flex justify-center mt-6 mb-2">
        <button :class="[
            props.page !== 0
                ? 'bg-pink-500 hover:bg-pink-700'
                : 'bg-gray-300 hover:bg-gray-700',
            'text-white font-bold py-2 px-4 rounded',
        ]" :disabled="props.page === 0" @click="props.prev()">
            Previous
        </button>
        <p class="mx-4 pt-1.5">
            Page {{ props.page + 1 }} / {{ props.pages + 1 }}
        </p>
        <button :class="[
            props.page <= props.pages
                ? 'bg-pink-500 hover:bg-pink-700'
                : 'bg-gray-300 hover:bg-gray-700',
            'text-white font-bold py-2 px-4 rounded',
        ]" :disabled="props.page >= props.pages" @click="props.next()">
            Next
        </button>
    </div>
</template>
