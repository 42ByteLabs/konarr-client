<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { KonarrProject } from "@/types";
import { useAdminStore } from "@/stores/admin";
import SbomUpload from "@/components/SbomUpload.vue";

const admin = useAdminStore();

const props = defineProps<{ id: number; project: KonarrProject }>();

const pid = props.id ? String(props.id) : "<project-id>";
const instance =
  typeof window !== "undefined" && window.location?.origin
    ? window.location.origin
    : "your-instance";

const instanceToken = ref("<token>");

const showDocker = ref(false);
const showK8s = ref(false);

function setTokenFromSettings(s: any) {
  if (!s) return;
  const token =
    s["agent.key"] ?? s['"agent.key"'] ?? s.agentKey ?? s["agentKey"];
  if (token) {
    instanceToken.value = token;
    return true;
  }
  return false;
}

const dockerCmd = computed(() => {
  const lines = [
    "docker run \\",
    `  -e "${instance}" \\`,
    `  -e "${instanceToken.value}" \\`,
    `  -e "${pid}" \\`,
    '  -v "/var/run/docker.sock:/var/run/docker.sock:ro" \\',
    "  ghrc.io/42bytelabs/konarr-agent:latest",
  ];
  return lines.join("\n");
});

const k8sManifest = computed(() => {
  const lines = [
    "apiVersion: apps/v1",
    "kind: Deployment",
    "metadata:",
    "  name: konarr-agent",
    "spec:",
    "  replicas: 1",
    "  template:",
    "    metadata:",
    "      labels:",
    "        app: konarr-agent",
    "    spec:",
    "      containers:",
    "        - name: konarr-agent",
    "          image: ghrc.io/42bytelabs/konarr-agent:latest",
    "          env:",
    "            - name: KONARR_INSTANCE",
    `              value: "${instance}"`,
    "            - name: KONARR_AGENT_TOKEN",
    `              value: "${instanceToken.value}"`,
    "            - name: KONARR_PROJECT_ID",
    `              value: "${pid}"`,
  ];
  return lines.join("\n");
});

const copiedDocker = ref(false);
const copiedK8s = ref(false);

async function copyToClipboard(text: any, which: "docker" | "k8s") {
  try {
    const toWrite = typeof text === "string" ? text : text?.value || "";
    await navigator.clipboard.writeText(toWrite);
    if (which === "docker") {
      copiedDocker.value = true;
      setTimeout(() => (copiedDocker.value = false), 2000);
    } else {
      copiedK8s.value = true;
      setTimeout(() => (copiedK8s.value = false), 2000);
    }
  } catch (e) {
    // Fallback: do nothing (clipboard may be unavailable)
    console.error("Copy failed", e);
  }
}

onMounted(async () => {
  // Ensure admin settings are loaded, then populate the instance token once.
  await admin.fetchInfo();
  setTokenFromSettings(admin.settings);
});
</script>

<template>
  <div class="space-y-6">
    <h3 class="dark:text-white text-center text-xl font-bold mt-6">
      Setup Konarr Agent
    </h3>

    <div class="grid grid-cols-1 gap-4 dark:text-white mt-4">
      <div class="bg-white dark:bg-gray-900 shadow-md rounded-lg p-4 relative">
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-lg font-bold">Docker</h4>
          <div class="flex items-center gap-2">
            <button
              class="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded text-gray-700 dark:text-gray-200"
              @click="copyToClipboard(dockerCmd, 'docker')"
            >
              <span v-if="!copiedDocker">Copy</span>
              <span v-else>Copied</span>
            </button>
            <button
              class="text-sm px-3 py-1 border border-gray-200 dark:border-gray-700 rounded text-gray-700 dark:text-gray-200"
              @click="showDocker = !showDocker"
            >
              <span v-if="!showDocker">Show</span>
              <span v-else>Hide</span>
            </button>
          </div>
        </div>

        <div v-if="showDocker">
          <pre
            class="bg-gray-100 dark:bg-gray-800 rounded p-3 overflow-x-auto text-sm"
          ><code>{{ dockerCmd }}</code></pre>
        </div>
        <div
          v-else
          class="bg-gray-50 dark:bg-gray-900 rounded p-3 text-sm text-gray-500"
        >
          <code>Hidden — click Show to reveal</code>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-900 shadow-md rounded-lg p-4 relative">
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-lg font-bold">Kubernetes</h4>
          <div class="flex items-center gap-2">
            <button
              class="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded text-gray-700 dark:text-gray-200"
              @click="copyToClipboard(k8sManifest, 'k8s')"
            >
              <span v-if="!copiedK8s">Copy</span>
              <span v-else>Copied</span>
            </button>
            <button
              class="text-sm px-3 py-1 border border-gray-200 dark:border-gray-700 rounded text-gray-700 dark:text-gray-200"
              @click="showK8s = !showK8s"
            >
              <span v-if="!showK8s">Show</span>
              <span v-else>Hide</span>
            </button>
          </div>
        </div>

        <div v-if="showK8s">
          <pre
            class="bg-gray-100 dark:bg-gray-800 rounded p-3 overflow-x-auto text-sm"
          ><code>{{ k8sManifest }}</code></pre>
        </div>
        <div
          v-else
          class="bg-gray-50 dark:bg-gray-900 rounded p-3 text-sm text-gray-500"
        >
          <code>Hidden — click Show to reveal</code>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-900 shadow-md rounded-lg p-4 relative">
        <h4 class="text-lg font-bold mb-2">Manual Upload</h4>
        <SbomUpload :project-id="props.project.id" />
      </div>
    </div>
  </div>
</template>
