<script setup lang="ts">
import { onMounted } from "vue";
import { RouterLink, RouterView } from "vue-router";

import NavBar from "@/components/NavBar.vue";
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

    <notifications position="top right" width="40%" />

    <RouterView />

    <footer class="mx-auto bg-gray-100 dark:bg-black pt-4 pb-6">
        <p class="text-center text-gray-500 dark:text-gray-100 text-xs pb-2">
            <a :href="'https://github.com/42ByteLabs/konarr/releases/tag/' + server.version
                ">
                v{{ server.version }}
            </a>
            -
            <a :href="'https://github.com/42ByteLabs/konarr/commit/' + server.commit">
                {{ server.commit }}
            </a>
        </p>

        <p class="text-center text-gray-500 dark:text-gray-100 text-xs">
            <a href="https://42bytelabs.com">42ByteLabs</a> &copy; 2024 All rights
            reserved
        </p>
    </footer>
</template>
