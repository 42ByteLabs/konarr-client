<script setup lang="ts">
import { ref } from "vue";
import { router } from "@/router";
import { useServerStore } from "@/stores/server";
import { primaryButton } from "@/utils/buttonClasses";

const server = useServerStore();

// Redirect to home if user is already logged in
if (server.user) {
  router.push({ name: "home" });
}

const username = ref("");
const password = ref("");

// Login method
const login = async () => {
  await server.login(username.value, password.value);
};
</script>

<template>
  <div class="max-w-md mx-auto">
    <form @submit.prevent="login">
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
      <div class="mb-6">
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
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-800 dark:border-gray-600 leading-tight focus:outline-none focus:shadow-outline focus:border-accent-500"
        />
      </div>

      <!-- Submit button -->
      <div class="flex items-center justify-center">
        <button
          :class="primaryButton()"
          type="submit"
          class="w-full sm:w-auto sm:min-w-[200px]"
        >
          Sign In
        </button>
      </div>
    </form>
  </div>
</template>
