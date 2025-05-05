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


const updateState = (event, id) => {
    let state = event.target.value;
    console.log(state, id);
    admin.updateUser(id, null, state);
};
const updateRole = (event, id) => {
    let role = event.target.value;
    admin.updateUser(id, role);
};

onMounted(() => {
    admin.fetchInfo();
});

</script>

<template>
    <main>
        <div class="container mt-4 mb-6 w-full mx-auto px-2">
            <Title title="Admin Users Panel" description="Konarr Admin Settings for Users" />

            <div class="grid grid-cols-6 gap-2 w-full mx-auto">
                <AdminSettingMenu current="general" :icon="mdiServer" class="col-span-6 md:col-span-2" />

                <div v-if="!admin.loading"
                    class="col-span-6 md:col-span-4 bg-white dark:bg-gray-800 dark:text-white shadow-md rounded-lg p-4 pt-6">
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
                            <tr
                                class="bg-gray-200 dark:bg-accent-500 text-gray-600 dark:text-black text-sm leading-normal">
                                <th class="py-3 px-6 text-left">ID</th>
                                <th class="py-3 px-6 text-left">Username</th>
                                <th class="py-3 px-6 text-left">Status</th>
                                <th class="py-3 px-6 text-left hidden sm:block">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="user in admin.users" :key="user.id">
                                <td class="py-3 px-6 text-left whitespace-nowrap">
                                    {{ user.id }}
                                </td>
                                <td class="py-3 px-6 text-left whitespace-nowrap">
                                    {{ user.username }}
                                </td>
                                <td class="py-3 px-6 text-left">
                                    <select v-if="user.id !== 1" @change="updateState($event, user.id)"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option value="active" :selected="user.state === 'Active'">
                                            Active
                                        </option>
                                        <option value="disabled" :selected="user.state === 'Disabled'">
                                            Disabled
                                        </option>
                                    </select>
                                    <span v-else
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        Active
                                    </span>
                                </td>
                                <td class="py-3 px-6 text-left hidden sm:block">
                                    <select v-if="user.id !== 1" @change="updateRole($event, user.id)"
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option value="admin" :selected="user.role === 'Admin'">
                                            Admin
                                        </option>
                                        <option value="user" :selected="user.role === 'User'">
                                            User
                                        </option>
                                    </select>
                                    <span v-else
                                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        Admin
                                    </span>
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
