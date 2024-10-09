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
            <Title title="Admin Panel" description="Konarr Admin Setting and Information Panel" />

            <div class="grid grid-cols-6 gap-2 w-full mx-auto">
                <AdminSettingMenu current="general" :icon="mdiServer" />

                <div v-if="!admin.loading"
                    class="col-span-4 bg-white dark:bg-gray-700 dark:text-white shadow-md rounded-lg p-4 pt-6">
                    <h3 class="text-lg font-semibold my-4 text-center">
                        Project Summary Information
                    </h3>
                    <div class="grid grid-cols-3 text-center">
                        <div class="">
                            <span>Total</span>
                        </div>
                        <div class="">
                            <span>Active</span>
                        </div>
                        <div class="">
                            <span>Archived</span>
                        </div>
                        <div class="">
                            <strong>{{ admin.projectStats.total || 0 }}</strong>
                        </div>
                        <div class="">
                            <strong>{{ admin.projectStats.active || 0 }}</strong>
                        </div>
                        <div class="">
                            <strong>{{ admin.projectStats.archived || 0 }}</strong>
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
