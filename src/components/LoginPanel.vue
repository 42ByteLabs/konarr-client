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
    <form>
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
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
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
          class="shadow appearance-none border border-accent-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <!-- Make center -->
      <div class="flex items-center justify-between">
        <button :class="primaryButton() + ' px-8'" type="button" @click="login">
          Sign In
        </button>
      </div>
    </form>
  </div>
</template>
