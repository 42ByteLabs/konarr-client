<script setup lang="ts">
import { onMounted, computed, ref } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiPencil, mdiEyeOffOutline, mdiRefresh, mdiInformationBox, mdiRadioboxBlank } from "@mdi/js";
import { Switch } from '@headlessui/vue'
import { useNotification } from "@kyvg/vue3-notification";

const { notify } = useNotification();


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
    };
    enabled.value = !enabled.value;
    admin.updateSetting(props.setting, enabled.value);
}
const onclick = () => {
    if (!props.setting) {
        console.error("No setting key provided");
        return;
    };
    notify({
        type: "success",
        text: "Setting updated successfully",
    });
    admin.updateSetting(props.setting, "enabled");
}
const hidedata = (data: any) => {
    hidden.value = !hidden.value;
}
const regenerate = () => {
    if (props.setting) {
        admin.updateSetting(props.setting, true);
    }
}
const onselect = (data: any) => {
    if (props.setting) {
        admin.updateSetting(props.setting, data);
    }
}
const toggle_help = () => {
    description_help.value = !description_help.value;
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
        <div class="grid grid-cols-12 gap-2 w-full mx-auto py-3 px-3 mt-2">
            <div v-if="props.toggle" class="col-span-2 sm:col-span-1">
                <div class="flex items-center justify-center">
                    <Switch v-if="props.toggle" v-model="enabled" :class="enabled ? 'bg-pink-600' : 'bg-gray-400'"
                        class="relative inline-flex h-6 w-11 items-center rounded-full" @click="toggle">
                        <span class="sr-only">Enable {{ props.title }}</span>
                        <span :class="enabled ? 'translate-x-6' : 'translate-x-1'"
                            class="inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-700 transition" />
                    </Switch>
                </div>
            </div>
            <div v-else-if="props.button" class="col-span-2 sm:col-span-1">
                <div class="flex items-center justify-center">
                    <button @click="onclick"
                        class="bg-accent-500 hover:bg-accent-700 text-white font-bold py-1 px-3 rounded">
                        <svg-icon type="mdi" :path="mdiRadioboxBlank" class="h-4 w-4" />
                    </button>
                </div>
            </div>
            <div v-else-if="props.hidedata" class="col-span-2 sm:col-span-1">
                <div class="flex items-center justify-center">
                    <button @click="regenerate" class="col-span-1 hover:text-accent-500">
                        <svg-icon type="mdi" :path="mdiRefresh" />
                    </button>
                </div>
            </div>
            <div v-else class="col-span-2 sm:col-span-1"></div>

            <div v-if="props.description" class="col-span-2 sm:col-span-1">
                <div class="flex items-center justify-center">
                    <button @click="toggle_help" class="hover:text-blue-500 mt-1">
                        <svg-icon type="mdi" :path="mdiInformationBox" class="h-4 w-4" />
                    </button>
                </div>
            </div>
            <div v-else class="col-span-1"></div>

            <div class="col-span-8 md:col-span-4">
                <div class="flex items-center">
                    <span>
                        <strong>
                            {{ props.title }}
                        </strong>
                    </span>
                </div>
            </div>

            <div v-if="props.hidedata" class="col-span-12 md:col-span-5 mt-2">
                <div class="flex items-center">
                    <div class="grid grid-cols-12">
                        <button @click="hidedata" class="col-span-2 sm:col-span-1 hover:text-blue-500 mr-4">
                            <svg-icon type="mdi" :path="mdiEyeOffOutline" />
                        </button>
                        <!-- Hide the data and on click, show the data -->
                        <span v-if="hidden" class="col-span-9 mt-1.5">
                            ********
                        </span>
                        <span v-else class="col-span-9 mt-1.5">
                            {{ props.data }}
                        </span>
                    </div>
                </div>
            </div>
            <div v-else-if="props.select" class="col-span-12 md:col-span-5 mt-2">
                <select @change="onselect(($event.target as HTMLSelectElement).value)"
                    class="bg-gray-200 dark:bg-gray-500 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500 sm:text-sm rounded-md">
                    <option :value="opt.value" v-for="opt in select" :key="opt.label" :selected="opt.value === data">
                        {{ opt.label }}
                    </option>
                </select>
            </div>
            <div v-else-if="props.button || props.toggle" class="col-span-5"></div>
            <div v-else class="col-span-12 md:col-span-5 mt-2">
                <div class="flex items-center">
                    <span>
                        {{ props.data }}
                    </span>
                </div>
            </div>

            <div v-if="props.info && !enabled" class="col-span-12 text-sm pt-1">
                <div class="bg-gray-100 dark:bg-gray-800 border-l-4 border-accent-500 text-accent-700 dark:text-accent-400 p-4"
                    role="alert">
                    <div class="grid grid-cols-12">
                        <div class="col-span-1 flex items-center justify-center">
                            <svg-icon type="mdi" :path="mdiInformationBox" class="h-4 w-4 mr-2" />
                        </div>
                        <div class="col-span-11">
                            {{ props.info }}
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="description_help" class="col-span-12 text-sm pt-2">
                <div class="bg-gray-100 dark:bg-gray-800 border-l-4 border-accent-500 text-accent-700 dark:text-accent-400 p-4"
                    role="alert">
                    {{ props.description }}
                </div>
            </div>
        </div>
    </div>
</template>
