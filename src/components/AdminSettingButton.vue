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
import { primaryButton, neutralButton } from "@/utils/buttonClasses";
</script>

<template>
  <div>
    <router-link
      v-if="!props.disabled"
      :to="{ name: props.link }"
      :class="[
        current ? primaryButton() : neutralButton(),
        'flex items-left justify-between w-full p-2 rounded-lg mt-2 sm:mt-4 pl-6',
      ]"
    >
      <span
        :class="[
          current
            ? 'text-black dark:text-white'
            : 'text-gray-700 dark:text-white',
        ]"
        class="flex items-center"
      >
        <strong>
          {{ title }}
        </strong>
      </span>
      <svg-icon
        v-if="icon"
        type="mdi"
        :path="icon"
        class="dark:text-white"
      ></svg-icon>
    </router-link>
    <button
      v-else
      disabled
      :class="
        'flex items-left justify-between w-full p-2 rounded-lg mt-4 pl-6 ' +
        neutralButton()
      "
    >
      <span
        :class="[current ? 'text-gray-500' : 'text-gray-700']"
        class="flex items-center"
      >
        <strong>
          {{ title }}
        </strong>
      </span>
      <svg-icon v-if="icon" type="mdi" :path="icon"></svg-icon>
    </button>
  </div>
</template>
