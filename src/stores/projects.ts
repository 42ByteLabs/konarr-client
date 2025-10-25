import { defineStore } from "pinia";
import client from "@/client";
import { handleErrors } from "@/stores/utils";

import router from "@/router";
import type { Projects, Project } from "@/types";

export const useProjectsStore = defineStore("projects", {
  state: () =>
    ({
      data: [],
      loading: true,
      current: null,
      count: 0,
      total: 0,
      pages: 0,
      page: 0,
      limit: 0,
    }) as Projects,

  actions: {
    async fetchProjects(
      page: number = 0,
      limit: number = 24,
      top: boolean = true,
      select?: string
    ) {
      this.page = page;

      let params = `page=${page}&limit=${limit}`;
      if (top) {
        params += "&top=true";
      }
      if (select !== undefined) {
        params += `&select=${select}`;
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
          handleErrors(error);
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
          handleErrors(error);
        });
    },

    async getCurrentProject(id?: number) {
      // Determine project id from argument or from the router's current route params
      let projectId: number | undefined;
      if (id !== undefined && id !== null) {
        projectId = id;
      } else {
        // router.currentRoute is a reactive ref; read the params safely
        const route = router.currentRoute && (router.currentRoute as any).value;
        const raw =
          route?.params?.id ??
          route?.params?.project_id ??
          route?.params?.projectId;
        if (raw !== undefined) {
          projectId = parseInt(String(raw));
          if (Number.isNaN(projectId)) projectId = undefined;
        }
      }

      if (!projectId) return;

      this.current = projectId;

      const result = this.data.find((project) => project.id === this.current);
      if (!result) {
        await this.fetchProject(this.current);
      }
    },

    async fetchProject(id: number, parents: boolean = false) {
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
          handleErrors(error);
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

    async fetchParents(): Promise<Project[] | undefined> {
      try {
        const response = await client.get("/projects?parents=true");
        const index = this.data.findIndex((p) => p.id === this.current);
        if (index !== -1) {
          this.data[index]["parents"] = response.data.data;
        }
        return response.data.data;
      } catch (error) {
        handleErrors(error);
        return undefined;
      }
    },

    // Fetch a global parents list (used by the New Project view)
    async fetchParentsList(): Promise<any[]> {
      try {
        const response = await client.get("/projects?parents=true");
        return response.data?.data || [];
      } catch (error) {
        handleErrors(error);
        return [];
      }
    },

    async create(
      name: string,
      type: string,
      description?: string,
      parent?: number
    ) {
      await client
        .post("/projects", { name, type, description, parent })
        .then((response) => {
          this.data.push(response.data);
          router.push({ name: "Project", params: { id: response.data.id } });
        })
        .catch((error) => {
          handleErrors(error);
        });
    },

    async update(project: Project) {
      console.log("Update Project", project);

      await client
        .patch(`/projects/${project.id}`, project)
        .then((response) => {
          // Replace the project in the data array
          const index = this.data.findIndex((p) => p.id === project.id);
          this.data[index] = response.data;
          router.push({ name: "Project", params: { id: project.id } });
        })
        .catch((error) => {
          handleErrors(error);
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
          handleErrors(error);
        });
    },
  },
});
