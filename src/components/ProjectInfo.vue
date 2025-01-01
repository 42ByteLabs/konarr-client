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
        <span v-if="props.value !== value" class="tooltip">
            <slot>
                <h5 v-if="props.name" class="text-sm items-start mx-auto">
                    {{ props.name }}
                </h5>
                <a v-if="props.link" class="text-lg font-semibold" :src="props.link" :alt="props.value">
                    {{ value }}{{ props.version ? ` (${props.version})` : "" }}
                </a>
                <span v-else class="text-lg font-semibold" :alt="props.value">
                    {{ value }}{{ props.version ? ` (${props.version})` : "" }}
                </span>
            </slot>
            <span class="tooltiptext">
                {{ props.value }}
            </span>
        </span>
        <div v-else>
            <h5 v-if="props.name" class="text-sm items-start mx-auto">
                {{ props.name }}
            </h5>
            <a v-if="props.link" class="text-lg font-semibold" :src="props.link" :alt="props.value">
                {{ value }}{{ props.version ? ` (${props.version})` : "" }}
            </a>
            <span v-else class="text-lg font-semibold" :alt="props.value">
                {{ value }}{{ props.version ? ` (${props.version})` : "" }}
            </span>
        </div>
    </div>
</template>

<style scoped>
.tooltip {
    position: relative;
    display: inline-block;
    /* border-bottom: 1px dotted black; */
}

.tooltip .tooltiptext {
    visibility: hidden;
    width: 30rem;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    margin-left: -15rem;
    opacity: 0;
    transition: opacity 0.3s;
}

.tooltip .tooltiptext::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: black transparent transparent transparent;
}

.tooltip:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
}
</style>
