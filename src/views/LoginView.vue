<script setup lang="ts">
import { router } from "@/router";
import LoginPanel from "@/components/LoginPanel.vue";
import Loading from "@/components/Loading.vue";
import { useServerStore } from "@/stores/server";

const server = useServerStore();

// Redirect to home if user is already logged in
if (server.user) {
  router.push({ name: "home" });
}
</script>

<template>
  <main class="min-h-screen flex items-center justify-center py-12 px-4">
    <div class="container max-w-6xl mx-auto">
      <!-- Header with gradient text -->
      <div class="text-center mb-12">
        <h1
          class="text-5xl font-bold mb-4 bg-gradient-to-r from-accent-600 via-pink-600 to-accent-600 bg-clip-text text-transparent dark:from-accent-400 dark:via-pink-400 dark:to-accent-400"
        >
          Welcome Back
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-400">
          Sign in to your account
        </p>
      </div>

      <Loading v-if="server.loggingIn" text="Signing in..." />

      <div v-else>
        <LoginPanel />

        <!-- Additional info -->
        <div class="mt-8 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?
            <router-link
              to="/register"
              class="font-semibold text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300 transition-colors underline decoration-accent-500/30 hover:decoration-accent-500"
            >
              Register here
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </main>
</template>
