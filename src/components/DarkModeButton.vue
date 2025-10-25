<script setup lang="ts">
import { onMounted, ref } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiWhiteBalanceSunny, mdiWeatherNight } from "@mdi/js";
import { Switch } from "@headlessui/vue";

var darkMode = localStorage.getItem("dark-mode");
const enabled = ref(darkMode === "true");

const toggle = () => {
  enabled.value = !enabled.value;

  localStorage.setItem("dark-mode", enabled.value.toString());
  document.documentElement.className = enabled.value === true ? "dark" : "";
};

onMounted(() => {
  let mode: string | boolean | null = localStorage.getItem("dark-mode");
  if (mode === null) {
    mode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  enabled.value = mode === "true" || mode === true;
});
</script>
<template>
  <div class="mx-4 mt-1.5">
    <Switch
      v-model="enabled"
      :class="enabled ? 'bg-accent-500' : 'bg-black'"
      :aria-label="enabled ? 'Switch to light mode' : 'Switch to dark mode'"
      class="relative inline-flex h-6 w-11 items-center rounded-full"
      @click="toggle"
    >
      <span class="sr-only">
        {{ enabled ? "Dark mode enabled" : "Light mode enabled" }}
      </span>
      <span
        :class="enabled ? 'translate-x-6' : 'translate-x-1'"
        class="inline-block h-4 w-4 transform rounded-full transition"
      >
        <div v-if="enabled">
          <svg-icon
            type="mdi"
            :path="mdiWeatherNight"
            aria-hidden="true"
            class="w-4 h-4 text-black"
          />
        </div>
        <div v-else>
          <svg-icon
            type="mdi"
            :path="mdiWhiteBalanceSunny"
            aria-hidden="true"
            class="w-4 h-4 text-white"
          />
        </div>
      </span>
    </Switch>
  </div>
</template>
