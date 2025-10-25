import { defineStore } from "pinia";
import { handleErrors } from "@/stores/utils";
import client from "@/client";

import type { SessionSummary, User } from "@/types";

export const useUsersStore = defineStore("users", {
  state: () => ({
    sessions: [] as SessionSummary[],
    loading: false,
    changingPassword: false,
  }),

  actions: {
    // Fetch the current authenticated user via the server-mounted `/user` endpoints
    async whoami(): Promise<User | null> {
      try {
        const res = await client.get("/user/whoami");
        return res.data as User;
      } catch (e) {
        handleErrors(e as any);
        return null;
      }
    },

    // Change password
    async changePassword(current: string, next: string, confirm: string) {
      this.changingPassword = true;
      try {
        const res = await client.patch("/user/password", {
          current_password: current,
          new_password: next,
          new_password_confirm: confirm,
        });
        return res.data;
      } catch (e) {
        handleErrors(e as any);
        return null;
      } finally {
        this.changingPassword = false;
      }
    },

    // List sessions (returns the current session summary)
    async listSessions() {
      this.loading = true;
      try {
        const res = await client.get("/user/sessions");
        const data: SessionSummary[] = res.data;
        this.sessions = data;
        return this.sessions;
      } catch (e) {
        handleErrors(e as any);
        return [] as SessionSummary[];
      } finally {
        this.loading = false;
      }
    },

    // Revoke a session by id
    async revokeSession(id: number) {
      try {
        await client.delete(`/user/sessions/${id}`);

        // Refresh sessions
        await this.listSessions();
        return true;
      } catch (e) {
        handleErrors(e as any);
        return false;
      }
    },
  },
});
