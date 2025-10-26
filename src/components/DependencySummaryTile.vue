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
          "bg-gradient-to-r from-sec-total-50 to-sec-total-100 dark:from-sec-total-900/20 dark:to-sec-total-800/20",
        border: "border-sec-total-200 dark:border-sec-total-800",
        icon: "text-sec-total-600 dark:text-sec-total-400",
        count: "text-sec-total-700 dark:text-sec-total-300",
      };
    case "purple":
      return {
        gradient:
          "bg-gradient-to-r from-sec-malware-50 to-sec-malware-100 dark:from-sec-malware-900/20 dark:to-sec-malware-800/20",
        border: "border-sec-malware-200 dark:border-sec-malware-800",
        icon: "text-sec-malware-600 dark:text-sec-malware-400",
        count: "text-sec-malware-700 dark:text-sec-malware-300",
      };
    case "green":
      return {
        gradient:
          "bg-gradient-to-r from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20",
        border: "border-success-200 dark:border-success-800",
        icon: "text-success-600 dark:text-success-400",
        count: "text-success-700 dark:text-success-300",
      };
    case "orange":
      return {
        gradient:
          "bg-gradient-to-r from-sec-high-50 to-sec-high-100 dark:from-sec-high-900/20 dark:to-sec-high-800/20",
        border: "border-sec-high-200 dark:border-sec-high-800",
        icon: "text-sec-high-600 dark:text-sec-high-400",
        count: "text-sec-high-700 dark:text-sec-high-300",
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
