<script setup lang="ts">
import { computed } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import * as i from "@mdi/js";
import type { KonarrDependency } from "@/types";

const props = defineProps<{
    dep: KonarrDependency | string;
    id?: number;
    size?: string;
}>();

const icon = computed(() => {
    if (typeof props.dep === "string") {
        return i.mdiPackageVariantClosed;
    }

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
    else if (props.dep.type === "programming_language") {
        switch (props.dep.name) {
            case "cargo" | "rust":
                return i.mdiLanguageRust;
            case "composer":
                return i.mdiLanguagePhp;
            case "go" | "golang":
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
                return i.mdiApplicationEditOutline;
        }
    }
    else if (props.dep.type === "application") {
        return i.mdiApplicationBrackets;
    }
    else if (props.dep.type === "package_manager") {
        return i.mdiPackageVariant;
    }
    else if (props.dep.type === "cryptography_library") {
        return i.mdiSecurityNetwork;
    }
    else if (props.dep.type === "library") {
        return i.mdiPackageVariantClosed;
    }
    else if (props.dep.type === "database") {
        return i.mdiDatabase
    }
    return i.mdiPackageVariantClosed;
});

const link = computed(() => {
    return `/dependencies/${props.id || ""}?select=${props.dep.type}`;
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
