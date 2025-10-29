import { defineStore } from "pinia";
import { handleErrors, handleApiResponse } from "@/stores/utils";
import client from "@/client";

import type {
  SessionSummary,
  SessionsSummary,
  User,
  UserPasswordChange,
  UserPasswordChangeResponse,
  SessionsSummaryResponse,
} from "@/types";

export const useUsersStore = defineStore("users", {
  state: () => ({
    sessions: {
      data: [] as SessionSummary[],
      pages: 0,
      count: 0,
      total: 0,
    } as SessionsSummary,
    loading: true,
    changingPassword: false,
  }),

  actions: {
    // Fetch the current authenticated user via the server-mounted `/user` endpoints
    async whoami(): Promise<User | undefined> {
      this.loading = true;

      await client
        .get<User>("/user/whoami")
        .then((response) => {
          const data = handleApiResponse(response.data);
          if (data) {
            return data;
          }
        })
        .catch((error) => {
          handleErrors(error);
        })
        .finally(() => {
          this.loading = false;
        });
      return undefined;
    },

    // Change password
    async changePassword(
      current: string,
      next: string,
      confirm: string,
    ): Promise<UserPasswordChange | undefined> {
      this.loading = true;
      this.changingPassword = true;

      const data = {
        current_password: current,
        new_password: next,
        new_password_confirm: confirm,
      } as UserPasswordChange;

      await client
        .patch<UserPasswordChangeResponse>("/user/password", data)
        .then((response) => {
          const data = handleApiResponse(response.data);
          if (data) {
            return data;
          }
        })
        .catch((error) => {
          handleErrors(error);
        })
        .finally(() => {
          this.changingPassword = false;
          this.loading = false;
        });
      return undefined;
    },

    // List sessions (returns the current session summary)
    async fetchSessions() {
      this.loading = true;

      await client
        .get<SessionsSummaryResponse>("/user/sessions")
        .then((res) => {
          const data = handleApiResponse(res.data);
          if (data) {
            this.sessions = data;
          }
        })
        .catch((e) => {
          handleErrors(e);
        })
        .finally(() => {
          this.loading = false;
        });
      return this.sessions;
    },

    // Revoke a session by id
    async revokeSession(id: number) {
      this.loading = true;

      await client
        .delete(`/user/sessions/${id}`)
        .then(() => {
          console.log("Session revoked");
        })
        .catch((e) => {
          throw e;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
});
