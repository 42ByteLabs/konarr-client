import { defineStore } from "pinia";
import client from "@/client";
import { handleErrors, handleApiResponse } from "@/stores/utils";

import type {
  SecurityAlerts,
  SecurityAlert,
  SecurityAlertsResponse,
} from "@/types";
import router from "@/router";

export const useSecurityStore = defineStore("security", {
  state: () => ({
    securityAlerts: {
      data: [] as SecurityAlert[],
      pages: 0,
      total: 0,
      count: 0,
    } as SecurityAlerts,
    loading: true,
    current: null as number | null,
    page: 0,
    limit: 24,
  }),

  getters: {
    alerts(state): SecurityAlert[] {
      return state.securityAlerts.data;
    },
    pages(state): number {
      return state.securityAlerts.pages;
    },
    total(state): number {
      return state.securityAlerts.total;
    },
    count(state): number {
      return state.securityAlerts.count;
    },
  },

  actions: {
    find(a: number | null): SecurityAlert | undefined {
      if (a === null) return undefined;
      return this.securityAlerts.data.find((alert) => alert.id === a);
    },

    async getAlert(id?: number) {
      if (!id) {
        const idParam = router.currentRoute.value.params.id;
        this.current = parseInt(Array.isArray(idParam) ? idParam[0] : idParam);
      } else {
        this.current = id;
      }

      const result = this.securityAlerts.data.find(
        (alert) => alert.id === this.current,
      );
      if (!result) {
        await this.fetchAlert(this.current);
      }
    },

    async fetchAlerts(page: number = 0, limit: number = 24, severity?: string) {
      this.loading = true;
      let params = `page=${page}&limit=${limit}`;
      if (severity) {
        params += "&severity=" + severity;
      }

      await client
        .get<SecurityAlertsResponse>(`/security?${params}`)
        .then((response) => {
          const data = handleApiResponse(response.data);
          if (data) {
            this.securityAlerts.data = data.data;
          }
        })
        .catch((error) => {
          handleErrors(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async fetchAlert(id: number) {
      this.loading = true;
      this.current = id;

      await client
        .get<SecurityAlert>(`/security/${id}`)
        .then((response) => {
          this.loading = false;
          const index = this.securityAlerts.data.findIndex((x) => x.id === id);
          if (index !== -1) {
            this.securityAlerts.data[index] = response.data;
          } else {
            this.securityAlerts.data.push(response.data);
          }
        })
        .catch((error) => {
          handleErrors(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async fetchSnapshotAlerts(
      snapshot: number,
      page?: number,
      limit?: number,
      severity?: string,
    ) {
      this.loading = true;
      let params = `page=${page}&limit=${limit}`;
      if (severity) {
        params += "&severity=" + severity;
      }

      await client
        .get<SecurityAlertsResponse>(`/snapshots/${snapshot}/alerts?${params}`)
        .then((response) => {
          const data = handleApiResponse(response.data);
          if (data) {
            this.securityAlerts.data = data.data;
          }
        })
        .catch((error) => {
          handleErrors(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async fetchNextPage() {
      const sselect = router.currentRoute.value.query.select;
      const sseverity = router.currentRoute.value.query.severity;

      if (this.page < this.pages) {
        if (this.current) {
          await this.fetchAlerts(this.page + 1);
        } else {
          const severityStr = Array.isArray(sseverity)
            ? sseverity[0]
            : (sseverity ?? undefined);
          const severityParam = severityStr ?? undefined;
          await this.fetchAlerts(this.page + 1, 24, severityParam);
          router.push({
            query: {
              page: this.page + 1,
              severity: router.currentRoute.value.query.severity,
              snapshot: router.currentRoute.value.query.snapshot,
              select: sselect,
            },
          });
        }
      }
    },

    async fetchPrevPage() {
      const sselect = router.currentRoute.value.query.select;
      const sseverity = router.currentRoute.value.query.severity;

      if (this.page !== 0) {
        if (this.current) {
          await this.fetchAlerts(this.page - 1);
        } else {
          const severityStr = Array.isArray(sseverity)
            ? sseverity[0]
            : (sseverity ?? undefined);
          const severityParam = severityStr ?? undefined;
          await this.fetchAlerts(this.page - 1, 24, severityParam);
          if (this.isFirstPage()) {
            // Remove page if first
            router.push({
              query: {
                page: undefined,
                severity: router.currentRoute.value.query.severity,
                snapshot: router.currentRoute.value.query.snapshot,
                select: sselect,
              },
            });
          } else {
            router.push({
              query: {
                page: this.page + 1,
                severity: router.currentRoute.value.query.severity,
                snapshot: router.currentRoute.value.query.snapshot,
                select: sselect,
              },
            });
          }
        }
      }
    },

    isFirstPage(): boolean {
      return this.page === 0;
    },
    isLastPage(): boolean {
      return this.page === this.pages;
    },
  },
});
