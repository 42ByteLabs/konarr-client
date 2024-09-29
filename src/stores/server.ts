import { defineStore } from "pinia";
import router from "@/router";
import client from "@/client";

import type { KonarrServer } from "@/types";

export const useServerStore = defineStore("konarr", {
    state: () =>
        ({
            version: "0.0.0",
            commit: "0000000",
            config: {
                initialised: false,
                registration: true,
            },
            // Is the user is logging in
            logging_in: false,
        }) as KonarrServer,

    actions: {
        // Fetch the server information
        async fetchInfo() {
            await client
                .get("/")
                .then((response) => {
                    this.version = response.data.version;
                    this.commit = response.data.commit;
                    this.config = response.data.config;

                    if (response.data.user) {
                        this.user = response.data.user;
                        this.projects = response.data.projects;
                        this.dependencies = response.data.dependencies;
                        this.security = response.data.security;
                    } else {
                        if (this.config.registration === false) {
                            router.push({ name: "Login" });
                        }
                        if (this.config.initialised) {
                            router.push({ name: "Register" });
                        }
                    }

                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        router.push({ name: "Login" });
                    }
                });
        },

        async login(username: string, password: string) {
            this.logging_in = true;
            await client
                .post("/auth/login", {
                    username: username,
                    password: password,
                })
                .then((response) => {
                    this.logging_in = false;
                    if (response.data.status === "success") {
                        this.fetchInfo();
                        router.push({ name: "Home" });
                    } else {
                        console.error(response.data);
                    }
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        router.push({ name: "Login" });
                    }
                });
        },

        async logout() {
            await client
                .post("/auth/logout", {})
                .then((response) => {
                    if (response.data.status !== "success") {
                        console.error(response.data);
                    }

                    this.fetchInfo();
                    // Reload the page to clear the session
                    window.location.reload();
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        router.push({ name: "Login" });
                    }
                });
        },

        async register(username: string, password: string) {
            this.logging_in = true;
            await client
                .post("/auth/register", {
                    username: username,
                    password: password,
                    password_confirm: password,
                })
                .then((response) => {
                    this.logging_in = false;
                    if (response.data.status === "success") {
                        router.push({ name: "Login" });
                    } else {
                        console.error(response.data);
                    }
                }).catch((error) => {
                    if (error.response.status === 401) {
                        router.push({ name: "Login" });
                    }
                });
        },
    },
});
