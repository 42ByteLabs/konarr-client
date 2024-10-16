<script setup lang="ts">
import { computed } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import * as i from "@mdi/js";
import type { KonarrDependency } from "@/types";

const props = defineProps<{
    dep: KonarrDependency;
    id?: number;
    size?: string;
}>();

const icon = computed(() => {
    if (props.dep.type === "operating_system") {
        switch (props.dep.name) {
            case "debian":
                return i.mdiDebian;
            case "alpine":
                return i.mdiLinux;
            case "ubuntu":
                return i.mdiUbuntu;
            case "rpm" | "fedora":
                return i.mdiFedora;
            default:
                return i.mdiLinux;
        }
    }
    else if (props.dep.type === "library") {
        switch (props.dep.manager) {
            case "deb":
                return i.mdiPackageVariantClosed;
            case "cargo" | "rust":
                return i.mdiLanguageRust;
            case "composer":
                return i.mdiLanguagePhp;
            case "golang":
                return i.mdiLanguageGo;
            case "pypi":
                return i.mdiLanguagePython;
            case "nuget":
                return i.mdiDotNet;
            case "lua":
                return i.mdiLanguageLua;
            case "gem" | "ruby":
                return i.mdiLanguageRuby;
            default:
                return i.mdiPackageVariantClosed;
        }
    }
    else if (props.dep.type === "database") {
        return i.mdiDatabase
    }
    return i.mdiPackageVariantClosed;
});

const link = computed(() => {
    return `/dependencies/${props.id || ""}`;
});
const size = computed(() => {
    return props.size || 24;
});
</script>
<template>
    <router-link :to="link" class="">
        <svg-icon type="mdi" :path="icon" :alt="props.dep.manager" :style="{ width: `${size}px`, height: `${size}px` }">
        </svg-icon>
    </router-link>
</template>
