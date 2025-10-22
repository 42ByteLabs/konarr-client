<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  password: string;
}>();

interface StrengthResult {
  score: number;
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  feedback: string[];
}

const strength = computed((): StrengthResult => {
  const password = props.password;

  if (!password || password.length === 0) {
    return {
      score: 0,
      label: "Enter a password",
      color: "bg-gray-300",
      bgColor: "bg-gray-100",
      textColor: "text-gray-500 dark:text-gray-400",
      feedback: ["Password must be at least 8 characters"],
    };
  }

  let score = 0;
  const feedback: string[] = [];

  // Length check
  if (password.length >= 12) {
    score += 1;
  } else {
    feedback.push("Use at least 12 characters");
  }

  if (password.length >= 16) {
    score += 1;
  }

  // Lowercase letters
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add lowercase letters");
  }

  // Uppercase letters
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add uppercase letters");
  }

  // Numbers
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add numbers");
  }

  // Special characters
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add special characters (!@#$%^&*)");
  }

  // Common patterns to avoid
  if (
    /^(password|123456|qwerty|abc123|letmein|admin|welcome)/i.test(password)
  ) {
    score = Math.max(0, score - 2);
    feedback.push("Avoid common passwords");
  }

  // Sequential characters
  if (/(.)\1{2,}/.test(password)) {
    score = Math.max(0, score - 1);
    feedback.push("Avoid repeating characters");
  }

  // Determine strength level
  if (score <= 2) {
    return {
      score,
      label: "Weak",
      color: "bg-red-500",
      bgColor: "bg-red-100 dark:bg-red-900",
      textColor: "text-red-700 dark:text-red-400",
      feedback,
    };
  } else if (score <= 4) {
    return {
      score,
      label: "Fair",
      color: "bg-yellow-500",
      bgColor: "bg-yellow-100 dark:bg-yellow-900",
      textColor: "text-yellow-700 dark:text-yellow-400",
      feedback,
    };
  } else if (score <= 5) {
    return {
      score,
      label: "Good",
      color: "bg-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900",
      textColor: "text-blue-700 dark:text-blue-400",
      feedback,
    };
  } else {
    return {
      score,
      label: "Strong",
      color: "bg-green-500",
      bgColor: "bg-green-100 dark:bg-green-900",
      textColor: "text-green-700 dark:text-green-400",
      feedback,
    };
  }
});

const widthPercentage = computed(() => {
  if (!props.password) return "0%";
  const maxScore = 6;
  return `${Math.min((strength.value.score / maxScore) * 100, 100)}%`;
});
</script>

<template>
  <div class="mt-2">
    <!-- Strength bar -->
    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
      <div
        :class="strength.color"
        class="h-2 rounded-full transition-all duration-300"
        :style="{ width: widthPercentage }"
      ></div>
    </div>

    <!-- Strength label and feedback -->
    <div class="flex items-start justify-between">
      <div>
        <span :class="[strength.textColor, 'text-sm font-medium']">
          {{ strength.label }}
        </span>
        <ul
          v-if="strength.feedback.length > 0 && password.length > 0"
          class="mt-1 text-xs text-gray-600 dark:text-gray-400 space-y-1"
        >
          <li v-for="(item, index) in strength.feedback" :key="index">
            • {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
