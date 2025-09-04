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

  if (props.dep.type === "OperatingSystem") {
    switch (props.dep.name) {
      case "debian":
        return i.mdiDebian;
      case "alpine":
        return i.mdiLinux;
      case "ubuntu":
        return i.mdiUbuntu;
      case "rpm":
      case "fedora":
        return i.mdiFedora;
      default:
        return i.mdiLinux;
    }
  } else if (props.dep.type === "ProgrammingLanguage") {
    switch (props.dep.name) {
      case "cargo":
      case "rust":
        return i.mdiLanguageRust;
      case "composer":
        return i.mdiLanguagePhp;
      case "go":
      case "golang":
        return i.mdiLanguageGo;
      case "pypi":
        return i.mdiLanguagePython;
      case "nuget":
        return i.mdiDotNet;
      case "lua":
        return i.mdiLanguageLua;
      case "gem":
      case "ruby":
        return i.mdiLanguageRuby;
      default:
        return i.mdiApplicationEditOutline;
    }
  } else if (props.dep.type === "Application") {
    return i.mdiApplicationBrackets;
  } else if (props.dep.type === "PackageManager") {
    return i.mdiPackageVariant;
  } else if (props.dep.type === "CryptographyLibrary") {
    return i.mdiSecurityNetwork;
  } else if (props.dep.type === "Database") {
    return i.mdiDatabase;
  } else if (props.dep.type === "CompressionLibrary") {
    return i.mdiZipBox;
  } else if (props.dep.type === "OperatingEnvironment") {
    return i.mdiCloudCog;
  }
  return i.mdiPackageVariantClosed;
});

const link = computed(() => {
  if (typeof props.dep === "object" && props.dep.type) {
    return `/dependencies/${props.id || ""}?select=${props.dep.type}`;
  }
  return `/dependencies/${props.id || ""}`;
});
const size = computed(() => {
  return props.size || 24;
});
</script>
<template>
  <router-link :to="link" class="">
    <svg-icon
      type="mdi"
      :path="icon"
      :alt="typeof props.dep === 'object' ? props.dep.manager : ''"
      :style="{ width: `${size}px`, height: `${size}px` }"
    >
    </svg-icon>
  </router-link>
</template>
