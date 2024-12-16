<script setup lang="ts">
import { computed } from "vue";
const props = defineProps<{
    name?: string;
    value?: string | number;
    version?: string | number;
    info?: string;
    link?: string;

    metadata?: any;
}>();

const value = computed(() => {
    if (props.value && props.value.length > 42) {
        return props.value.slice(0, 42) + "...";
    }
    return props.value;
});
</script>
<template>
    <div v-if="props.value" class="mt-4 text-center">
        <h5 v-if="props.name" class="text-sm items-start mx-auto">
            {{ props.name }}
        </h5>
        <a class="text-lg font-semibold" :src="link" :alt="props.value">
            {{ value }}{{ props.version ? ` (${props.version})` : "" }}
        </a>
    </div>
</template>
