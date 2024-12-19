import { defineStore } from "pinia";
import client from "@/client";
import { handleErrors } from "@/stores/utils";

import type { KonarrDependencies } from "@/types";
import router from "@/router";

export const useDependenciesStore = defineStore("dependencies", {
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
        }) as KonarrDependencies,

    actions: {
        // Set the snapshot ID
        setSnapshot(snapid: number) {
            this.current = snapid;
        },

        async getDependency(id?: number, snapshot?: number) {
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

        async fetchDependencies(page: number = 0, limit: number = 10, top: boolean = true, deptype?: string = null) {
            // Get from URL if null
            if (deptype === undefined) {
                deptype = router.currentRoute.value.query.select;
            }

            var params = `page=${page}&limit=${limit}`;
            if (top) {
                params += "&top=true";
            }
            if (deptype) {
                params += `&deptype=${deptype}`;
            }

            if (this.current === 0) {
                await client
                    .get(`/dependencies?${params}`)
                    .then((response) => {
                        this.loading = false;
                        this.data = response.data.data;

                        this.total = response.data.total;
                        this.count = response.data.count;
                        this.pages = response.data.pages;
                        this.page = page;
                    })
                    .catch((error) => {
                        handleErrors(error);
                    });
            } else {
                await client
                    .get(
                        `/snapshots/${this.current}/dependencies?${params}`,
                    )
                    .then((response) => {
                        this.loading = false;
                        this.data = response.data.data;

                        this.total = response.data.total;
                        this.count = response.data.count;
                        this.pages = response.data.pages;
                        this.page = page;
                    })
                    .catch((error) => {
                        handleErrors(error);
                    });
            }
        },

        async searchDependencies(search: string) {
            if (this.current === 0) {
                await client
                    .get(`/dependencies?search=${search}&limit=24`)
                    .then((response) => {
                        this.loading = false;
                        this.data = response.data.data;
                        this.count = response.data.count;
                    })
                    .catch((error) => {
                        handleErrors(error);
                    });
            } else {
                await client
                    .get(
                        `/snapshots/${this.current}/dependencies?search=${search}&limit=10`,
                    )
                    .then((response) => {
                        this.loading = false;
                        this.data = response.data.data;
                    })
                    .catch((error) => {
                        handleErrors(error);
                    });
            }
        },

        async fetchDependency(id: number, snapshot?: number) {
            this.current = id;

            // Optional snapshot
            let params = "";
            if (!isNaN(snapshot)) {
                params += `snapshot=${snapshot}`
            }
    
            await client
                .get(`/dependencies/${this.current}?${params}`)
                .then((response) => {
                    this.loading = false;
                    // If the item already exists, resplce it or push it 
                    const index = this.data.findIndex((item) => item.id === this.current);
                    if (index !== -1) {
                        this.data[index] = response.data;
                    } else {
                        this.data.push(response.data);
                    }
                })
                .catch((error) => {
                    handleErrors(error);
                });
        },

        async fetchNextPage() {
            const sselect = router.currentRoute.value.query.select;
            const top = sselect === undefined

            if (this.page < this.pages) {
                if (this.current) {
                    await this.fetchDependencies(this.page + 1);
                }
                else {
                    await this.fetchDependencies(this.page + 1, 24, top, sselect);
                    router.push({ query: { page: this.page + 1, select: sselect } });
                }
            }
        },

        async fetchPrevPage() {
            const sselect = router.currentRoute.value.query.select;
            const top = sselect === undefined

            if (this.page !== 0) {
                if (this.current) {
                    await this.fetchDependencies(this.page - 1);
                } else {
                    await this.fetchDependencies(this.page - 1, 24, top, sselect);
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
