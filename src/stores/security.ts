import { defineStore } from "pinia";
import client from "@/client";

import type { KonarrSecurityAlerts } from "@/types";
import router from "@/router";

export const useSecurityStore = defineStore("security", {
    state: () =>
        ({
            data: [],
            loading: true,
            current: null,
            total: 0,
            count: 0,
            pages: 0,
            page: 0,
            limit: 0,
        }) as KonarrSecurityAlerts,

    actions: {
        async getAlert(id?: number) {
            if (!id) {
                // TODO: Get ID from URL
                this.current = parseInt(window.location.pathname.split("/").pop()!);
            } else {
                this.current = id;
            }

            let result = this.data.find((dep) => dep.id === this.current);
            if (!result) {
                await this.fetchDependency(this.current, snapshot);
            }
        },

        async fetchAlerts(page: number = 0, limit: number = 24, severity?: string) {
            var params = `page=${page}&limit=${limit}`;
            if (severity) {
                params += "&severity=" + severity;
            }

            await client
                .get(`/security?${params}`)
                .then((response) => {
                    this.loading = false;
                    this.data = response.data.data;

                    this.total = response.data.total;
                    this.count = response.data.count;
                    this.pages = response.data.pages;
                    this.page = page;
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        router.push({ name: "Login" });
                    }
                });
        },
        async fetchAlert(id: number) {
            this.current = id;

            await client
                .get(`/security/${id}`)
                .then((response) => {
                    this.loading = false;
                    this.data.push(response.data);
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        router.push({ name: "Login" });
                    }
                });
        },
        async fetchNextPage() {
            const sselect = router.currentRoute.value.query.select;
            const top = sselect === undefined

            if (this.page < this.pages) {
                if (this.current) {
                    await this.fetchAlerts(this.page + 1);
                }
                else {
                    await this.fetchAlerts(this.page + 1, 24, top, sselect);
                    router.push({ query: { page: this.page + 1, select: sselect } });
                }
            }
        },

        async fetchPrevPage() {
            const sselect = router.currentRoute.value.query.select;
            const top = sselect === undefined

            if (this.page !== 0) {
                if (this.current) {
                    await this.fetchAlerts(this.page - 1);
                } else {
                    await this.fetchAlerts(this.page - 1, 24, top, sselect);
                    if (this.isFirstPage()) {
                        // Remove page if first
                        router.push({ query: { page: undefined, select: sselect } });
                    } else {
                        router.push({ query: { page: this.page + 1, select: sselect } });
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