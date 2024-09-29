<script setup lang="ts">
import Title from "@/components/Title.vue";
import Loading from "@/components/Loading.vue";
import RegisterPanel from "@/components/RegisterPanel.vue";
import { useServerStore } from "@/stores/server";

const server = useServerStore();

</script>

<template>
    <main>
        <div class="container mt-4 mb-6 w-full mx-auto">
            <Title title="Registration" subtitle="Register a new user here!" />

            <Loading v-if="server.logging_in" />

            <div v-if="server.config.initialised">
                <h3 class="text-center text-2xl font-semibold text-gray-700 mb-4">
                    Setting up the server for the first time...
                </h3>
                <p class="text-center text-gray-600">
                    You will be registered as an administrator user.
                </p>
            </div>

            <RegisterPanel />
        </div>
    </main>
</template>
