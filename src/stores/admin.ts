import { defineStore } from "pinia";
import client from "@/client";
import { handleErrors, handleApiResponse } from "@/stores/utils";

import type {
  AdminSettings,
  AdminUser,
  AdminUsers,
  AdminUsersResponse,
} from "@/types";

export const useAdminStore = defineStore("admin", {
  state: () => ({
    loading: true,
    // Admin settings and stats
    adminSettings: {
      settings: {},
      projectStats: {
        total: 0,
        inactive: 0,
        archived: 0,
      },
      // This will be deprecated in favor of users list endpoint
      users: [],
      userStats: {
        total: 0,
        active: 0,
        inactive: 0,
      },
    } as AdminSettings,
    // Users list with pagination
    users: {
      data: [] as AdminUser[],
      pages: 0,
      count: 10,
      total: 0,
    } as AdminUsers,
    usersPage: 0,
    usersLimit: 24,
  }),

  getters: {
    registration(state): boolean {
      return state.adminSettings.settings["registration"] === "enabled";
    },
    settings(state): { [key: string]: any } {
      return state.adminSettings.settings;
    },
  },

  actions: {
    async fetchInfo() {
      this.loading = true;
      await client
        .get<AdminSettings>("/admin")
        .then((response) => {
          const data = handleApiResponse(response.data);
          if (data) {
            this.adminSettings = data;
          }
        })
        .catch((error) => {
          handleErrors(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // Update a single setting
    async updateSetting(name: string, value: any) {
      // If the value is a boolean, convert it to a string
      if (typeof value === "boolean") {
        value = value ? "enabled" : "disabled";
      } else {
        value = value.toString();
      }
      // Set the key as the name and the value as the value
      const data: { [key: string]: any } = {};
      data[name] = value;

      await client
        .patch<AdminSettings>("/admin", data)
        .then((response) => {
          const data = handleApiResponse(response.data);
          if (data) {
            this.adminSettings = data;
          }
        })
        .catch((error) => {
          handleErrors(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    async getUsers(params?: {
      page?: number;
      limit?: number;
      search?: string;
    }) {
      this.loading = true;
      // Build query params
      const query: { [key: string]: any } = {};
      if (params) {
        if (params.page !== undefined) query.page = params.page;
        if (params.limit !== undefined) query.limit = params.limit;
        if (params.search !== undefined && params.search !== "")
          query.search = params.search;
      }

      await client
        .get<AdminUsersResponse>("/admin/users", { params: query })
        .then((response) => {
          const data = handleApiResponse(response.data);
          if (data) {
            this.users = data;
          }
        })
        .catch((error) => {
          handleErrors(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    async updateUser(id: number, role?: string, state?: string) {
      const payload: { [key: string]: any } = {};

      if (role !== undefined) {
        payload["role"] = role;
      }
      if (state !== undefined) {
        payload["state"] = state;
      }

      await client
        .patch<AdminUser>(`/admin/users/${id}`, payload)
        .then((response) => {
          console.error("Update User Error", response);
        })
        .catch((error) => {
          handleErrors(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
});
