import { defineStore } from "pinia";
import client from "@/client";

import type { KonarrDependencies } from "@/types";
import router from "@/router";

export const useDependenciesStore = defineStore("dependencies", {
    state: () =>
        ({
            data: [],
            loading: true,
            current: null,
            total: 0,
            pages: 0,
            page: 0,
            limit: 0,
        }) as KonarrDependencies,

    actions: {
        // Set the snapshot ID
        setSnapshot(snapid: number) {
            this.current = snapid;
        },

        async fetchDependencies(page: number = 0, limit: number = 10, top: boolean = true, deptype?: string = null) {

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
                        this.pages = response.data.pages;
                        this.page = page;
                    })
                    .catch((error) => {
                        if (error.response.status === 401) {
                            router.push({ name: "Login" });
                        }
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
                        this.pages = response.data.pages;
                        this.page = page;
                    })
                    .catch((error) => {
                        if (error.response.status === 401) {
                            router.push({ name: "Login" });
                        }
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
                    })
                    .catch((error) => {
                        if (error.response.status === 401) {
                            router.push({ name: "Login" });
                        }
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
                        if (error.response.status === 401) {
                            router.push({ name: "Login" });
                        }
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
                    if (error.response.status === 401) {
                        router.push({ name: "Login" });
                    }
                });
        },

        async fetchNextPage() {
            if (this.page < this.pages) {
                if (this.current) {
                    await this.fetchDependencies(this.page + 1);
                }
                else {
                    await this.fetchDependencies(this.page + 1, 24);
                }
            }
        },

        async fetchPrevPage() {
            if (this.page !== 0) {
                if (this.current) {
                    await this.fetchDependencies(this.page - 1);
                } else {
                    await this.fetchDependencies(this.page - 1, 24);
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
