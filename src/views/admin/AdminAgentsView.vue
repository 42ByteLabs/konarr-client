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
    <div class="container mt-4 mb-6 w-full mx-auto px-2">
      <Title
        title="Admin Agent Panel"
        description="Konarr Admin Setting for Agents"
      />

      <div class="grid grid-cols-6 gap-2 w-full mx-auto">
        <AdminSettingMenu
          current="agents"
          :icon="mdiServer"
          class="col-span-6 md:col-span-2"
        />

        <div
          v-if="!admin.loading"
          class="col-span-6 md:col-span-4 bg-white dark:bg-gray-800 dark:text-white shadow-md rounded-lg p-4 pt-6"
        >
          <AdminSetting
            title="Agent Active"
            :data="admin.settings.agent"
            setting="agent"
            toggle
          />

          <hr class="my-6 border-gray-300" />

          <AdminSetting
            v-if="admin.settings.agent === 'enabled'"
            title="Agent Share Key"
            description="Shared secret key for agent communication"
            :data="admin.settings['agent.key']"
            setting="agent.key"
            hidedata
          />
        </div>
        <Loading v-else />
      </div>
    </div>
  </main>
</template>
