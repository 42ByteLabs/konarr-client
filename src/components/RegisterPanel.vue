<script setup lang="ts">
import { ref } from "vue";
import { router } from "@/router";
import { useServerStore } from "@/stores/server";

const server = useServerStore();

// Redirect to home if user is already logged in
if (server.user) {
  router.push({ name: "Home" });
}

const username = ref("");
const password = ref("");

// Login method
const register = async () => {
  await server.register(username.value, password.value);
};
</script>

<template>
  <div class="max-w-md mx-auto">
    <form>
      <div class="mb-4">
        <label
          for="username"
          class="block text-gray-700 text-sm font-bold mb-2"
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
          class="block text-gray-700 text-sm font-bold mb-2"
        >
          Password
        </label>
        <input
          id="password"
          v-model="password"
          type="password"
          name="password"
          class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div class="flex items-center justify-between">
        <!-- On click, call the login method -->
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          @click="register"
        >
          Register
        </button>
      </div>
    </form>
  </div>
</template>
