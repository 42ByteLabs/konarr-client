import { defineStore } from "pinia";
import router from "@/router";
import client from "@/client";
import { handleErrors, handleApiResponse } from "@/stores/utils";

import type { ServerInfoResponse, ServerInfo } from "@/types";

export const useServerStore = defineStore("konarr", {
  state: () => ({
    info: {
      version: "0.0.0",
      commit: "0000000",
      config: {
        initialised: false,
        registration: false,
      },
    } as ServerInfo,
    // Is the user is logging in
    loggingIn: false,
    // Admin mode
    adminMode: false,
  }),

  getters: {
    // Convenient getters for accessing nested properties
    version: (state) => state.info.version,
    commit: (state) => state.info.commit,
    config: (state) => state.info.config,
    user: (state) => state.info.user,
    projects: (state) => state.info.projects,
    dependencies: (state) => state.info.dependencies,
    security: (state) => state.info.security,
  },

  actions: {
    // Fetch the server information
    async fetchInfo() {
      await client
        .get<ServerInfoResponse>("/")
        .then((response) => {
          const data = handleApiResponse(response.data);

          if (data) {
            this.info = data;
            if (this.info.user) {
              this.setAdminMode();
            } else {
              if (
                !this.info.config.initialised ||
                this.info.config.registration === true
              ) {
                router.push({ name: "Register" });
              } else {
                router.push({ name: "Login" });
              }
            }
          }
        })
        .catch((error) => {
          handleErrors(error);
        });
    },

    async login(username: string, password: string) {
      this.loggingIn = true;
      await client
        .post<{ status: string }>("/auth/login", {
          username: username,
          password: password,
        })
        .then((response) => {
          this.loggingIn = false;
          if (response.data.status === "success") {
            this.fetchInfo();
            router.push({ name: "Home" });
          }
        })
        .catch((error) => {
          this.loggingIn = false;
          handleErrors(error);
        });
    },

    async logout() {
      await client
        .post<{ status: string }>("/auth/logout", {})
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
      this.loggingIn = true;
      await client
        .post<{ status: string }>("/auth/register", {
          username: username,
          password: password,
          password_confirm: password,
        })
        .then((response) => {
          this.loggingIn = false;
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
      if (this.info.user?.role === "Admin") {
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
