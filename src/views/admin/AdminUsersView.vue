<script setup lang="ts">
import { onMounted } from "vue";
import { mdiServer } from "@mdi/js";

import Title from "@/components/Title.vue";
import Loading from "@/components/Loading.vue";
import AdminSettingMenu from "@/components/AdminSettingMenu.vue";
import AdminSetting from "@/components/AdminSetting.vue";
import Search from "@/components/Search.vue";
import Pagination from "@/components/Pagination.vue";

import { useAdminStore } from "@/stores/admin";

const admin = useAdminStore();

const updateState = (event: Event, id: number) => {
  let state = (event.target as HTMLSelectElement).value;
  console.log(state, id);
  admin.updateUser(id, undefined, state);
};
const updateRole = (event: Event, id: number) => {
  let role = (event.target as HTMLSelectElement).value;
  admin.updateUser(id, role);
};

// search is handled by the Search component which calls admin.getUsers

const nextPage = () => {
  if ((admin.page || 0) < (admin.pages || 0)) {
    admin.getUsers({
      page: (admin.page || 0) + 1,
      limit: admin.limit || 24,
    });
  }
};

const prevPage = () => {
  if ((admin.page || 0) > 0) {
    admin.getUsers({
      page: (admin.page || 0) - 1,
      limit: admin.limit || 24,
    });
  }
};

onMounted(() => {
  admin.fetchInfo();
  admin.getUsers({ page: 0, limit: 10 });
});
</script>

<template>
  <main>
    <div class="container mt-4 mb-6 w-full mx-auto px-2">
      <Title
        title="Admin Users Panel"
        description="Konarr Admin Settings for Users"
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

          <div class="mb-4">
            <h3 class="text-lg font-semibold my-4 text-center">
              Session Timeouts
            </h3>
            <div class="space-y-2">
              <AdminSetting
                title="Admin Sessions"
                description="Session expiration for admin users"
                :select="[
                  { value: '1', label: '1 hour' },
                  { value: '8', label: '8 hours' },
                  { value: '24', label: '24 hours' },
                  { value: '720', label: '30 days' },
                  { value: '2160', label: '90 days' },
                ]"
                :data="admin.settings['sessions.admins.expires']"
                setting="sessions.admins.expires"
              />

              <AdminSetting
                title="User Sessions"
                description="Session expiration for normal users"
                :select="[
                  { value: '1', label: '1 hour' },
                  { value: '8', label: '8 hours' },
                  { value: '24', label: '24 hours' },
                  { value: '720', label: '30 days' },
                  { value: '2160', label: '90 days' },
                ]"
                :data="admin.settings['sessions.users.expires']"
                setting="sessions.users.expires"
              />
            </div>
          </div>

          <hr class="my-6 border-gray-300" />

          <h4 class="text-lg font-semibold ml-4 text-center">System Users</h4>

          <Search
            searching="users"
            :placeholder="'Search users by username'"
            :limit="admin.limit || 24"
            :count="admin.userStats.active"
            :total="admin.userStats.total"
          />

          <table class="min-w-full table-auto mt-4">
            <thead>
              <tr
                class="bg-gray-200 dark:bg-accent-500 text-gray-600 dark:text-black text-sm leading-normal"
              >
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
                  <select
                    v-if="user.id !== 1"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    @change="updateState($event, user.id)"
                  >
                    >
                    <option value="active" :selected="user.state === 'Active'">
                      Active
                    </option>
                    <option
                      value="disabled"
                      :selected="user.state === 'Disabled'"
                    >
                      Disabled
                    </option>
                  </select>
                  <span
                    v-else
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    Active
                  </span>
                </td>
                <td class="py-3 px-6 text-left hidden sm:block">
                  <select
                    v-if="user.id !== 1"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    @change="updateRole($event, user.id)"
                  >
                    >
                    <option value="admin" :selected="user.role === 'Admin'">
                      Admin
                    </option>
                    <option value="user" :selected="user.role === 'User'">
                      User
                    </option>
                  </select>
                  <span
                    v-else
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    Admin
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <Pagination
            :page="admin.page || 0"
            :pages="admin.pages || 0"
            :prev="prevPage"
            :next="nextPage"
          />
        </div>
        <Loading v-else />
      </div>
    </div>
  </main>
</template>
