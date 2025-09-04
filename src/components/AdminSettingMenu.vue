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
  <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
    <div class="flex flex-col items-center">
      <h3 class="dark:text-gray-200 text-lg font-semibold">Server Settings</h3>

      <div class="flex flex-col w-full mt-4">
        <AdminSettingButton title="General" link="Admin" :icon="mdiServer" />
        <AdminSettingButton
          title="Users"
          link="Admin Users"
          :icon="mdiAccountGroup"
        />
        <AdminSettingButton
          title="Security Alerts & Tools"
          link="Admin Security"
          :icon="mdiSecurity"
        />
        <AdminSettingButton
          title="Agents"
          link="Admin Agents"
          :icon="mdiRobotLoveOutline"
        />
      </div>
    </div>
  </div>
</template>
