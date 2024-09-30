<script setup lang="ts">
import { onMounted } from "vue";

import Title from "@/components/Title.vue";
import Welcome from "@/components/Welcome.vue";
import { useServerStore } from "@/stores/server";

const server = useServerStore();
</script>

<template>
    <main>
        <div class="container mt-4 mb-6 w-full mx-auto">
            <Welcome v-if="!server.user" />

            <div v-else>
                <Title title="Konarr Home" />

                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    <div class="bg-white shadow-md rounded-md p-4 text-center">
                        <h2 class="text-lg font-semibold">Projects</h2>
                        <p class="text-sm text-gray-500">Summary of the projects</p>

                        <div class="grid-cols-3 gap-4 mt-6">
                            <!-- Count of projects -->
                            <div class="flex items center justify-between mt-4 px-6">
                                <span class="text-sm text-gray-500">Total Projects</span>
                                <span class="text-lg font-semibold">{{ server.projects.total }}</span>
                            </div>
                            <div class="flex items center justify-between mt-4 px-6">
                                <span class="text-sm text-gray-500">Total Servers</span>
                                <span class="text-lg font-semibold">{{ server.projects.servers }}</span>
                            </div>
                            <div class="flex items center justify-between mt-4 px-6">
                                <span class="text-sm text-gray-500">Total Containers</span>
                                <span class="text-lg font-semibold">{{ server.projects.containers }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white shadow-md rounded-md p-4 text-center pb-6">
                        <h2 class="text-lg font-semibold">
                            Dependencies
                        </h2>
                        <p class="text-sm text-gray-500">Summary of the dependencies</p>
                        <div class="grid-cols-3 gap-4 mt-6">
                            <!-- Count of dependencies -->
                            <div class="flex items center justify-between mt-4 px-6">
                                <span class="text-sm text-gray-500">Total Dependencies</span>
                                <span class="text-lg font-semibold">{{ server.dependencies.total }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white shadow-md rounded-md p-4 pb-6 text-center">
                        <h2 class="text-lg font-semibold">
                            Security
                        </h2>
                        <p v-if="server.security" class="text-sm text-gray-500">Summary of the Security Alerts</p>
                        <p v-else class="text-sm text-gray-500">Feature Coming Soon...</p>
                        <div v-if="server.security" class="grid-cols-3 gap-4 mt-6">
                            <!-- Count of security alerts -->
                            <div class="flex items center justify-between mt-4 px-6">
                                <span class="text-sm text-gray-500">Total Security Alerts</span>
                                <span class="text-lg font-semibold">{{ server.security.total }}</span>
                            </div>
                            <div class="flex items center justify-between mt-4 px-6">
                                <span class="text-sm text-gray-500">Critical Severity</span>
                                <span class="text-lg font-semibold">{{ server.security.critical }}</span>
                            </div>
                            <div class="flex items center justify-between mt-4 px-6">
                                <span class="text-sm text-gray-500">High Severity</span>
                                <span class="text-lg font-semibold">{{ server.security.high }}</span>
                            </div>
                            <div class="flex items center justify-between mt-4 px-6">
                                <span class="text-sm text-gray-500">Medium Severity</span>
                                <span class="text-lg font-semibold">{{ server.security.medium }}</span>
                            </div>
                            <div class="flex items center justify-between mt-4 px-6">
                                <span class="text-sm text-gray-500">Other Severity</span>
                                <span class="text-lg font-semibold">{{ server.security.other }}</span>
                            </div>

                            <hr class="mt-4 mb-2" />

                            <div class="flex items center justify-between mt-4 px-6">
                                <span class="text-sm text-gray-500">Total Advisories</span>
                                <span class="text-lg font-semibold">{{ server.security.advisories }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
