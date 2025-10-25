<script setup lang="ts">
import { ref, onMounted } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import {
  mdiEyeOffOutline,
  mdiRefresh,
  mdiInformationBox,
  mdiPlayCircle,
} from "@mdi/js";
import { Switch } from "@headlessui/vue";
import { useNotification } from "@kyvg/vue3-notification";

const { notify } = useNotification();

import { useAdminStore } from "@/stores/admin";

// Removed unused server store
// const server = useServerStore();
const admin = useAdminStore();

// Props
const props = defineProps<{
  // Title / Name of the setting
  title: string;
  // The value of the setting
  data: any;
  // Description
  description?: string;
  // The key of the setting
  setting?: string;

  // Information
  info?: string;

  // If the setting is editable (string)
  editable?: boolean;
  // If the setting is a toggle (boolean)
  toggle?: boolean;
  // Click action
  button?: boolean;
  // Is the data hidden to the user
  hidedata?: boolean;
  // Regenerate setting
  regenerate?: boolean;
  // Select options
  select?: Array<{ value: string; label: string }>;
}>();

const enabled = ref(false);
const hidden = ref(true);
const description_help = ref(false);

// If the data is a boolean, set the switch to the value
// Toggle the setting
const toggle = () => {
  if (!props.setting) {
    console.error("No setting key provided");
    return;
  }
  enabled.value = !enabled.value;
  admin.updateSetting(props.setting, enabled.value);
};
const onclick = () => {
  if (!props.setting) {
    console.error("No setting key provided");
    return;
  }
  notify({
    type: "success",
    text: "Setting updated successfully",
  });
  admin.updateSetting(props.setting, "enabled");
};
// Restore function to toggle visibility with a different name
const toggleHidden = () => {
  hidden.value = !hidden.value;
};
const regenerate = () => {
  if (props.setting) {
    admin.updateSetting(props.setting, true);
  }
};
const onselect = (data: any) => {
  if (props.setting) {
    admin.updateSetting(props.setting, data);
  }
};

// Input editing for editable settings
const inputValue = ref<string | number | null>(null);
const validateUrl = (val: string) => {
  try {
    const u = new URL(val);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch (e) {
    return false;
  }
};
const saveInput = () => {
  if (!props.setting) {
    console.error("No setting key provided");
    return;
  }
  const val = inputValue.value ?? "";
  // If this looks like a server URL setting, validate it
  if (props.setting === "server.url") {
    if (!validateUrl(String(val))) {
      notify({ type: "error", text: "Invalid URL provided" });
      return;
    }
  }
  admin.updateSetting(props.setting, val);
  notify({ type: "success", text: "Setting updated successfully" });
};
const toggle_help = () => {
  description_help.value = !description_help.value;
};

onMounted(() => {
  if (props.data == "true" || props.data == "enabled") {
    enabled.value = true;
  } else {
    enabled.value = false;
  }
  // initialize editable input value
  if (props.editable) {
    inputValue.value = props.data ?? "";
  }
});
</script>

<template>
  <div
    class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
  >
    <!-- Admin Setting Layout -->
    <div class="flex flex-col my-2">
      <!-- Header Row: Toggle/Button/Action + Title + Info Icon -->
      <div class="flex items-center gap-4">
        <!-- Left: Control (Toggle/Button/Regenerate) -->
        <div class="flex-shrink-0 flex items-center gap-3">
          <!-- Toggle Switch -->
          <Switch
            v-if="props.toggle"
            v-model="enabled"
            :class="enabled ? 'bg-accent-600' : 'bg-gray-400 dark:bg-gray-600'"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2"
            @click="toggle"
          >
            <span class="sr-only">Enable {{ props.title }}</span>
            <span
              :class="enabled ? 'translate-x-6' : 'translate-x-1'"
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm"
            />
          </Switch>

          <!-- Action Button -->
          <button
            v-else-if="props.button"
            class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-accent-600 hover:bg-accent-700 rounded-lg transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2"
            @click="props.button ? onclick : undefined"
          >
            <svg-icon type="mdi" :path="mdiPlayCircle" class="h-4 w-4" />
            <span>Execute</span>
          </button>

          <!-- Regenerate Button -->
          <button
            v-else-if="props.hidedata"
            class="text-gray-600 dark:text-gray-400 hover:text-accent-500 dark:hover:text-accent-400 transition-colors p-1"
            title="Regenerate"
            @click="regenerate"
          >
            <svg-icon type="mdi" :path="mdiRefresh" class="h-5 w-5" />
          </button>
        </div>

        <!-- Center: Title and Description -->
        <div class="flex-1 min-w-0 mb-2">
          <div class="flex items-center gap-2">
            <h4
              class="text-sm font-semibold text-gray-900 dark:text-white truncate"
            >
              {{ props.title }}
            </h4>
            <button
              v-if="props.description"
              class="text-gray-500 dark:text-gray-400 hover:text-accent-500 dark:hover:text-accent-400 transition-colors flex-shrink-0"
              title="More information"
              @click="toggle_help"
            >
              <svg-icon type="mdi" :path="mdiInformationBox" class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Value/Input Row -->
      <div class="flex items-center gap-2">
        <!-- Hidden Data with Toggle Visibility -->
        <div
          v-if="props.hidedata"
          class="flex items-center gap-2 flex-1 ml-1.5 mt-2"
        >
          <button
            class="text-gray-600 dark:text-gray-400 hover:text-accent-500 dark:hover:text-accent-400 transition-colors flex-shrink-0"
            title="Toggle visibility"
            @click="toggleHidden"
          >
            <svg-icon type="mdi" :path="mdiEyeOffOutline" class="h-5 w-5" />
          </button>
          <span
            class="flex-1 text-sm font-mono text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 px-3 py-1.5 rounded"
          >
            {{ hidden ? "••••••••••••••••" : props.data }}
          </span>
        </div>

        <!-- Editable Input -->
        <input
          v-else-if="props.editable"
          v-model="inputValue"
          type="text"
          :placeholder="props.data || ''"
          class="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
          @blur="saveInput"
          @keyup.enter="saveInput"
        />

        <!-- Select Dropdown -->
        <select
          v-else-if="props.select"
          class="ml-3.5 w-auto min-w-[200px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors cursor-pointer hover:border-accent-400 dark:hover:border-accent-600"
          @change="onselect(($event.target as HTMLSelectElement).value)"
        >
          <option
            v-for="opt in select"
            :key="opt.label"
            :value="opt.value"
            :selected="opt.value === data"
          >
            {{ opt.label }}
          </option>
        </select>

        <!-- Read-only Data Display -->
        <span
          v-else-if="!props.button && !props.toggle"
          class="flex-1 text-sm text-gray-700 dark:text-gray-300 font-mono bg-gray-200 dark:bg-gray-800 px-3 py-1.5 rounded"
        >
          {{ props.data }}
        </span>
      </div>

      <!-- Info Alert (when toggle is off) -->
      <div
        v-if="props.info && !enabled"
        class="bg-sec-information-50 dark:bg-sec-information-900/20 border-l-4 border-sec-information-500 p-3 rounded"
        role="alert"
      >
        <div class="flex items-start gap-3">
          <svg-icon
            type="mdi"
            :path="mdiInformationBox"
            class="h-5 w-5 text-sec-information-600 dark:text-sec-information-400 flex-shrink-0 mt-0.5"
          />
          <p class="text-sm text-sec-information-800 dark:text-sec-information-300">
            {{ props.info }}
          </p>
        </div>
      </div>

      <!-- Description Help (when toggled) -->
      <div
        v-if="description_help"
        class="bg-accent-50 dark:bg-accent-900/20 border-l-4 border-accent-500 p-3 rounded"
        role="alert"
      >
        <p class="text-sm text-accent-800 dark:text-accent-300">
          {{ props.description }}
        </p>
      </div>
    </div>
  </div>
</template>
