import { defineStore } from "pinia";
import client from "@/client";
import router from "@/router";
import { handleErrors } from "@/stores/utils";

import type { KonarrAdmin } from "@/types";

export const useAdminStore = defineStore("admin", {
    state: () =>
    ({
        loading: true,
        settings: {},
        projectStats: {
            total: 0,
            inactive: 0,
            archived: 0,
        },
        project_stats: {
            total: 0,
            inactive: 0,
            archived: 0,
        },
        users: [],
        userStats: {
            total: 0,
            active: 0,
            inactive: 0,
        },
    } as KonarrAdmin),

    actions: {
        async fetchInfo() {
            this.loading = true;
            await client
                .get("/admin")
                .then((response) => {
                    this.settings = response.data.settings;
                    this.projectStats = response.data.projectStats;
                    this.users = response.data.users;
                    this.userStats = response.data.userStats;
                    this.loading = false;
                })
                .catch((error) => {
                    handleErrors(error);
                });
        },

        // Update a single setting
        async updateSetting(name: string, value: any) {
            // If the value is a boolean, convert it to a string
            if (typeof value === "boolean") {
                value = value ? "enabled" : "disabled";
            }
            else {
                value = value.toString();
            }
            // Set the key as the name and the value as the value
            var data: { [key: string]: any } = {};
            data[name] = value;

            await client
                .patch("/admin", data)
                .then((response) => {
                    this.settings = response.data.settings;
                })
                .catch((error) => {
                    handleErrors(error);
                });
        },

        async getUsers() {
            await client
                .get("/admin/users")
                .then((response) => {
                    this.users = response.data.users;
                })
                .catch((error) => {
                    handleErrors(error);
                });
        },

        async updateUser(id: number, role?: string, state?: string) {
            var payload: { [key: string]: any } = {};

            if (role !== undefined) {
                payload['role'] = role;
            }
            if (state !== undefined) {
                payload['state'] = state;
            }

            await client
                .patch(`/admin/users/${id}`, payload)
                .then((response) => {
                    // Update users

                })
                .catch((error) => {
                    handleErrors(error);
                });
        }, 
    },
});
