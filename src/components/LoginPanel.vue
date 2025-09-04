<script setup lang="ts">
import { ref } from "vue";
import { router } from "@/router";
import Title from "@/components/Title.vue";
import { useServerStore } from "@/stores/server";

const server = useServerStore();

// Redirect to home if user is already logged in
if (server.user) {
    router.push({ name: "home" });
}

const username = ref("");
const password = ref("");

// Login method
const login = async () => {
    await server.login(username.value, password.value);
};
</script>

<template>
    <div class="max-w-md mx-auto">
        <form>
            <div class="mb-4">
                <label for="username" class="block text-gray-700 dark:text-white text-sm font-bold mb-2">
                    Username
                </label>
                <input type="text" id="username" name="username" v-model="username"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <div class="mb-6">
                <label for="password" class="block text-gray-700 dark:text-white text-sm font-bold mb-2">
                    Password
                </label>
                <input type="password" id="password" name="password" v-model="password"
                    class="shadow appearance-none border border-accent-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
            <!-- Make center -->
            <div class="flex items-center justify-between">
                <button
                    class="bg-accent-500 hover:bg-accent-600 text-white font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline"
                    type="button" @click="login">
                    Sign In
                </button>
            </div>
        </form>
    </div>
</template>
