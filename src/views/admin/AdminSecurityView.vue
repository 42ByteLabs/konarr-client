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
            <Title title="Admin Security Panel" description="Konarr Admin Setting for Security Alerts" />

            <div class="grid grid-cols-6 gap-2 w-full mx-auto">
                <AdminSettingMenu current="general" :icon="mdiServer" />

                <div v-if="!admin.loading"
                    class="col-span-4 bg-white dark:bg-gray-700 dark:text-white shadow-md rounded-lg p-4 pt-6">

                    <AdminSetting title="Enable Security"
                        info="Enable the security feature inside Konarr. This includes automatically discovering security alerts, update advisory database, etc."
                        :data="admin.settings.security" setting="security" toggle />

                    <div v-if="admin.settings.security === 'enabled'">
                        <hr class="my-6 border-gray-300" />

                        <h2 class="text-xl text-center font-semibold mb-2">
                            Advisory Database
                        </h2>

                        <AdminSetting title="Security Advisory Database"
                            description="Enable to access the security advisory database. The current advisory database is stored locally and can be updated periodically."
                            :data="admin.settings['security.advisories']" setting="security.advisories" toggle />

                        <div v-if="admin.settings['security.advisories'] == 'enabled'">
                            <AdminSetting title="Current Version" :data="admin.settings['security.advisories.version']"
                                setting="security.advisories.version" />
                            <AdminSetting title="Last Checked / Updated"
                                :data="admin.settings['security.advisories.updated']"
                                setting="security.advisories.updated" />

                            <AdminSetting title="Automatic Polling"
                                info="Allow automatically polling of the advisory database. This will access the internet to download the latest database."
                                description="Enable to automatically poll the advisory database for new alerts. This will access the internet to download the latest security alerts."
                                :data="admin.settings['security.advisories.polling']"
                                setting="security.advisories.polling" toggle />

                            <AdminSetting title="Manually Pull Database"
                                description="Manually trigger a pull of the advisory database."
                                :data="admin.settings['security.advisories.pull']" setting="security.advisories.pull"
                                button />
                        </div>

                        <hr class="my-6 border-gray-300" />

                        <h2 class="text-xl text-center font-semibold mb-2">
                            Security Tools
                        </h2>

                        <AdminSetting title="Allow Tool Alerts"
                            info="Enable to receive alerts from the security tools themselves. This might cause outdated alerts to be shown."
                            description="Enable to receive alerts from security tools. This includes alerts from tools like Trivy, Grype, and other security scanners."
                            :data="admin.settings['security.tools.alerts']" setting="security.tools.alerts" toggle />

                    </div>
                </div>
                <Loading v-else />
            </div>
        </div>
    </main>
</template>
