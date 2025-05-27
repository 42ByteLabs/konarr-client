<script setup lang="ts">
import { onMounted, computed, ref } from "vue";
import type { KonarrServer } from "@/types";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiAccount, mdiShieldAccountOutline } from "@mdi/js";
import { Switch } from '@headlessui/vue'
import { useServerStore } from "@/stores/server";

const server = useServerStore();

// On keypress `e`, set the `admin_mode` variable to `true`
const setAdminMode = (e: KeyboardEvent) => {
    if (e.key === "`") {
        server.toggleAdminMode();
    }
}
window.addEventListener("keypress", setAdminMode);

</script>
<template>
    <div class="mx-4 mt-1.5">
        <Switch v-model="server.adminMode" :class="server.adminMode ? 'bg-accent-500' : 'bg-gray-500'"
            class="relative inline-flex h-6 w-11 items-center rounded-full" @click="server.toggleAdminMode()">

            <span :class="server.adminMode ? 'translate-x-6' : 'translate-x-1'"
                class="inline-block h-4 w-4 transform rounded-full transition">
                <div v-if="server.adminMode">
                    <svg-icon type="mdi" :path="mdiShieldAccountOutline" class="w-4 h-4 text-black" />
                </div>
                <div v-else>
                    <svg-icon type="mdi" :path="mdiAccount" class="w-4 h-4 text-white" />
                </div>
            </span>
        </Switch>
    </div class="mx-4">
</template>
