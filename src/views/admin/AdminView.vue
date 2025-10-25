<script setup lang="ts">
import { onMounted } from "vue";
import { mdiServer } from "@mdi/js";

import Title from "@/components/Title.vue";
import Loading from "@/components/Loading.vue";
import AdminSetting from "@/components/AdminSetting.vue";
import AdminSettingMenu from "@/components/AdminSettingMenu.vue";

import { useServerStore } from "@/stores/server";
import { useAdminStore } from "@/stores/admin";

const server = useServerStore();
const admin = useAdminStore();

onMounted(() => {
  admin.fetchInfo();
});
</script>

<template>
  <main>
    <div class="container mt-4 mb-12 w-full mx-auto px-2">
      <Title
        title="Admin Panel"
        description="Manage server settings and configuration"
      />

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full mx-auto">
        <AdminSettingMenu
          current="general"
          :icon="mdiServer"
          class="lg:col-span-1"
        />

        <div class="lg:col-span-3">
          <Loading v-if="admin.loading" />
          <div v-else class="space-y-6">
            <!-- User Registration Section -->
            <div
              class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border-l-4 border-accent-500"
            >
              <h2
                class="text-xl font-semibold mb-4 text-gray-900 dark:text-white"
              >
                User Registration
              </h2>
              <AdminSetting
                title="Registration Active"
                description="Allow users to register for an account. When disabled, no new users can register."
                :data="admin.registration"
                setting="registration"
                toggle
              />
            </div>

            <!-- Server Configuration Section -->
            <div
              class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border-l-4 border-blue-500"
            >
              <h2
                class="text-xl font-semibold mb-4 text-gray-900 dark:text-white"
              >
                Server Configuration
              </h2>
              <div class="space-y-4">
                <AdminSetting
                  title="Server URL"
                  description="Base URL that the frontend uses to contact the server"
                  :data="admin.settings['server.url']"
                  setting="server.url"
                  editable
                />

                <AdminSetting
                  title="Server Data Path"
                  description="Directory where server stores data"
                  :data="admin.settings['server.data']"
                />

                <AdminSetting
                  title="Server Frontend Path"
                  description="Directory containing the frontend build"
                  :data="admin.settings['server.frontend.path']"
                />
              </div>
            </div>

            <!-- Server Information Section -->
            <div
              class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border-l-4 border-green-500"
            >
              <h2
                class="text-xl font-semibold mb-4 text-gray-900 dark:text-white"
              >
                Server Information
              </h2>
              <div class="space-y-4">
                <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
                  <AdminSetting title="Server Version" :data="server.version" />
                  <AdminSetting title="Server Commit" :data="server.commit" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
