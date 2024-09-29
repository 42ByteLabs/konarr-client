<script setup lang="ts">
import { onMounted, computed, ref } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiPencil, mdiEyeOffOutline, mdiRefresh } from "@mdi/js";
import { Switch } from '@headlessui/vue'

import { useServerStore } from "@/stores/server";
import { useAdminStore } from "@/stores/admin";

const server = useServerStore();
const admin = useAdminStore();

// Props
const props = defineProps<{
    // Title / Name of the setting
    title: string;
    // The value of the setting
    data: any;
    // The key of the setting
    setting?: string;

    // If the setting is editable (string)
    editable?: boolean;
    // If the setting is a toggle (boolean)
    toggle?: boolean;
    // Is the data hidden to the user
    hidedata?: boolean;
    // Regenerate setting
    regenerate?: boolean;
}>();

const enabled = ref(false);
const hidden = ref(true);

// If the data is a boolean, set the switch to the value
// Toggle the setting
const toggle = () => {
    if (!props.setting) {
        console.error("No setting key provided");
        return;
    };
    enabled.value = !enabled.value;
    admin.updateSetting(props.setting, enabled.value);
}

const hidedata = (data: any) => {
    hidden.value = !hidden.value;
}
const regenerate = () => {
    admin.updateSetting(props.setting, true);
}

onMounted(() => {
    if (props.data == "true" || props.data == "enabled") {
        enabled.value = true;
    } else {
        enabled.value = false;
    }
});

</script>

<template>
    <div>
        <!-- Display a Admin Setting -->
        <div class="grid grid-cols-6 gap-2 w-full mx-auto py-3 px-3">
            <div class="col-span-2">
                <div class="flex items-center">
                    <span>
                        <strong>
                            {{ props.title }}
                        </strong>
                    </span>
                </div>
            </div>
            <div class="col-span-4">
                <div class="flex items-center">
                    <Switch v-if="props.toggle" v-model="enabled" :class="enabled ? 'bg-pink-600' : 'bg-gray-200'"
                        class="relative inline-flex h-6 w-11 items-center rounded-full" @click="toggle">
                        <span class="sr-only">Enable {{ props.title }}</span>
                        <span :class="enabled ? 'translate-x-6' : 'translate-x-1'"
                            class="inline-block h-4 w-4 transform rounded-full bg-white transition" />
                    </Switch>

                    <div v-else-if="props.hidedata" class="grid grid-cols-12">
                        <button @click="hidedata" class="col-span-1 hover:text-blue-500 mr-4">
                            <svg-icon type="mdi" :path="mdiEyeOffOutline" />
                        </button>
                        <!-- Hide the data and on click, show the data -->
                        <span v-if="hidden" class="col-span-9 mt-1.5">
                            ********
                        </span>
                        <span v-else class="col-span-9 mt-1.5">
                            {{ props.data }}
                        </span>
                        <button @click="regenerate" class="col-span-1 hover:text-blue-500 mr-4 ml-8">
                            <svg-icon type="mdi" :path="mdiRefresh" />
                        </button>
                    </div>
                    <span v-else>
                        {{ props.data }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
