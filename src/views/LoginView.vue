<script setup lang="ts">
// https://www.creative-tim.com/twcomponents/component/indeterminate-progress-bar

import { router } from "@/router";
import Title from "@/components/Title.vue";
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
  <main>
    <div class="container mt-4 mb-6 w-full mx-auto px-4">
      <Title title="Login" subtitle="Sign in to your account" />

      <Loading v-if="server.loggingIn" text="Signing in..." />

      <LoginPanel />
    </div>
  </main>
</template>
