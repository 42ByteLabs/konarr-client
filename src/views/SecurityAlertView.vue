<script setup lang="ts">
import { onMounted, onUpdated, computed } from "vue";
import { router } from "@/router";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiSecurity } from "@mdi/js";
import type { KonarrSecurityAlert } from "@/types";

import Title from "@/components/Title.vue";
import Loading from "@/components/Loading.vue";

import { useSecurityStore } from "@/stores/security";

const security = useSecurityStore();

const props = defineProps<{
    id?: number;
}>();

onMounted(() => {
    // Get ID from the URL
    const current = parseInt(window.location.pathname.split("/").pop()!);
    security.fetchAlert(current);
});

onUpdated(() => {
    const current = parseInt(window.location.pathname.split("/").pop()!);
    security.fetchAlert(current);
});

var alert = computed(() => {
    return security.data.find(
        (c: KonarrSecurityAlert) => c.id === security.current,
    );
});
</script>

<template>
    <main>
        <div v-if="alert" class="container mt-4 mb-12 w-full mx-auto dark:text-white">
            <div class="grid md:grid-cols-10 sm:grid-cols-1">
                <div class="md:col-span-2 sm:grid-cols-1">
                </div>
                <div class="md:col-span-6 sm:grid-cols-1">
                    <Title :title="alert.name" :subtitle="alert.severity" />
                </div>
            </div>
        </div>
        <div v-else class="container mt-4 mb-6 w-full max-w-xs mx-auto">
            <Title title="Alert" subtitle="Alert not found" description="Please try again with a correct id" />
        </div>
    </main>
</template>
