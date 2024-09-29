<script setup lang="ts">
import { onMounted } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiPencil, mdiServer, mdiSecurity, mdiAccountGroup } from "@mdi/js";

import Title from "@/components/Title.vue";
import Loading from "@/components/Loading.vue";
import AdminSetting from "@/components/AdminSetting.vue";
import AdminSettingMenu from "@/components/AdminSettingMenu.vue";
import AdminSettingButton from "@/components/AdminSettingButton.vue";

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
        <div class="container mt-4 mb-6 w-full mx-auto">
            <Title title="Admin Agent Panel" description="Konarr Admin Setting for Agents" />

            <div class="grid grid-cols-6 gap-2 w-full mx-auto">
                <AdminSettingMenu current="general" :icon="mdiServer" />

                <div v-if="!admin.loading" class="col-span-4 bg-white shadow-md rounded-lg p-4">
                    <AdminSetting title="Agent Active" :data="admin.settings.agent" setting="agent" toggle />

                    <hr class="my-6 border-gray-300" />

                    <AdminSetting v-if="admin.settings.agent === 'enabled'" title="Agent Share Key"
                        :data="admin.settings['agent.key']" setting="agent.key" hidedata />
                </div>
                <Loading v-else />
            </div>
        </div>
    </main>
</template>
