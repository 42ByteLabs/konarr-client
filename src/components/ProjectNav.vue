<script setup lang="ts">
import type { KonarrProject } from "@/types";
import SvgIcon from "@jamescoyle/vue-icon";
import {
  mdiPencil,
  mdiMenuLeft,
  mdiShieldCheck,
  mdiCubeOutline,
  mdiCog,
  mdiViewDashboard,
} from "@mdi/js";

const props = defineProps<{
  id: number;
  title: string;
  parent?: number;
  edit?: boolean;
  active?: string;
}>();

// tabs now use router navigation; no local emits required

function tabClass(tab: string) {
  const base =
    "inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const activeCls = "bg-accent-500 text-white hover:bg-accent-600";
  const inactiveCls =
    "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600";
  return `${base} ${props.active === tab ? activeCls : inactiveCls}`;
}

function btnClass() {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500";
  const sizeAndStyle = "px-3 py-2 text-sm rounded-md";
  const colors =
    "bg-accent-500 hover:bg-accent-600 text-white shadow-sm hover:shadow-md";
  return `${base} ${sizeAndStyle} ${colors}`;
}
</script>

<template>
  <div class="grid grid-cols-8 mb-8 mt-4">
    <div class="col-span-1 text-center">
      <router-link
        v-if="props.parent"
        :to="{ name: 'Project', params: { id: props.parent } }"
      >
        <button :class="btnClass()">
          <svg-icon type="mdi" :path="mdiMenuLeft" class="h-4 w-4" />
          <span class="hidden sm:block">Parent</span>
        </button>
      </router-link>
      <router-link v-else :to="{ name: 'Projects' }">
        <button :class="btnClass()">
          <svg-icon type="mdi" :path="mdiMenuLeft" class="h-4 w-4" />
          <span class="hidden sm:block">Projects</span>
        </button>
      </router-link>
    </div>
    <div class="col-span-6 text-center">
      <div class="flex flex-col items-center gap-2">
        <div class="flex gap-1">
          <router-link
            :to="{
              name: 'Project',
              params: { id: props.id },
            }"
          >
            <button type="button" :class="tabClass('summary')">
              <svg-icon type="mdi" :path="mdiViewDashboard" class="h-4 w-4" />
              <span>Summary</span>
            </button>
          </router-link>
          <router-link
            :to="{
              name: 'Project Security',
              params: { id: props.id },
            }"
          >
            <button type="button" :class="tabClass('security')">
              <svg-icon type="mdi" :path="mdiShieldCheck" class="h-4 w-4" />
              <span>Security</span>
            </button>
          </router-link>
          <router-link
            :to="{
              name: 'Project Dependencies',
              params: { id: props.id },
            }"
          >
            <button type="button" :class="tabClass('dependencies')">
              <svg-icon type="mdi" :path="mdiCubeOutline" class="h-4 w-4" />
              <span>Dependencies</span>
            </button>
          </router-link>
          <router-link
            v-if="props.edit"
            :to="{
              name: 'Project Setup',
              params: { id: props.id },
            }"
          >
            <button type="button" :class="tabClass('setup')">
              <svg-icon type="mdi" :path="mdiCog" class="h-4 w-4" />
              <span>Setup</span>
            </button>
          </router-link>
        </div>
      </div>
    </div>
    <div v-if="props.edit" class="col-span-1 text-center">
      <div class="flex justify-end">
        <router-link :to="{ name: 'Edit Project', params: { id: props.id } }">
          <button :class="btnClass()" class="mt-2">
            <svg-icon type="mdi" :path="mdiPencil" class="h-5 w-5" />
            <span class="hidden sm:block">Edit</span>
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>
