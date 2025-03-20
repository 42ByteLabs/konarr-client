<script setup lang="ts">
import { computed } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiGraph, mdiSecurity, mdiGroup, mdiCloudOffOutline, mdiCloudCheckOutline } from "@mdi/js";

import type { KonarrSecurityAlert } from "@/types";
import { useSecurityStore } from "@/stores/security";

const security = useSecurityStore();

const props = defineProps<{
    alert?: KonarrSecurityAlert;
    id?: number;
}>();

const alert = computed(() => {
    if (props.alert) {
        return props.alert;
    } else {
        security.fetchAlert(props.id);
        return security.data.find(
            (p: KonarrSecurityAlert) => p.id === security.current,
        );
    }
});

const link = computed(() => {
    return `/security/${props.alert.id}`;
});
const severity = computed(() => {
    if (props.alert.security) {
        return mdi
    }
});
</script>

<template>
    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg hover:bg-accent-500 py-2">
        <router-link :to="{ name: 'Project', params: { id: alert.id } }"
            class="dark:text-white hover:bg-pink-500 hover:shadow-lg">
            <h3 class="flex justify-center text-lg font-semibold">
                {{ props.alert.name }}
            </h3>

            <div class="grid grid-cols-4 mt-4 mb-2">
                <!-- Type -->
                <div class="flex items-center justify-center col-span-1">
                    <span v-if="project.children" class="ml-1">
                        {{ project.children.length || 0 }}
                    </span>
                </div>
                <!-- Online Status -->
                <div class="flex items-center justify-center col-span-1 mr-2">
                    <svg-icon v-if="project.status === true" type="mdi" :path="mdiCloudCheckOutline"
                        class="text-blue-400"></svg-icon>
                    <svg-icon v-else type="mdi" :path="mdiCloudOffOutline" class="text-red-400"></svg-icon>
                </div>
                <!-- Dependencies -->
                <div v-if="project.snapshot && project.snapshot.dependencies"
                    class="flex items-center justify-center col-span-1 mr-2">
                    <svg-icon type="mdi" :path="mdiGraph" class="text-green-400"></svg-icon>
                    <span class="ml-1">
                        {{ project.snapshot.dependencies || 0 }}
                    </span>
                </div>
                <!-- Security -->
                <div v-if="project.security" class="flex items-center justify-center col-span-1 mr-2">
                    <svg-icon v-if="project.security.critical !== 0" type="mdi" :path="mdiSecurity"
                        class="text-sec-critical-400"></svg-icon>
                    <svg-icon v-if="project.security.high !== 0" type="mdi" :path="mdiSecurity"
                        class="text-sec-high-400"></svg-icon>
                    <svg-icon v-if="project.security.medium !== 0" type="mdi" :path="mdiSecurity"
                        class="text-sec-medium-400"></svg-icon>
                    <svg-icon v-if="project.security.low !== 0" type="mdi" :path="mdiSecurity"
                        class="text-sec-low-400"></svg-icon>
                    <svg-icon v-else type="mdi" :path="mdiSecurity" class="text-sec-other-300"></svg-icon>
                    <span class="ml-1">
                        {{ project.security.total || 0 }}
                    </span>
                </div>
            </div>
        </router-link>
    </div>
</template>
