<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    type?: "bar" | "spinner" | "dots";
    size?: "sm" | "md" | "lg";
    text?: string;
  }>(),
  {
    type: "bar",
    size: "md",
    text: "",
  }
);

const sizeClasses = computed(() => {
  if (props.type === "spinner") {
    return {
      sm: "h-6 w-6 border-2",
      md: "h-10 w-10 border-3",
      lg: "h-16 w-16 border-4",
    }[props.size];
  } else if (props.type === "dots") {
    return {
      sm: "h-2 w-2",
      md: "h-3 w-3",
      lg: "h-4 w-4",
    }[props.size];
  }
  return "";
});

const barHeight = computed(() => {
  return {
    sm: "h-1",
    md: "h-1.5",
    lg: "h-2",
  }[props.size];
});
</script>

<template>
  <div class="w-full mb-6">
    <!-- Progress Bar -->
    <div v-if="type === 'bar'" class="w-full">
      <div
        :class="[
          barHeight,
          'w-full bg-accent-100 dark:bg-accent-900/20 overflow-hidden rounded-full',
        ]"
      >
        <div
          class="progress-bar h-full bg-accent-500 rounded-full animate-progress"
        ></div>
      </div>
      <p
        v-if="text"
        class="text-center text-sm text-gray-600 dark:text-gray-400 mt-2"
      >
        {{ text }}
      </p>
    </div>

    <!-- Spinner -->
    <div v-else-if="type === 'spinner'" class="flex flex-col items-center">
      <div
        :class="[
          sizeClasses,
          'border-accent-200 border-t-accent-500 rounded-full animate-spin',
        ]"
      ></div>
      <p
        v-if="text"
        class="text-center text-sm text-gray-600 dark:text-gray-400 mt-3"
      >
        {{ text }}
      </p>
    </div>

    <!-- Dots -->
    <div v-else-if="type === 'dots'" class="flex flex-col items-center">
      <div class="flex gap-2">
        <div
          :class="[sizeClasses, 'bg-accent-500 rounded-full animate-bounce-1']"
        ></div>
        <div
          :class="[sizeClasses, 'bg-accent-500 rounded-full animate-bounce-2']"
        ></div>
        <div
          :class="[sizeClasses, 'bg-accent-500 rounded-full animate-bounce-3']"
        ></div>
      </div>
      <p
        v-if="text"
        class="text-center text-sm text-gray-600 dark:text-gray-400 mt-3"
      >
        {{ text }}
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Progress Bar Animation */
@keyframes progress {
  0% {
    transform: translateX(-100%);
    width: 50%;
  }
  50% {
    width: 80%;
  }
  100% {
    transform: translateX(200%);
    width: 50%;
  }
}

.animate-progress {
  animation: progress 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

/* Bouncing Dots Animation */
@keyframes bounce-dot {
  0%,
  80%,
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  40% {
    transform: translateY(-12px) scale(1.1);
    opacity: 0.8;
  }
}

.animate-bounce-1 {
  animation: bounce-dot 1.4s infinite;
  animation-delay: 0s;
}

.animate-bounce-2 {
  animation: bounce-dot 1.4s infinite;
  animation-delay: 0.2s;
}

.animate-bounce-3 {
  animation: bounce-dot 1.4s infinite;
  animation-delay: 0.4s;
}

/* Spinner Animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
