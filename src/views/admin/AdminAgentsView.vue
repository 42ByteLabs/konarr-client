<script setup lang="ts">
import { onMounted } from "vue";
import { mdiServer } from "@mdi/js";

import Title from "@/components/Title.vue";
import Loading from "@/components/Loading.vue";
import AdminSetting from "@/components/AdminSetting.vue";
import AdminSettingMenu from "@/components/AdminSettingMenu.vue";

import { useAdminStore } from "@/stores/admin";

const admin = useAdminStore();

onMounted(() => {
  admin.fetchInfo();
});
</script>

<template>
  <main>
    <div class="container mt-4 mb-12 w-full mx-auto px-2">
      <Title
        title="Admin Agent Panel"
        description="Configure agent communication and security"
      />

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full mx-auto">
        <AdminSettingMenu
          current="agents"
          :icon="mdiServer"
          class="lg:col-span-1"
        />

        <div class="lg:col-span-3">
          <Loading v-if="admin.loading" />
          <div v-else class="space-y-6">
            <!-- Agent Configuration Section -->
            <div
              class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border-l-4 border-blue-500"
            >
              <h2
                class="text-xl font-semibold mb-4 text-gray-900 dark:text-white"
              >
                Agent Configuration
              </h2>
              <div class="space-y-4">
                <AdminSetting
                  title="Agent Active"
                  description="Enable or disable agent communication"
                  :data="admin.settings.agent"
                  setting="agent"
                  toggle
                />

                <AdminSetting
                  v-if="admin.settings.agent === 'enabled'"
                  title="Agent Share Key"
                  description="Shared secret key for agent communication"
                  :data="admin.settings['agent.key']"
                  setting="agent.key"
                  hidedata
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
