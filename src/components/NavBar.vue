<script setup lang="ts">
// https://tailwindui.com/components/application-ui/navigation/navbars
import { RouterLink } from "vue-router";
import {
  Disclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/vue";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  PlusCircleIcon,
} from "@heroicons/vue/24/outline";

import { useServerStore } from "@/stores/server";
import { navigation } from "@/router";
import type { User } from "@/types";
import { neutralButton, primaryButton } from "@/utils/buttonClasses";

const server = useServerStore();

const props = defineProps<{
  user?: User;
}>();
</script>

<template>
  <Disclosure v-slot="{ open }" as="nav" class="bg-gray-900 dark:bg-gray-dark">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <Menu
            as="div"
            class="relative ml-3 sm:hidden"
            aria-controls="mobile-menu"
          >
            <MenuButton
              class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span class="absolute -inset-0.5" />
              <span class="sr-only">Open main menu</span>
              <Bars3Icon
                v-if="!open"
                class="block h-6 w-6"
                aria-hidden="true"
              />
              <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
            </MenuButton>
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="bg-white absolute z-10 mt-2 w-auto dark:bg-gray-800 origin-top-right rounded-md py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <MenuItem
                  v-for="item in navigation"
                  v-slot="{}"
                  :key="item.name"
                >
                  <RouterLink
                    :to="{ name: item.name }"
                    :class="[
                      item.current
                        ? 'bg-accent-500 text-white'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700',
                      'block w-auto text-sm rounded-md my-2 mx-2 px-3 py-3 font-medium transition-colors',
                    ]"
                    :aria-current="item.current ? 'page' : undefined"
                  >
                    {{ item.name }}
                  </RouterLink>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
        <div
          class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start"
        >
          <!-- Logo -->
          <div class="flex flex-shrink-0 items-center">
            <router-link
              to="/"
              class="flex items-center"
              aria-label="Go to home page"
            >
              <img
                class="h-8 w-auto"
                src="/static/img/logo.png"
                alt="Konarr Logo"
              />
            </router-link>
          </div>

          <!-- Navigation -->
          <Menu v-if="server.user" as="div" class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-4">
              <RouterLink
                v-for="item in navigation"
                :key="item.name"
                :to="{ name: item.name }"
                :class="[
                  item.current
                    ? 'bg-accent-500 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                ]"
                :aria-current="item.current ? 'page' : undefined"
              >
                {{ item.name }}
              </RouterLink>
            </div>
          </Menu>
        </div>

        <!-- Add Button and dropdown menu -->
        <div
          v-if="server.user"
          class="absolute inset-y-0 right-0 flex items-center justify-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
        >
          <Menu as="div" class="relative ml-3">
            <MenuButton :class="primaryButton()" aria-label="Add new project">
              <PlusCircleIcon class="h-5 w-5" aria-hidden="true" />
              <span class="hidden sm:inline">New</span>
            </MenuButton>

            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <MenuItem v-slot="{ active }">
                  <RouterLink
                    :to="{ name: 'New Project' }"
                    :class="[
                      active ? 'bg-gray-100' : '',
                      'block px-4 py-2 text-sm text-gray-700',
                    ]"
                  >
                    Add Project
                  </RouterLink>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>

        <div
          v-if="props.user"
          class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
        >
          <!-- Profile -->
          <Menu as="div" class="relative ml-3">
            <div>
              <MenuButton
                aria-label="Open user menu"
                :class="primaryButton()"
                class="!px-2 !py-1.5"
              >
                <img
                  v-if="props.user.avatar"
                  class="h-6 w-6 rounded-full"
                  :src="props.user.avatar"
                  :alt="`${props.user.username} avatar`"
                />
                <UserCircleIcon
                  v-else
                  class="h-6 w-6 rounded-full"
                  aria-hidden="true"
                />
                <span class="hidden md:inline text-sm font-medium truncate">
                  {{ props.user.username }}
                </span>
                <span class="sr-only"
                  >Open user menu for {{ props.user.username }}</span
                >
              </MenuButton>
            </div>
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <MenuItem v-slot="{ active }">
                  <router-link
                    :to="{ name: 'Profile' }"
                    :class="[
                      active ? 'bg-gray-100' : '',
                      'block px-4 py-2 text-sm text-gray-700',
                    ]"
                  >
                    Profile
                  </router-link>
                </MenuItem>

                <MenuItem v-if="props.user.role == 'Admin'" v-slot="{ active }">
                  <router-link
                    :to="{ name: 'Admin' }"
                    :class="[
                      active ? 'bg-gray-100' : '',
                      'block px-4 py-2 text-sm text-gray-700',
                    ]"
                  >
                    Admin Panel
                  </router-link>
                </MenuItem>

                <MenuItem v-slot="{ active }">
                  <a
                    href="#"
                    :class="[
                      active ? 'bg-gray-100' : '',
                      'block px-4 py-2 text-sm text-gray-700',
                    ]"
                    @click="server.logout"
                  >
                    Sign out
                  </a>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
        <!-- Login -->
        <div
          v-else
          class="absolute inset-y-0 right-0 flex items-center gap-2 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
        >
          <RouterLink
            v-if="server.config.registration"
            to="/register"
            :class="neutralButton()"
          >
            Register
          </RouterLink>
          <RouterLink to="/login" :class="primaryButton()"> Login </RouterLink>
        </div>
      </div>
    </div>
  </Disclosure>
</template>
