import { defineStore } from "pinia";
import client from "@/client";
import { handleErrors, handleApiResponse } from "@/stores/utils";

import type {
  Dependencies,
  Dependency,
  DependenciesResponse,
  DependencyResponse,
} from "@/types";
import router from "@/router";

export const useDependenciesStore = defineStore("dependencies", {
  state: () => ({
    data: {
      data: [] as Dependency[],
      pages: 0,
      total: 0,
      count: 0,
    } as Dependencies,
    loading: true,
    page: 0,
    limit: 24,
    current: null as number | null,
  }),

  getters: {
    dependencies(state): Dependency[] {
      return state.data.data;
    },
    pages(state): number {
      return state.data.pages;
    },
    total(state): number {
      return state.data.total;
    },
    count(state): number {
      return state.data.count;
    },
  },
  actions: {
    // Set the snapshot ID
    setSnapshot(snapid: number) {
      this.current = snapid;
    },

    find(d: number | null): Dependency | undefined {
      if (d === null) return undefined;
      return this.data.data.find((dep) => dep.id === d);
    },

    async getDependency(id?: number, snapshot?: number) {
      if (!id) {
        // TODO: Get ID from URL
        this.current = parseInt(window.location.pathname.split("/").pop()!);
      } else {
        this.current = id;
      }

      const result = this.data.data.find((dep) => dep.id === this.current);
      if (!result) {
        await this.fetchDependency(this.current, snapshot);
      }
    },

    async fetchDependencies(
      page: number = 0,
      limit: number = 12,
      deptype: string | undefined = undefined,
    ) {
      this.loading = true;
      // Get from URL if null
      if (deptype === undefined) {
        const selectParam = router.currentRoute.value.query.select;
        deptype = Array.isArray(selectParam)
          ? selectParam[0] || undefined
          : selectParam || "top";
      }

      let params = `page=${page}&limit=${limit}`;
      if (deptype) {
        params += `&select=${deptype}`;
      }

      if (this.current === 0) {
        await client
          .get<DependenciesResponse>(`/dependencies?${params}`)
          .then((response) => {
            const data = handleApiResponse(response.data);
            if (data) {
              this.data = data;
            }
          })
          .catch((error) => {
            handleErrors(error);
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        await client
          .get<DependenciesResponse>(
            `/snapshots/${this.current}/dependencies?${params}`,
          )
          .then((response) => {
            const data = handleApiResponse(response.data);
            if (data) {
              this.data = data;
            }
          })
          .catch((error) => {
            handleErrors(error);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },

    async searchDependencies(search: string) {
      if (this.current === 0) {
        await client
          .get<DependenciesResponse>(`/dependencies?search=${search}&limit=24`)
          .then((response) => {
            const data = handleApiResponse(response.data);
            if (data) {
              this.data = data;
            }
          })
          .catch((error) => {
            handleErrors(error);
          })
          .finally(() => {
            this.loading = false;
          });
      } else {
        await client
          .get<DependenciesResponse>(
            `/snapshots/${this.current}/dependencies?search=${search}&limit=10`,
          )
          .then((response) => {
            const data = handleApiResponse(response.data);
            if (data) {
              this.data = data;
            }
          })
          .catch((error) => {
            handleErrors(error);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },

    async fetchDependency(id: number, snapshot?: number) {
      this.current = id;

      // Optional snapshot
      let params = "";
      if (snapshot !== undefined && !isNaN(snapshot)) {
        params += `snapshot=${snapshot}`;
      }

      await client
        .get<DependencyResponse>(`/dependencies/${this.current}?${params}`)
        .then((response) => {
          const dependency = handleApiResponse(response.data);
          if (dependency) {
            // If the item already exists, replace it or push it
            const index = this.data.data.findIndex(
              (item) => item.id === this.current,
            );
            if (index !== -1) {
              this.data.data[index] = dependency;
            } else {
              this.data.data.push(dependency);
            }
          }
        })
        .catch((error) => {
          handleErrors(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    async fetchNextPage(limit?: number) {
      if (this.page < this.pages) {
        if (this.current) {
          await this.fetchDependencies(this.page + 1, limit, "top");
        } else {
          const selectParam = router.currentRoute.value.query.select;
          const sselectStr = Array.isArray(selectParam)
            ? selectParam[0] || undefined
            : selectParam || undefined;
          await this.fetchDependencies(this.page + 1, 24, sselectStr);
          router.push({ query: { page: this.page + 1, select: sselectStr } });
        }
      }
    },

    async fetchPrevPage(limit?: number) {
      const selectParam = router.currentRoute.value.query.select;
      const sselectStr = Array.isArray(selectParam)
        ? selectParam[0] || undefined
        : selectParam || undefined;

      if (this.page !== 0) {
        if (this.current) {
          await this.fetchDependencies(this.page - 1, limit, "top");
        } else {
          await this.fetchDependencies(this.page - 1, 24, sselectStr);
          if (this.isFirstPage()) {
            // Remove page if first
            router.push({ query: { page: undefined, select: sselectStr } });
          } else {
            router.push({ query: { page: this.page + 1, select: sselectStr } });
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
