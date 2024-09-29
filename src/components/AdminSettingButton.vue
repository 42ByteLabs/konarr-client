<script setup lang="ts">
import { computed } from "vue";
import router from "@/router";
import SvgIcon from "@jamescoyle/vue-icon";

// Props
const props = defineProps<{
    title: string;
    link?: string;
    icon?: string;
    current?: boolean;
    disabled?: boolean;
}>();

</script>

<template>
    <div>
        <router-link v-if="!props.disabled" :to="{ name: props.link }"
            :class="[current ? 'bg-pink-100 hover:bg-pink-200' : 'bg-gray-100 hover:bg-pink-200', 'flex items-left justify-between w-full p-2 rounded-lg mt-4 pl-6']">
            <span :class="[current ? 'text-gray-500' : 'text-gray-700']" class="flex items-center">
                <strong>
                    {{ title }}
                </strong>
            </span>
            <svg-icon type="mdi" :path="icon"></svg-icon>
        </router-link>
        <button v-else disabled
            class="flex items-left justify-between w-full p-2 rounded-lg mt-4 pl-6 bg-gray-100 hover:bg-pink-200">
            <span :class="[current ? 'text-gray-500' : 'text-gray-700']" class="flex items-center">
                <strong>
                    {{ title }}
                </strong>
            </span>
            <svg-icon type="mdi" :path="icon"></svg-icon>
        </button>
    </div>
</template>
