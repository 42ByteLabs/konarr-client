import { defineStore } from "pinia";
import client from "@/client";
import { handleErrors } from "@/stores/utils";

import type { AdminSettings, AdminUser } from "@/types";

/** Admin Store State
 *
 * Extends AdminSettings (API response) with client-side state
 */
interface AdminStoreState extends AdminSettings {
  /** Loading state indicator (client-side) */
  loading: boolean;
  /** Current page number for user pagination (client-side) */
  page: number;
  /** Total number of pages for user pagination (client-side) */
  pages: number;
  /** Items per page limit for user pagination (client-side) */
  limit: number;
  /** Total number of users (client-side) */
  total: number;
}

export const useAdminStore = defineStore("admin", {
  state: (): AdminStoreState => ({
    loading: true,
    settings: {},
    projectStats: {
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
    // pagination for users (client-side)
    page: 0,
    pages: 0,
    limit: 24,
    total: 0,
  }),

  actions: {
    async fetchInfo() {
      this.loading = true;
      await client
        .get<AdminSettings>("/admin")
        .then((response) => {
          this.settings = response.data.settings;
          this.projectStats = response.data.projectStats;
          this.users = response.data.users;
          this.userStats = response.data.userStats;
          this.loading = false;
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
          this.settings = response.data.settings;
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
      // Build query params
      const query: { [key: string]: any } = {};
      if (params) {
        if (params.page !== undefined) query.page = params.page;
        if (params.limit !== undefined) query.limit = params.limit;
        if (params.search !== undefined && params.search !== "")
          query.search = params.search;
      }

      await client
        .get<{
          users: AdminUser[];
          userStats: any;
          page?: number;
          pages?: number;
          limit?: number;
          total?: number;
        }>("/admin/users", { params: query })
        .then((response) => {
          // Expecting an object with users list and pagination/stats
          if (response.data.users) this.users = response.data.users;
          if (response.data.userStats) this.userStats = response.data.userStats;
          // Optional pagination fields from server
          if (response.data.page !== undefined) this.page = response.data.page;
          if (response.data.pages !== undefined)
            this.pages = response.data.pages;
          if (response.data.limit !== undefined)
            this.limit = response.data.limit;
          if (response.data.total !== undefined)
            this.total = response.data.total;
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
