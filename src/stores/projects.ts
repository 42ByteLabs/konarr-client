import { defineStore } from "pinia";
import client from "@/client";
import { handleErrors, handleApiResponse } from "@/stores/utils";

import router from "@/router";
import type { Projects, Project, ProjectsResponse, ApiResponse } from "@/types";

export const useProjectsStore = defineStore("projects", {
  state: () => ({
    data: {
      data: [] as Project[],
      total: 0,
      pages: 0,
      count: 0,
      limit: 24,
    } as Projects,
    loading: true,
    current: null as number | null,
    page: 0,
  }),

  getters: {
    projects(state): Project[] {
      return state.data.data;
    },
    pages(state): number {
      return state.data.pages;
    },
    count(state): number {
      return state.data.count;
    },
    total(state): number {
      return state.data.total;
    },
  },

  actions: {
    find(p: number | null): Project | undefined {
      if (p === null) return undefined;
      return this.data.data.find((project) => project.id === p);
    },

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
        .get<ProjectsResponse>(`/projects?${params}`)
        .then((response) => {
          const data = handleApiResponse(response.data);
          if (data) {
            this.data = data;
          }
          this.loading = false;
        })
        .catch((error) => {
          handleErrors(error);
          this.loading = false;
        });
    },

    async searchProjects(search: string) {
      await client
        .get<ProjectsResponse>(`/projects?search=${search}&limit=24`)
        .then((response) => {
          const data = handleApiResponse(response.data);
          if (data) {
            this.data = data;
          }
          this.loading = false;
        })
        .catch((error) => {
          handleErrors(error);
          this.loading = false;
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

      const result = this.data.data.find(
        (project) => project.id === this.current
      );
      if (!result) {
        await this.fetchProject(this.current);
      }
    },

    async fetchProject(id: number, parents: boolean = false) {
      await client
        .get<ApiResponse<Project>>(`/projects/${id}`)
        .then(async (response) => {
          const project = handleApiResponse(response.data);
          if (project) {
            this.data.data.push(project);
            this.current = id;
          }
          this.loading = false;

          if (parents) {
            await this.fetchParents();
          }
        })
        .catch((error) => {
          handleErrors(error);
          this.loading = false;
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
        const response = await client.get<ProjectsResponse>(
          "/projects?parents=true"
        );
        const data = handleApiResponse(response.data);
        if (data) {
          const index = this.data.data.findIndex((p) => p.id === this.current);
          if (index !== -1) {
            this.data.data[index]["parents"] = data.data;
          }
          return data.data;
        }
        return undefined;
      } catch (error) {
        handleErrors(error);
        return undefined;
      }
    },

    // Fetch a global parents list (used by the New Project view)
    async fetchParentsList(): Promise<any[]> {
      try {
        const response = await client.get<ProjectsResponse>(
          "/projects?parents=true"
        );
        const data = handleApiResponse(response.data);
        return data?.data || [];
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
        .post<ApiResponse<Project>>("/projects", {
          name,
          type,
          description,
          parent,
        })
        .then((response) => {
          const project = handleApiResponse(response.data);
          if (project) {
            this.data.data.push(project);
            router.push({ name: "Project", params: { id: project.id } });
          }
        })
        .catch((error) => {
          handleErrors(error);
        });
    },

    async update(project: Project) {
      console.log("Update Project", project);

      await client
        .patch<ApiResponse<Project>>(`/projects/${project.id}`, project)
        .then((response) => {
          const updatedProject = handleApiResponse(response.data);
          if (updatedProject) {
            // Replace the project in the data array
            const index = this.data.data.findIndex((p) => p.id === project.id);
            this.data.data[index] = updatedProject;
            router.push({ name: "Project", params: { id: project.id } });
          }
        })
        .catch((error) => {
          handleErrors(error);
        });
    },

    async delete(id: number) {
      await client
        .delete(`/projects/${id}`)
        .then(() => {
          this.data.data = this.data.data.filter(
            (project) => project.id !== id
          );
          router.push({ name: "Projects" });
        })
        .catch((error) => {
          handleErrors(error);
        });
    },
  },
});
