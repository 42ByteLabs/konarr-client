import { defineStore } from "pinia";
import router from "@/router";
import client from "@/client";
import { handleErrors } from "@/stores/utils";

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
      // Admin mode
      adminMode: false,
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

            this.setAdminMode();
          } else {
            if (!this.config.initialised) {
              router.push({ name: "Login" });
            }
            if (this.config.registration === true) {
              router.push({ name: "Registration" });
            }
          }
        })
        .catch((error) => {
          handleErrors(error);
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
          }
        })
        .catch((error) => {
          this.logging_in = false;
          handleErrors(error);
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
          handleErrors(error);
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
        })
        .catch((error) => {
          handleErrors(error);
        });
    },

    setAdminMode() {
      // Check local storage for admin mode
      const adminModeValue = localStorage.getItem("adminMode");
      if (adminModeValue === "true") {
        this.adminMode = true;
      } else {
        this.adminMode = false;
      }
    },

    toggleAdminMode() {
      if (this.user?.role === "Admin") {
        this.adminMode = !this.adminMode;
        // Save admin mode to local storage
        localStorage.setItem("adminMode", this.adminMode.toString());

        console.log("Toggling admin mode: ", this.adminMode);
      } else {
        console.log("User is not an admin, cannot toggle admin mode");
      }
    },
  },
});
