<script setup lang="ts">
import { onMounted } from "vue";
import { mdiServer } from "@mdi/js";

import Title from "@/components/Title.vue";
import Loading from "@/components/Loading.vue";
import AdminSetting from "@/components/AdminSetting.vue";
import AdminSettingMenu from "@/components/AdminSettingMenu.vue";

import { useAdminStore } from "@/stores/admin";

const admin = useAdminStore();

onMounted(() => {
  admin.fetchInfo();
});

const tools = [
  { value: "syft", label: "Syft (default)" },
  { value: "grype", label: "Grype" },
  { value: "trivy", label: "Trivy" },
];
</script>

<template>
  <main>
    <div class="container mt-4 mb-12 w-full mx-auto px-2">
      <Title
        title="Admin Security Panel"
        description="Manage security alerts and scanning tools"
      />

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full mx-auto">
        <AdminSettingMenu
          current="security"
          :icon="mdiServer"
          class="lg:col-span-1"
        />

        <div class="lg:col-span-3">
          <Loading v-if="admin.loading" />
          <div v-else class="space-y-6">
            <!-- Security Feature Section -->
            <div
              class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border-l-4 border-red-500"
            >
              <h2
                class="text-xl font-semibold mb-4 text-gray-900 dark:text-white"
              >
                Security Feature
              </h2>
              <AdminSetting
                title="Enable Security"
                info="Enable the security feature inside Konarr. This includes automatically discovering security alerts, update advisory database, etc."
                :data="admin.settings.security"
                setting="security"
                toggle
              />
            </div>

            <!-- Security Tools Section -->
            <div
              class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border-l-4 border-purple-500"
            >
              <h2
                class="text-xl font-semibold mb-4 text-gray-900 dark:text-white"
              >
                Security Tools
              </h2>
              <div class="space-y-4">
                <AdminSetting
                  title="SBOM / Security Tool"
                  description="Select the tool to use for SBOM generating and/or security scanning."
                  :data="admin.settings['security.tools.name']"
                  setting="security.tools.name"
                  :select_current="admin.settings['security.tools.name']"
                  :select="tools"
                />

                <AdminSetting
                  title="Tool Auto-Install"
                  description="Enable to automatically install the selected security tool on the agent."
                  :data="admin.settings['agent.tool.auto-install']"
                  setting="agent.tool.auto-install"
                  toggle
                />

                <AdminSetting
                  title="Tool Auto-Update"
                  description="Enable to automatically update the selected security tool on the agent."
                  :data="admin.settings['agent.tool.auto-update']"
                  setting="agent.tool.auto-update"
                  toggle
                />

                <AdminSetting
                  title="Allow Tool Alerts"
                  description="Enable to receive alerts from security tools. This includes alerts from tools like Trivy, Grype, and other security scanners."
                  :data="admin.settings['security.tools.alerts']"
                  setting="security.tools.alerts"
                  toggle
                />
              </div>
            </div>

            <!-- Advisory Database Section -->
            <div
              v-if="admin.settings.security === 'enabled'"
              class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border-l-4 border-orange-500"
            >
              <h2
                class="text-xl font-semibold mb-4 text-gray-900 dark:text-white"
              >
                Advisory Database
              </h2>
              <div class="space-y-4">
                <AdminSetting
                  title="Security Advisory Database"
                  description="Enable to access the security advisory database. The current advisory database is stored locally and can be updated periodically."
                  :data="admin.settings['security.advisories']"
                  setting="security.advisories"
                  toggle
                />

                <div
                  v-if="admin.settings['security.advisories'] == 'enabled'"
                  class="ml-4 space-y-4 border-l-2 border-gray-300 dark:border-gray-600 pl-4"
                >
                  <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
                    <AdminSetting
                      title="Current Version"
                      :data="admin.settings['security.advisories.version']"
                      setting="security.advisories.version"
                    />

                    <AdminSetting
                      title="Last Checked / Updated"
                      :data="admin.settings['security.advisories.updated']"
                      setting="security.advisories.updated"
                    />
                  </div>

                  <AdminSetting
                    title="Automatic Polling"
                    info="Allow automatically polling of the advisory database. This will access the internet to download the latest database."
                    description="Enable to automatically poll the advisory database for new alerts. This will access the internet to download the latest security alerts."
                    :data="admin.settings['security.advisories.polling']"
                    setting="security.advisories.polling"
                    toggle
                  />

                  <AdminSetting
                    v-if="
                      admin.settings['security.advisories.polling'] ==
                      'disabled'
                    "
                    title="Manually Pull Database"
                    description="Manually trigger a pull of the advisory database."
                    :data="admin.settings['security.advisories.pull']"
                    setting="security.advisories.pull"
                    button
                  />

                  <AdminSetting
                    title="Rescan all Projects"
                    description="Rescan all projects for security vulnerabilities. This might take some time. If you have `Allow Tool Alerts` enabled, it won't run on those projects that have alerts from the tools."
                    :data="admin.settings['security.rescan']"
                    setting="security.rescan"
                    button
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
