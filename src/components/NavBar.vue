<script setup lang="ts">
// https://tailwindui.com/components/application-ui/navigation/navbars
import { ref } from "vue";
import { RouterLink } from "vue-router";
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from "@headlessui/vue";
import {
    Bars3Icon,
    BellIcon,
    XMarkIcon,
    UserCircleIcon,
    PlusCircleIcon,
} from "@heroicons/vue/24/outline";

import { useServerStore } from "@/stores/server";
import { router, navigation } from "@/router";
import type { KonarrUser } from "@/types";

const server = useServerStore();

const props = defineProps<{
    user?: KonarrUser;
}>();

</script>

<template>
    <Disclosure as="nav" class="bg-gray-800" v-slot="{ open }">
        <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div class="relative flex h-16 items-center justify-between">
                <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
                    <!-- Mobile menu button-->
                    <DisclosureButton
                        class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                        <span class="absolute -inset-0.5" />
                        <span class="sr-only">Open main menu</span>
                        <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
                        <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
                    </DisclosureButton>
                </div>
                <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                    <!-- Logo -->
                    <div class="flex flex-shrink-0 items-center">
                        <router-link to="/" class="flex items-center">
                            <img class="h-8 w-auto" src="/static/img/logo.png" alt="Konarr" />
                        </router-link>
                    </div>

                    <!-- Navigation -->
                    <Menu as="div" v-if="server.user" class="hidden sm:ml-6 sm:block">
                        <div class="flex space-x-4">
                            <RouterLink v-for="item in navigation" :key="item.name" :to="{ name: item.name }" :class="[
                                item.current
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                'rounded-md px-3 py-2 text-sm font-medium',
                            ]" :aria-current="item.current ? 'page' : undefined">
                                {{ item.name }}
                            </RouterLink>
                        </div>
                    </Menu>
                </div>

                <!-- Add Button and dropdown menu -->
                <div v-if="server.user"
                    class="absolute inset-y-0 right-0 flex items-center justify-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    <Menu as="div" class="relative ml-3">
                        <MenuButton class="text-white bg-gray-800 rounded-md px-3 py-2 text-sm font-medium">
                            <PlusCircleIcon class="h-7 w-7 mt-1" aria-hidden="true" />
                        </MenuButton>

                        <transition enter-active-class="transition ease-out duration-100"
                            enter-from-class="transform opacity-0 scale-95"
                            enter-to-class="transform opacity-100 scale-100"
                            leave-active-class="transition ease-in duration-75"
                            leave-from-class="transform opacity-100 scale-100"
                            leave-to-class="transform opacity-0 scale-95">
                            <MenuItems
                                class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <MenuItem v-slot="{ active }">
                                <RouterLink :to="{ name: 'New Project' }" :class="[
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700',
                                ]">
                                    Add Project
                                </RouterLink>
                                </MenuItem>
                            </MenuItems>
                        </transition>
                    </Menu>

                </div>

                <div v-if="user"
                    class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    <!-- Profile -->
                    <Menu as="div" class="relative ml-3">
                        <div>
                            <MenuButton
                                class="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                <span class="text-gray-300 text-sm font-medium truncate mr-4 mt-1.5">
                                    {{ user.username }}
                                </span>
                                <span class="absolute -inset-1.5" />
                                <span class="sr-only"> Open user menu </span>
                                <img v-if="user.avatar" class="h-8 w-8 rounded-full" :src="user.avatar"
                                    :alt="user.username + ' avatar'" />
                                <UserCircleIcon v-else class="h-8 w-8 rounded-full text-gray-300" aria-hidden="true" />
                            </MenuButton>
                        </div>
                        <transition enter-active-class="transition ease-out duration-100"
                            enter-from-class="transform opacity-0 scale-95"
                            enter-to-class="transform opacity-100 scale-100"
                            leave-active-class="transition ease-in duration-75"
                            leave-from-class="transform opacity-100 scale-100"
                            leave-to-class="transform opacity-0 scale-95">
                            <MenuItems
                                class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <MenuItem v-if="user.role == 'admin'" v-slot="{ active }">
                                <router-link :to="{ name: 'Admin' }" :class="[
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700',
                                ]">
                                    Admin Panel
                                </router-link>
                                </MenuItem>
                                <MenuItem v-slot="{ active }">
                                <a href="#" :class="[
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700',
                                ]" @click="server.logout">
                                    Sign out
                                </a>
                                </MenuItem>
                            </MenuItems>
                        </transition>
                    </Menu>
                </div>
                <!-- Login -->
                <div v-else="user"
                    class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    <RouterLink v-if="server.config.registration" to="/register"
                        class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-6 py-2 text-sm font-medium bg-pink-700 mr-4">
                        Register
                    </RouterLink>
                    <RouterLink to="/login"
                        class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-6 py-2 text-sm font-medium bg-pink-700">
                        Login
                    </RouterLink>
                </div>
            </div>
        </div>
    </Disclosure>
</template>
