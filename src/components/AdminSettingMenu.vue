<script setup lang="ts">
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiServer, mdiAccountMultiple, mdiRobotLoveOutline, mdiSecurity, mdiAccountGroup } from "@mdi/js";
import AdminSettingButton from "@/components/AdminSettingButton.vue";

const props = defineProps<{
    current: string
}>();
</script>

<template>
    <div class="col-span-2 bg-white dark:bg-gray-700 shadow-md rounded-lg p-4">
        <div class="flex flex-col items-center">
            <h3 class="dark:text-gray-200 text-lg font-semibold">Server Settings</h3>

            <div class="flex flex-col w-full mt-4">
                <AdminSettingButton title="General" link="Admin" :icon="mdiServer" />
                <AdminSettingButton title="Users" link="Admin Users" :icon="mdiAccountGroup" />
                <AdminSettingButton title="Agents" link="Admin Agents" :icon="mdiRobotLoveOutline" />
            </div>
        </div>
    </div>
</template>
