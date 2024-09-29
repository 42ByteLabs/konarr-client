<script setup lang="ts">
import { onMounted } from "vue";
import { RouterLink, RouterView } from "vue-router";

import NavBar from "@/components/NavBar.vue";
import { useServerStore } from "@/stores/server";
import router from "@/router";

const server = useServerStore();

onMounted(() => {
    server.fetchInfo();
});

</script>

<template>
    <header>
        <NavBar :user="server.user" />
    </header>

    <RouterView />

    <footer class="mx-auto bg-gray-100 pt-4 pb-6">
        <p class="text-center text-gray-500 text-xs pb-2">
            <a :href="'https://github.com/42ByteLabs/konarr/releases/tag/' + server.version
                ">
                v{{ server.version }}
            </a>
            - {{ server.commit }}
        </p>

        <p class="text-center text-gray-500 text-xs">
            <a href="https://42bytelabs.com">42ByteLabs</a> &copy; 2024 All rights
            reserved
        </p>
    </footer>
</template>
