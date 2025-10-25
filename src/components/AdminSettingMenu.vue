<script setup lang="ts">
import {
  mdiServer,
  mdiAccountGroup,
  mdiSecurity,
  mdiRobotLoveOutline,
} from "@mdi/js";
import AdminSettingButton from "@/components/AdminSettingButton.vue";
</script>

<template>
  <div
    class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border-l-4 border-accent-500"
  >
    <div class="flex flex-col">
      <h3
        class="text-xl font-semibold mb-4 text-gray-900 dark:text-white text-center"
      >
        Settings
      </h3>

      <nav class="space-y-2">
        <AdminSettingButton title="General" link="Admin" :icon="mdiServer" />
        <AdminSettingButton
          title="Users"
          link="Admin Users"
          :icon="mdiAccountGroup"
        />
        <AdminSettingButton
          title="Security"
          link="Admin Security"
          :icon="mdiSecurity"
        />
        <AdminSettingButton
          title="Agents"
          link="Admin Agents"
          :icon="mdiRobotLoveOutline"
        />
      </nav>
    </div>
  </div>
</template>
