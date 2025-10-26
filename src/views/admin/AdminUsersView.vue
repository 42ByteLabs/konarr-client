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
  if ((admin.usersPage || 0) < (admin.users.pages || 0)) {
    admin.getUsers({
      page: (admin.usersPage || 0) + 1,
      limit: admin.usersLimit || 24,
    });
  }
};

const prevPage = () => {
  if ((admin.usersPage || 0) > 0) {
    admin.getUsers({
      page: (admin.usersPage || 0) - 1,
      limit: admin.usersLimit || 24,
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
    <div class="container mt-4 mb-12 w-full mx-auto px-2">
      <Title
        title="Admin Users Panel"
        description="Manage users and session settings"
      />

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full mx-auto">
        <AdminSettingMenu
          current="general"
          :icon="mdiServer"
          class="lg:col-span-1"
        />

        <div class="lg:col-span-3">
          <Loading v-if="admin.loading" />
          <div v-else class="space-y-6">
            <!-- User Statistics Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border-l-4 border-blue-500"
              >
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Users
                </p>
                <p
                  class="text-3xl font-bold text-gray-900 dark:text-white mt-2"
                >
                  {{ admin.adminSettings.userStats.total }}
                </p>
              </div>
              <div
                class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border-l-4 border-green-500"
              >
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Users
                </p>
                <p
                  class="text-3xl font-bold text-gray-900 dark:text-white mt-2"
                >
                  {{ admin.adminSettings.userStats.active }}
                </p>
              </div>
              <div
                class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border-l-4 border-gray-500"
              >
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Inactive Users
                </p>
                <p
                  class="text-3xl font-bold text-gray-900 dark:text-white mt-2"
                >
                  {{ admin.adminSettings.userStats.inactive }}
                </p>
              </div>
            </div>

            <!-- Session Timeouts Section -->
            <div
              class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border-l-4 border-accent-500"
            >
              <h2
                class="text-xl font-semibold mb-4 text-gray-900 dark:text-white"
              >
                Session Timeouts
              </h2>
              <div class="space-y-4">
                <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
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
            </div>

            <!-- System Users Section -->
            <div
              class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border-l-4 border-purple-500"
            >
              <h2
                class="text-xl font-semibold mb-4 text-gray-900 dark:text-white"
              >
                System Users
              </h2>

              <Search
                searching="users"
                :placeholder="'Search users by username'"
                :limit="admin.usersLimit || 24"
                :count="admin.adminSettings.userStats.active"
                :total="admin.adminSettings.userStats.total"
              />

              <div class="mt-4 overflow-x-auto">
                <table class="min-w-full table-auto">
                  <thead>
                    <tr
                      class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm leading-normal"
                    >
                      <th class="py-3 px-6 text-left font-semibold">ID</th>
                      <th class="py-3 px-6 text-left font-semibold">
                        Username
                      </th>
                      <th class="py-3 px-6 text-left font-semibold">Status</th>
                      <th
                        class="py-3 px-6 text-left font-semibold hidden sm:table-cell"
                      >
                        Role
                      </th>
                    </tr>
                  </thead>
                  <tbody class="text-gray-600 dark:text-gray-400 text-sm">
                    <tr
                      v-for="user in admin.users.data ||
                      admin.adminSettings.users"
                      :key="user.id"
                      class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td class="py-3 px-6 text-left whitespace-nowrap">
                        <span
                          class="font-medium text-gray-900 dark:text-white"
                          >{{ user.id }}</span
                        >
                      </td>
                      <td class="py-3 px-6 text-left whitespace-nowrap">
                        <span
                          class="font-medium text-gray-900 dark:text-white"
                          >{{ user.username }}</span
                        >
                      </td>
                      <td class="py-3 px-6 text-left">
                        <select
                          v-if="user.id !== 1"
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-accent-500 focus:border-accent-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-accent-500 dark:focus:border-accent-500"
                          @change="updateState($event, user.id)"
                        >
                          >
                          <option
                            value="active"
                            :selected="user.state === 'Active'"
                          >
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
                          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300"
                        >
                          Active
                        </span>
                      </td>
                      <td class="py-3 px-6 text-left hidden sm:table-cell">
                        <select
                          v-if="user.id !== 1"
                          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-accent-500 focus:border-accent-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-accent-500 dark:focus:border-accent-500"
                          @change="updateRole($event, user.id)"
                        >
                          >
                          <option
                            value="admin"
                            :selected="user.role === 'Admin'"
                          >
                            Admin
                          </option>
                          <option value="user" :selected="user.role === 'User'">
                            User
                          </option>
                        </select>
                        <span
                          v-else
                          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300"
                        >
                          Admin
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <Pagination
                :page="admin.usersPage || 0"
                :pages="admin.users.pages || 0"
                :prev="prevPage"
                :next="nextPage"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
