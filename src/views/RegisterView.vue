<script setup lang="ts">
import Loading from "@/components/Loading.vue";
import RegisterPanel from "@/components/RegisterPanel.vue";
import { useServerStore } from "@/stores/server";

const server = useServerStore();
</script>

<template>
  <main class="min-h-screen flex items-center justify-center py-12 px-4">
    <div class="container max-w-6xl mx-auto">
      <!-- Header with gradient text -->
      <div class="text-center mb-12">
        <h1
          class="text-5xl font-bold mb-4 bg-gradient-to-r from-accent-600 via-pink-600 to-accent-600 bg-clip-text text-transparent dark:from-accent-400 dark:via-pink-400 dark:to-accent-400"
        >
          Create Account
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-400">
          Join us today and get started
        </p>
      </div>

      <Loading v-if="server.loggingIn" text="Creating your account..." />

      <div v-else>
        <!-- Initial Setup Banner -->
        <div
          v-if="server.config.initialised"
          class="max-w-md mx-auto mb-8 relative overflow-hidden"
        >
          <div
            class="relative bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-l-4 border-blue-500 dark:border-blue-400 rounded-lg p-6 shadow-lg"
          >
            <!-- Decorative background -->
            <div
              class="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"
            ></div>

            <div class="relative z-10">
              <div class="flex items-center justify-center mb-3">
                <div
                  class="p-2 bg-blue-500/20 dark:bg-blue-500/30 rounded-full"
                >
                  <svg
                    class="w-6 h-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <h3
                class="text-center text-lg font-bold text-blue-900 dark:text-blue-200 mb-2"
              >
                Initial Setup
              </h3>
              <p
                class="text-center text-blue-800 dark:text-blue-300 text-sm font-medium"
              >
                You will be registered as an administrator user
              </p>
            </div>
          </div>
        </div>

        <RegisterPanel />

        <!-- Additional info -->
        <div class="mt-8 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?
            <router-link
              to="/login"
              class="font-semibold text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300 transition-colors underline decoration-accent-500/30 hover:decoration-accent-500"
            >
              Sign in here
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </main>
</template>
