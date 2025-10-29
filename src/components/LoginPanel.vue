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
    <div
      class="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 overflow-hidden"
    >
      <!-- Decorative background gradient -->
      <div
        class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-accent-500/10 to-pink-500/10 rounded-full blur-3xl -z-0"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/10 to-accent-500/10 rounded-full blur-3xl -z-0"
      ></div>

      <form class="relative z-10 space-y-6" @submit.prevent="login">
        <!-- Username field -->
        <div class="group">
          <label
            for="username"
            class="block text-gray-700 dark:text-gray-200 text-sm font-semibold mb-2 transition-colors group-focus-within:text-accent-600 dark:group-focus-within:text-accent-400"
          >
            Username
          </label>
          <div class="relative">
            <input
              id="username"
              v-model="username"
              type="text"
              name="username"
              required
              class="w-full bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 px-4 py-3 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 hover:border-accent-400 dark:hover:border-accent-500 transition-all duration-200 shadow-inner"
            />
            <!-- Animated underline effect -->
            <div
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-500 via-pink-500 to-accent-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-center rounded-full"
            ></div>
          </div>
        </div>

        <!-- Password field -->
        <div class="group">
          <label
            for="password"
            class="block text-gray-700 dark:text-gray-200 text-sm font-semibold mb-2 transition-colors group-focus-within:text-accent-600 dark:group-focus-within:text-accent-400"
          >
            Password
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              type="password"
              name="password"
              required
              class="w-full bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 px-4 py-3 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 hover:border-accent-400 dark:hover:border-accent-500 transition-all duration-200 shadow-inner"
            />
            <!-- Animated underline effect -->
            <div
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-500 via-pink-500 to-accent-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-center rounded-full"
            ></div>
          </div>
        </div>

        <!-- Submit button -->
        <div class="flex items-center justify-center pt-4">
          <button
            :class="primaryButton()"
            type="submit"
            class="w-full sm:w-auto sm:min-w-[200px] transform hover:scale-105 active:scale-95 transition-transform duration-200"
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
