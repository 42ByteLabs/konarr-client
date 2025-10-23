<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import SvgIcon from "@jamescoyle/vue-icon";

const props = defineProps<{
  title: string;
  count: number;
  icon: string;
  subtitle: string;
  infoText: string;
  variant?: "blue" | "purple" | "green" | "orange";
  depType?: string;
}>();

const router = useRouter();

const handleClick = () => {
  if (props.depType) {
    router.push({
      name: "Dependencies",
      query: { select: props.depType },
    });
  }
};

const colorClasses = computed(() => {
  switch (props.variant) {
    case "blue":
      return {
        gradient:
          "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
        border: "border-blue-200 dark:border-blue-800",
        icon: "text-blue-600 dark:text-blue-400",
        count: "text-blue-700 dark:text-blue-300",
      };
    case "purple":
      return {
        gradient:
          "bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
        border: "border-purple-200 dark:border-purple-800",
        icon: "text-purple-600 dark:text-purple-400",
        count: "text-purple-700 dark:text-purple-300",
      };
    case "green":
      return {
        gradient:
          "bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
        border: "border-green-200 dark:border-green-800",
        icon: "text-green-600 dark:text-green-400",
        count: "text-green-700 dark:text-green-300",
      };
    case "orange":
      return {
        gradient:
          "bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
        border: "border-orange-200 dark:border-orange-800",
        icon: "text-orange-600 dark:text-orange-400",
        count: "text-orange-700 dark:text-orange-300",
      };
    default:
      return {
        gradient:
          "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20",
        border: "border-gray-200 dark:border-gray-800",
        icon: "text-gray-600 dark:text-gray-400",
        count: "text-gray-700 dark:text-gray-300",
      };
  }
});
</script>

<template>
  <div
    class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 transition-all cursor-pointer hover:shadow-xl hover:scale-[1.02]"
    :class="{ 'cursor-pointer': props.depType }"
    @click="handleClick"
  >
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
      {{ props.title }}
    </h2>
    <div class="space-y-3">
      <div
        :class="[
          'flex items-center justify-between p-4 rounded-lg border',
          colorClasses.gradient,
          colorClasses.border,
        ]"
      >
        <div class="flex items-center">
          <svg-icon
            type="mdi"
            :path="props.icon"
            :class="['mr-3', colorClasses.icon]"
            :size="32"
          ></svg-icon>
          <div>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ props.title }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ props.subtitle }}
            </p>
          </div>
        </div>
        <span :class="['text-2xl font-bold', colorClasses.count]">
          {{ props.count }}
        </span>
      </div>
      <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
        <p class="text-xs text-gray-600 dark:text-gray-400">
          {{ props.infoText }}
        </p>
      </div>
    </div>
  </div>
</template>
