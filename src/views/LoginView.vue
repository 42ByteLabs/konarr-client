<script setup lang="ts">
// https://www.creative-tim.com/twcomponents/component/indeterminate-progress-bar

import { onMounted } from "vue";
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
            <Title title="Login" />

            <Loading v-if="server.logging_in" />

            <LoginPanel />
        </div>
    </main>
</template>

<style scoped>
.progress {
    animation: progress 2s infinite;
}

@keyframes progress {
    0% {
        transform: translateX(-100%);
    }

    100% {
        transform: translateX(100%);
    }
}
</style>
