import { defineStore } from "pinia";
import client from "@/client";

import router from "@/router";
import type { KonarrProjects } from "@/types";

export const useProjectsStore = defineStore("projects", {
    state: () =>
        ({
            data: [],
            loading: true,
            current: null,
            total: 0,
            pages: 0,
            page: 0,
            limit: 0,
        }) as KonarrProjects,

    actions: {
        async fetchProjects(page: number = 0, limit: number = 24, top: boolean = true, select?: string) {
            this.page = page;

            var params = `page=${page}&limit=${limit}`;
            if (top) {
                params += "&top=true";
            }
            if (select !== undefined) {
                params += `&type=${select}`
            }

            await client
                .get(`/projects?${params}`)
                .then((response) => {
                    this.data = response.data.data;
                    this.total = response.data.total;
                    this.pages = response.data.pages;
                    this.loading = false;
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        router.push({ name: "Login" });
                    }
                });
        },

        async searchProjects(search: string) {
            await client
                .get(`/projects?search=${search}&limit=24`)
                .then((response) => {
                    this.data = response.data.data;
                    this.total = response.data.total;
                    this.pages = response.data.pages;
                    this.loading = false;
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        router.push({ name: "Login" });
                    }
                });
        },

        async getCurrentProject(id?: number) {
            // Get ID from the URL
            if (!id) {
                this.current = parseInt(window.location.pathname.split("/").pop()!);
            } else {
                this.current = id;
            }

            let result = this.data.find((project) => project.id === this.current);
            if (!result) {
                await this.fetchProject(this.current);
            }
        },

        async fetchProject(id: number, parents?: boolean = false) {
            await client
                .get(`/projects/${id}`)
                .then(async (response) => {
                    this.data.push(response.data);
                    this.current = id;
                    this.loading = false;

                    if (parents) {
                        await this.fetchParents();
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
                await this.fetchProjects(this.page + 1);
            }
        },

        async fetchPrevPage() {
            if (this.page > 0) {
                await this.fetchProjects(this.page - 1);
            }
        },

        async fetchParents() {
            await client
                .get("/projects?parents=true")
                .then((response) => {
                    // Update `parents` 
                    let index = this.data.findIndex((p) => p.id === this.current);
                    this.data[index]['parents'] = response.data.data;
                })
                .catch((error) => {
                    console.error("Error fetching parents", error);
                });
        },

        async create(name: string, type: string, description?: string, parent?: number) {
            await client
                .post("/projects", { name, type, description, parent })
                .then((response) => {
                    this.data.push(response.data);
                    router.push({ name: "Project", params: { id: response.data.id } });
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        router.push({ name: "Login" });
                    }
                });
        },

        async update(project: KonarrProject) {
            console.log("Update Project", project);

            await client
                .patch(`/projects/${project.id}`, project)
                .then((response) => {
                    // Replace the project in the data array
                    let index = this.data.findIndex((p) => p.id === project.id);
                    this.data[index] = response.data;
                    router.push({ name: "Project", params: { id: project.id } });
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        router.push({ name: "Login" });
                    }
                });
        },

        async delete(id: number) {
            await client
                .delete(`/projects/${id}`)
                .then(() => {
                    this.data = this.data.filter((project) => project.id !== id);
                    router.push({ name: "Projects" });
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        router.push({ name: "Login" });
                    }
                    router.push({ name: "Projects" });
                });
        },
    },
});
