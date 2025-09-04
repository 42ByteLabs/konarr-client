<script setup lang="ts">
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiPencil, mdiMenuLeft } from "@mdi/js";

const props = defineProps<{
  id: number;
  title: string;
  parent?: number;
  edit?: boolean;
}>();
</script>

<template>
  <div class="grid grid-cols-8 mb-8 mt-4">
    <div class="col-span-1 text-center">
      <router-link
        v-if="parent"
        :to="{ name: 'Project', params: { id: props.parent } }"
        class="text-black hover:text-gray-600 dark:hover:text-gray-100 mt-4"
      >
        <button
          class="flex items-center rounded-md bg-accent-400 hover:bg-accent-500 p-2 pr-6 mt-2"
        >
          <svg-icon
            type="mdi"
            :path="mdiMenuLeft"
            class="h-6 w-6 mr-1"
          ></svg-icon>
          <span class="hidden sm:block"> Parent </span>
        </button>
      </router-link>
      <router-link
        v-else
        :to="{ name: 'Projects' }"
        class="text-black hover:text-gray-600 dark:hover:text-gray-100 mt-4"
      >
        <button
          class="flex items-center rounded-md bg-accent-400 hover:bg-accent-500 p-2 pr-6 mt-2"
        >
          <svg-icon
            type="mdi"
            :path="mdiMenuLeft"
            class="h-6 w-6 mr-1 sm:flex sm:justify-center"
          ></svg-icon>
          <span class="hidden sm:block"> Projects </span>
        </button>
      </router-link>
    </div>
    <div class="col-span-6">
      <h2 class="text-4xl mt-2 text-center dark:text-white">
        {{ title }}
      </h2>
    </div>
    <div v-if="props.edit" class="col-span-1 text-center">
      <router-link :to="{ name: 'Edit Project', params: { id: props.id } }">
        <button
          class="bg-blue-400 hover:bg-blue-600 text-white dark:text-black font-bold py-2 px-4 mt-2 rounded focus:outline-none focus:shadow-outline"
        >
          <svg-icon type="mdi" :path="mdiPencil" class="h-6 w-6"></svg-icon>
        </button>
      </router-link>
    </div>
  </div>
</template>
