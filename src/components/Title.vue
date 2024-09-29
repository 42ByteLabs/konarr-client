<script setup lang="ts">
import { computed } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiGraph, mdiPencil } from "@mdi/js";

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
        <h1 class="text-4xl text-center pr-5">
            {{ title }}
        </h1>

        <div v-if="description" v-html="description" class="text-center text-gray-500 text-sm my-2"></div>

        <h2 v-if="subtitle" class="text-2xl text-center mb-4">
            {{ subtitle }}
        </h2>
    </div>
</template>
