<script setup lang="ts">
import { ref, computed } from "vue";
import { router } from "@/router";
import { useServerStore } from "@/stores/server";
import { primaryButton } from "@/utils/buttonClasses";
import PasswordStrengthMeter from "@/components/PasswordStrengthMeter.vue";

const server = useServerStore();

// Redirect to home if user is already logged in
if (server.user) {
  router.push({ name: "Home" });
}

const username = ref("");
const password = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");

// Check if passwords match
const passwordsMatch = computed(() => {
  if (!confirmPassword.value) return true;
  return password.value === confirmPassword.value;
});

// Check if form is valid
const isFormValid = computed(() => {
  return (
    username.value.length > 0 &&
    password.value.length >= 8 &&
    passwordsMatch.value
  );
});

// Register method
const register = async () => {
  errorMessage.value = "";

  if (!isFormValid.value) {
    if (!passwordsMatch.value) {
      errorMessage.value = "Passwords do not match";
    } else if (password.value.length < 8) {
      errorMessage.value = "Password must be at least 8 characters";
    } else {
      errorMessage.value = "Please fill in all fields";
    }
    return;
  }

  await server.register(username.value, password.value);
};
</script>

<template>
  <div class="max-w-md mx-auto">
    <form @submit.prevent="register">
      <!-- Error message -->
      <div
        v-if="errorMessage"
        class="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded"
      >
        {{ errorMessage }}
      </div>

      <!-- Username field -->
      <div class="mb-4">
        <label
          for="username"
          class="block text-gray-700 dark:text-white text-sm font-bold mb-2"
        >
          Username
        </label>
        <input
          id="username"
          v-model="username"
          type="text"
          name="username"
          required
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-800 dark:border-gray-600 leading-tight focus:outline-none focus:shadow-outline focus:border-accent-500"
        />
      </div>

      <!-- Password field -->
      <div class="mb-4">
        <label
          for="password"
          class="block text-gray-700 dark:text-white text-sm font-bold mb-2"
        >
          Password
        </label>
        <input
          id="password"
          v-model="password"
          type="password"
          name="password"
          required
          minlength="8"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-800 dark:border-gray-600 leading-tight focus:outline-none focus:shadow-outline focus:border-accent-500"
        />
        <PasswordStrengthMeter :password="password" />
      </div>

      <!-- Confirm password field -->
      <div class="mb-6">
        <label
          for="confirmPassword"
          class="block text-gray-700 dark:text-white text-sm font-bold mb-2"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          name="confirmPassword"
          required
          :class="[
            'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-800 leading-tight focus:outline-none focus:shadow-outline',
            passwordsMatch
              ? 'dark:border-gray-600 focus:border-accent-500'
              : 'border-red-500 dark:border-red-500',
          ]"
        />
        <p
          v-if="!passwordsMatch && confirmPassword.length > 0"
          class="mt-2 text-sm text-red-600 dark:text-red-400"
        >
          Passwords do not match
        </p>
      </div>

      <!-- Submit button -->
      <div class="flex items-center justify-center">
        <button
          :class="primaryButton()"
          :disabled="!isFormValid"
          type="submit"
          class="w-full sm:w-auto sm:min-w-[200px]"
        >
          Register
        </button>
      </div>
    </form>
  </div>
</template>
