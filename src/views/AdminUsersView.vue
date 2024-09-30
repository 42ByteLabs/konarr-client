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
            <Title title="Admin Users Panel" description="Konarr Admin Settings for Users" />

            <div class="grid grid-cols-6 gap-2 w-full mx-auto">
                <AdminSettingMenu current="general" :icon="mdiServer" />

                <div v-if="!admin.loading" class="col-span-4 bg-white shadow-md rounded-lg p-4">
                    <AdminSetting title="Registration Active" :data="admin.settings.registration" setting="registration"
                        toggle />

                    <hr class="my-6 border-gray-300" />

                    <h3 class="text-lg font-semibold my-4 text-center">
                        User Summary Information
                    </h3>
                    <div class="grid grid-cols-3 text-center">
                        <div class="">
                            <span>Total</span>
                        </div>
                        <div class="">
                            <span>Active</span>
                        </div>
                        <div class="">
                            <span>Inactive</span>
                        </div>
                        <div class="">
                            <strong>{{ admin.userStats.total }}</strong>
                        </div>
                        <div class="">
                            <strong>{{ admin.userStats.active }}</strong>
                        </div>
                        <div class="">
                            <strong>{{ admin.userStats.inactive }}</strong>
                        </div>
                    </div>


                    <hr class="my-6 border-gray-300" />

                    <h4 class="text-lg font-semibold ml-4 text-center">
                        System Users
                    </h4>

                    <table class="min-w-full table-auto mt-4">
                        <thead>
                            <tr class="bg-gray-200 text-gray-600 text-sm leading-normal">
                                <th class="py-3 px-6 text-left">Username</th>
                                <th class="py-3 px-6 text-left">Status</th>
                                <th class="py-3 px-6 text-left">Role</th>
                                <th class="py-3 px-6 text-center">Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="user in admin.users" :key="user.id">
                                <td class="py-3 px-6 text-left whitespace-nowrap">
                                    {{ user.username }}
                                </td>
                                <td class="py-3 px-6 text-left">
                                    {{ user.state }}
                                </td>
                                <td class="py-3 px-6 text-left">
                                    {{ user.role }}
                                </td>
                                <td class="py-3 px-6 text-center">
                                    {{ user.created_at }}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>
                <Loading v-else />
            </div>
        </div>
    </main>
</template>
