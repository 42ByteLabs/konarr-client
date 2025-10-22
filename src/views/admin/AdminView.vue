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
    <div class="container mt-4 mb-6 w-full mx-auto px-2">
      <Title
        title="Admin Panel"
        description="Konarr Admin Setting and Information Panel"
      />

      <div class="grid grid-cols-6 gap-2 w-full mx-auto">
        <AdminSettingMenu
          current="general"
          :icon="mdiServer"
          class="col-span-6 md:col-span-2"
        />

        <div
          v-if="!admin.loading"
          class="col-span-6 md:col-span-4 bg-white dark:bg-gray-800 dark:text-white shadow-md rounded-lg p-4 pt-6"
        >
          <AdminSetting
            title="Registration Active"
            description="Allow users to register for an account. When disabled, no new users can register."
            :data="admin.settings.registration"
            setting="registration"
            toggle
          />

          <div class="my-6">
            <h3 class="text-lg font-semibold my-4 text-center">
              Server Configuration
            </h3>
            <div class="space-y-2">
              <AdminSetting
                title="Server URL"
                description="Select the base URL that the frontend should use to contact the server."
                :data="admin.settings['server.url']"
                setting="server.url"
                editable
              />

              <AdminSetting
                title="Server Data Path"
                description="Readonly path where server stores data"
                :data="admin.settings['server.data']"
              />

              <AdminSetting
                title="Server Frontend Path"
                description="Readonly path to the frontend build on the server"
                :data="admin.settings['server.frontend.path']"
              />
            </div>
          </div>

          <hr class="my-6 border-gray-300" />

          <AdminSetting title="Server Version" :data="server.version" />
          <AdminSetting title="Server Commit" :data="server.commit" />
        </div>
        <Loading v-else />
      </div>
    </div>
  </main>
</template>
