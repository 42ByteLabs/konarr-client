<script setup lang="ts">
import type { KonarrServer } from "@/types";
import DarkModeButton from "@/components/DarkModeButton.vue";

const props = defineProps<{
    server: KonarrServer;
}>();

</script>
<template>
    <footer class="grid grid-cols-12 mx-auto bg-gray-100 dark:bg-black pt-4 pb-6">
        <div class="col-span-4"></div>
        <div class="col-span-4 text-center">
            <p class="text-center text-gray-500 dark:text-gray-100 text-xs pb-2">
                <a :href="'https://github.com/42ByteLabs/konarr/releases/tag/' + props.server.version
                    ">
                    v{{ props.server.version }}
                </a>
                -
                <a :href="'https://github.com/42ByteLabs/konarr/commit/' + props.server.commit">
                    {{ props.server.commit }}
                </a>
            </p>

            <p class="text-center text-gray-500 dark:text-gray-100 text-xs">
                <a href="https://42bytelabs.com">42ByteLabs</a> &copy; 2024 All rights
                reserved
            </p>
        </div>
        <!-- Dark mode toggle -->
        <div class="col-span-1"></div>
        <div class="col-span-1 text-center">
            <DarkModeButton />
        </div>
    </footer>
</template>
