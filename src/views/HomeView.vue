<script setup lang="ts">
import { onMounted } from "vue";

import Title from "@/components/Title.vue";
import Welcome from "@/components/Welcome.vue";
import SecurityAlertsPie from "@/components/SecurityAlertsPie.vue";
import { useServerStore } from "@/stores/server";

const server = useServerStore();
</script>

<template>
    <main>
        <div class="container mt-4 mb-6 w-full mx-auto px-2">
            <Welcome v-if="!server.user" />

            <div v-else>
                <Title title="Konarr Home" />

                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    <div class="bg-white dark:bg-gray-800 dark:text-white shadow-md rounded-md p-4 text-center pb-6">
                        <h2 class="text-lg font-semibold">Projects</h2>
                        <p class="text-sm text-gray-500 dark:text-gray-200">
                            Summary of the projects
                        </p>

                        <div class="grid-cols-3 gap-4 mt-6">
                            <!-- Count of projects -->
                            <div class="flex items center justify-between mt-4 px-6">
                                <span class="text-sm text-gray-500 dark:text-gray-200">Total Projects</span>
                                <span class="text-lg font-semibold">{{ server.projects?.total
                                    || 0 }}</span>
                            </div>
                            <div class="flex items center justify-between mt-4 px-6">
                                <span class="text-sm text-gray-500 dark:text-gray-200">Total Servers</span>
                                <span class="text-lg font-semibold">{{ server.projects?.servers || 0 }}</span>
                            </div>
                            <div class="flex items center justify-between mt-4 px-6">
                                <span class="text-sm text-gray-500 dark:text-gray-200">Total Containers</span>
                                <span class="text-lg font-semibold">{{ server.projects?.containers || 0 }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white dark:bg-gray-800 dark:text-white shadow-md rounded-md p-4 text-center pb-6">
                        <h2 class="text-lg font-semibold">
                            Dependencies
                        </h2>
                        <p class="text-sm text-gray-500 dark:text-gray-200">Summary of the dependencies</p>
                        <div class="grid-cols-3 gap-4 mt-6">
                            <!-- Count of dependencies -->
                            <div class="flex items center justify-between mt-2 px-6">
                                <span class="text-sm text-gray-500 dark:text-gray-200">Total Dependencies</span>
                                <span class="text-lg font-semibold">{{ server.dependencies?.total || 0 }}</span>
                            </div>
                            <div class="flex items center justify-between mt-2 px-6">
                                <span class="text-sm text-gray-500 dark:text-gray-200">Libraries</span>
                                <span class="text-lg font-semibold">{{ server.dependencies?.libraries || 0 }}</span>
                            </div>
                            <div class="flex items center justify-between mt-2 px-6">
                                <span class="text-sm text-gray-500 dark:text-gray-200">Applications</span>
                                <span class="text-lg font-semibold">{{ server.dependencies?.applications || 0 }}</span>
                            </div>
                            <div class="flex items center justify-between mt-2 px-6">
                                <span class="text-sm text-gray-500 dark:text-gray-200">Operating Systems</span>
                                <span class="text-lg font-semibold">
                                    {{ server.dependencies?.['operating-systems'] || 0 }}
                                </span>
                            </div>
                            <div class="flex items center justify-between mt-2 px-6">
                                <span class="text-sm text-gray-500 dark:text-gray-200">Programming Languages</span>
                                <span class="text-lg font-semibold">{{ server.dependencies?.languages || 0 }}</span>
                            </div>
                            <div class="flex items center justify-between mt-2 px-6">
                                <span class="text-sm text-gray-500 dark:text-gray-200">Package Manager</span>
                                <span class="text-lg font-semibold">{{ server.dependencies?.['package-managers'] || 0 }}</span>
                            </div>
                            <div class="flex items center justify-between mt-2 px-6">
                                <span class="text-sm text-gray-500 dark:text-gray-200">Cryptography</span>
                                <span class="text-lg font-semibold">
                                    {{ server.dependencies?.['cryptographic-libraries'] || 0 }}
                                </span>
                            </div>
                            <div class="flex items center justify-between mt-2 px-6">
                                <span class="text-sm text-gray-500 dark:text-gray-200">Databases</span>
                                <span class="text-lg font-semibold">{{ server.dependencies?.databases || 0 }}</span>
                            </div>
                            <div class="flex items center justify-between mt-2 px-6">
                                <span class="text-sm text-gray-500 dark:text-gray-200">Compression Libraries</span>
                                <span class="text-lg font-semibold">
                                    {{ server.dependencies?.['compression-libraries'] || 0 }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white dark:bg-gray-800 dark:text-white shadow-md rounded-md p-4 text-center pb-6">
                        <h2 class="text-lg font-semibold">
                            Security
                        </h2>
                        <p v-if="server.security" class="text-sm text-gray-500 dark:text-gray-200">
                            Summary of the Security Alerts
                        </p>
                        <p v-else class="text-sm text-gray-500 dark:text-gray-200">
                            Feature Coming Soon...
                        </p>
                        <div v-if="server.security" class="grid-cols-3 gap-4 mt-6">
                            <SecurityAlertsPie :alerts="server.security" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
