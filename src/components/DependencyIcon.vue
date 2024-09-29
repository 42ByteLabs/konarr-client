<script setup lang="ts">
import { computed } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiLanguagePython, mdiDotNet, mdiPackageVariantClosed, mdiLanguagePhp, mdiLanguageGo } from "@mdi/js";

const props = defineProps<{
    type?: string;
    manager?: string;
    id?: number;
    size?: number;
}>();

const icon = computed(() => {
    switch (props.manager) {
        case "deb":
            return mdiPackageVariantClosed;
        case "composer":
            return mdiLanguagePhp;
        case "golang":
            return mdiLanguageGo;
        case "pypi":
            return mdiLanguagePython;
        case "nuget":
            return mdiDotNet;
        default:
            return mdiPackageVariantClosed;
    }
});
const link = computed(() => {
    return `/dependencies/${props.id || ""}`;
});
const size = computed(() => {
    return props.size || 24;
});
</script>
<template>
    <router-link :to="link" :style="{ width: `${size}px`, height: `${size}px` }">
        <svg-icon type="mdi" :path="icon" :alt="manager"></svg-icon>
    </router-link>
</template>
