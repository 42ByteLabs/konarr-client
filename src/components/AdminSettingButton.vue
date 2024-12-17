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

const current = computed(() => {
    return router.currentRoute.value.name == props.link;
});

</script>

<template>
    <div>
        <router-link v-if="!props.disabled" :to="{ name: props.link }"
            :class="[current ? 'bg-accent-500 hover:bg-accent-400' : 'bg-gray-100 dark:bg-gray-600 hover:bg-accent-400 hover:dark:bg-accent-600', 'flex items-left justify-between w-full p-2 rounded-lg mt-2 sm:mt-4 pl-6']">
            <span :class="[current ? 'text-black dark:text-white' : 'text-gray-700 dark:text-white']"
                class="flex items-center">
                <strong>
                    {{ title }}
                </strong>
            </span>
            <svg-icon type="mdi" :path="icon" class="dark:text-white"></svg-icon>
        </router-link>
        <button v-else disabled
            class="flex items-left justify-between w-full p-2 rounded-lg mt-4 pl-6 bg-gray-100 hover:bg-accent-200">
            <span :class="[current ? 'text-gray-500' : 'text-gray-700']" class="flex items-center">
                <strong>
                    {{ title }}
                </strong>
            </span>
            <svg-icon type="mdi" :path="icon"></svg-icon>
        </button>
    </div>
</template>
