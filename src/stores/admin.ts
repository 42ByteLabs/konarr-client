import { defineStore } from "pinia";
import client from "@/client";
import router from "@/router";

export const useAdminStore = defineStore("admin", {
    state: () =>
    ({
        loading: true,
        settings: {},
        users: [],
        page: "General",
    }),

    actions: {
        async fetchInfo() {
            this.loading = true;
            await client
                .get("/admin")
                .then((response) => {
                    this.settings = response.data.settings;
                    this.users = response.data.users;
                    this.loading = false;
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        router.push({ name: "Login" });
                    }
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
            var data = {};
            data[name] = value;

            await client
                .patch("/admin", data)
                .then((response) => {
                    this.settings = response.data.settings;
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        router.push({ name: "Login" });
                    }
                });
        },

        async getUsers() {
            await client
                .get("/admin/users")
                .then((response) => {
                    this.users = response.data.users;
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        router.push({ name: "Login" });
                    }
                });
        },
    },
});
