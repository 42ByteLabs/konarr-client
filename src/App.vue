<script setup lang="ts">
import { onMounted } from "vue";
import { RouterLink, RouterView } from "vue-router";

import NavBar from "@/components/NavBar.vue";
import Footer from "@/components/Footer.vue";
import { useServerStore } from "@/stores/server";
import router from "@/router";

const server = useServerStore();

onMounted(() => {
    // Dark mode
    var darkMode = localStorage.getItem("dark-mode");
    if (darkMode === null) {
        darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    document.documentElement.className = darkMode === "true" ? "dark" : "";

    server.fetchInfo();
});

</script>

<template>
    <header>
        <NavBar :user="server.user" />
    </header>

    <notifications group="auth" position="top center" width="50%" classes="my-notification" />
    <notifications group="app" position="bottom right" width="30%" classes="my-notification" />

    <RouterView />

    <Footer :server="server" />

</template>

<style>
.my-notification {
    margin: 0 5px 5px;
    padding: 10px;
    font-size: 12px;
    color: #ffffff;

    background: #44a4fc;
    border-left: 5px solid #187fe7;

    &.success {
        background: #10b981;
        border-left-color: #047857;
        border-top-left-radius: 5px;
    }

    &.warn {
        background: #fb923c;
        border-left-color: #d97706;
        border-bottom-right-radius: 5px;
        border-bottom-left-radius: 5px;
    }

    &.error {
        background: #ef4444;
        border-left-color: #7f1d1d;
        border-bottom-right-radius: 5px;
        border-bottom-left-radius: 5px;
    }
}
</style>
