<script setup lang="ts">
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiMenuRight } from "@mdi/js";

const props = defineProps<{
    id: number;
    name: string;
    parent?: number;
}>();

</script>

<template>
    <div class="bg-white p-4 mb-6">
        <ol class="flex items-center">
            <li class="inline-flex items-center ml-3">
                <router-link :to="{ 'name': 'Projects' }" class="text-gray-500 hover:text-gray-700">
                    Projects
                </router-link>
            </li>
            <li v-if="props.parent" class="inline-flex items-center mx-3">
                <svg-icon type="mdi" :path="mdiMenuRight" class="h-4 w-4 mr-3"></svg-icon>
                <router-link :to="{ 'name': 'Project', 'params': { 'id': props.parent } }"
                    class="text-gray-500 hover:text-gray-700">
                    Parent
                </router-link>
            </li>
            <li class="inline-flex items-center">
                <svg-icon type="mdi" :path="mdiMenuRight" class="h-4 w-4 mr-3"></svg-icon>
                <router-link :to="{ 'name': 'Project', 'params': { 'id': props.id } }"
                    class="text-pink-500 hover:text-pink-700">
                    {{ props.name }}
                </router-link>
            </li>
        </ol>
    </div>
</template>
