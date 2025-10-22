<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useServerStore } from "@/stores/server";
import { useUsersStore } from "@/stores/users";
import { notify } from "@kyvg/vue3-notification";
import Title from "@/components/Title.vue";
import Loading from "@/components/Loading.vue";
import PasswordStrengthMeter from "@/components/PasswordStrengthMeter.vue";

const server = useServerStore();
const users = useUsersStore();
const loading = ref(false);

// Profile fields
const username = ref("");
const role = ref("");
const userId = ref(0);

// Password update fields
const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

onMounted(async () => {
  if (server.user) {
    username.value = server.user.username;
    role.value = server.user.role;
    userId.value = server.user.id;
  }
  loading.value = false;

  // Load sessions
  await users.listSessions();
});

async function updatePassword() {
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    notify({
      group: "app",
      type: "error",
      title: "Validation Error",
      text: "All password fields are required",
    });
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    notify({
      group: "app",
      type: "error",
      title: "Validation Error",
      text: "New passwords do not match",
    });
    return;
  }

  if (newPassword.value.length < 8) {
    notify({
      group: "app",
      type: "error",
      title: "Validation Error",
      text: "Password must be at least 8 characters long",
    });
    return;
  }

  const result = await users.changePassword(
    currentPassword.value,
    newPassword.value,
    confirmPassword.value,
  );

  if (result) {
    notify({
      group: "app",
      type: "success",
      title: "Password Updated",
      text: "Your password has been updated successfully",
    });

    // Clear password fields
    currentPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
  }
}

async function revokeSession(sessionId: number) {
  if (confirm("Are you sure you want to revoke this session?")) {
    const result = await users.revokeSession(sessionId);
    if (result) {
      notify({
        group: "app",
        type: "success",
        title: "Session Revoked",
        text: "The session has been revoked successfully",
      });
    }
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString();
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <Title title="User Profile" />

      <Loading v-if="loading" />

      <div v-else class="space-y-8">
        <!-- Profile Information Card -->
        <div
          class="bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden"
        >
          <div class="px-4 py-5 sm:p-6">
            <h3
              class="text-lg font-medium leading-6 text-gray-900 dark:text-white"
            >
              Profile Information
            </h3>
            <div class="mt-6 space-y-6">
              <!-- Username -->
              <div>
                <label
                  for="username"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Username
                </label>
                <input
                  id="username"
                  v-model="username"
                  type="text"
                  disabled
                  class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm dark:bg-gray-600 dark:border-gray-600 dark:text-gray-400 sm:text-sm px-3 py-2"
                />
              </div>

              <!-- Role -->
              <div>
                <label
                  for="role"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Role
                </label>
                <input
                  id="role"
                  v-model="role"
                  type="text"
                  disabled
                  class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm dark:bg-gray-600 dark:border-gray-600 dark:text-gray-400 sm:text-sm px-3 py-2"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Password Update Card -->
        <div
          class="bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden"
        >
          <div class="px-4 py-5 sm:p-6">
            <h3
              class="text-lg font-medium leading-6 text-gray-900 dark:text-white"
            >
              Change Password
            </h3>
            <div class="mt-6 space-y-6">
              <!-- Current Password -->
              <div>
                <label
                  for="current-password"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Current Password
                </label>
                <input
                  id="current-password"
                  v-model="currentPassword"
                  type="password"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm px-3 py-2"
                  placeholder="Enter current password"
                />
              </div>

              <!-- New Password -->
              <div>
                <label
                  for="new-password"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  New Password
                </label>
                <input
                  id="new-password"
                  v-model="newPassword"
                  type="password"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm px-3 py-2"
                  placeholder="Enter new password"
                />
                <PasswordStrengthMeter :password="newPassword" />
              </div>

              <!-- Confirm New Password -->
              <div>
                <label
                  for="confirm-password"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirm-password"
                  v-model="confirmPassword"
                  type="password"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm px-3 py-2"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div class="mt-6">
              <button
                type="button"
                :disabled="users.changingPassword"
                class="inline-flex justify-center rounded-md border border-transparent bg-accent-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                @click="updatePassword"
              >
                {{ users.changingPassword ? "Updating..." : "Update Password" }}
              </button>
            </div>
          </div>
        </div>

        <!-- Active Sessions Card -->
        <div
          class="bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden"
        >
          <div class="px-4 py-5 sm:p-6">
            <h3
              class="text-lg font-medium leading-6 text-gray-900 dark:text-white"
            >
              Active Sessions
            </h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Manage your active sessions. Revoking a session will log out that
              device.
            </p>

            <Loading v-if="users.loading" />

            <div v-else-if="users.sessions.length === 0" class="mt-6">
              <p class="text-sm text-gray-500 dark:text-gray-400">
                No active sessions found.
              </p>
            </div>

            <div v-else class="mt-6 space-y-4">
              <div
                v-for="session in users.sessions"
                :key="session.id"
                class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div class="flex-1">
                  <div class="flex items-center">
                    <div
                      class="flex-shrink-0 h-2 w-2 rounded-full"
                      :class="
                        session.state === 'active'
                          ? 'bg-green-500'
                          : 'bg-gray-400'
                      "
                    ></div>
                    <p
                      class="ml-3 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Session #{{ session.id }}
                    </p>
                  </div>
                  <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <p>Created: {{ formatDate(session.createdAt) }}</p>
                    <p>Last accessed: {{ formatDate(session.lastAccessed) }}</p>
                  </div>
                </div>
                <button
                  type="button"
                  class="ml-4 inline-flex items-center px-3 py-2 border border-red-300 dark:border-red-700 rounded-md text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  @click="revokeSession(session.id)"
                >
                  Revoke
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
