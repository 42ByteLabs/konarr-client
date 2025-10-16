import { defineStore } from "pinia";
import client from "@/client";
import { handleErrors } from "@/stores/utils";
import type { KonarrSnapshot } from "@/types";

export const useSnapshotsStore = defineStore("snapshots", {
  state: (): { loading: boolean; snapshot: KonarrSnapshot | null } => ({
    loading: false,
    snapshot: null,
  }),

  actions: {
    async getById(snapshotId: number): Promise<KonarrSnapshot | null> {
      this.loading = true;
      await client
        .get(`/snapshots/${snapshotId}`)
        .then((response) => {
          this.loading = false;
          this.snapshot = response.data as KonarrSnapshot;
        })
        .catch((error) => {
          handleErrors(error);
          throw error;
        });
      return this.snapshot;
    },

    async create(projectId: number): Promise<KonarrSnapshot | null> {
      this.loading = true;

      await client
        .post("/snapshots", {
          project_id: projectId,
        })
        .then((response) => {
          this.loading = false;
          this.snapshot = response.data as KonarrSnapshot;
        })
        .catch((error) => {
          handleErrors(error);
          throw error;
        });
      return this.snapshot;
    },

    async uploadSbom(projectId: number, file: File) {
      this.loading = true;
      let snapshotId = null;

      // TODO: file validation

      if (this.snapshot && this.snapshot.status === "Failed") {
        snapshotId = this.snapshot.id;
      } else {
        const snapshot = await this.create(projectId);
        if (!snapshot) {
          throw new Error("Snapshot creation failed");
        }
        snapshotId = snapshot.id;
      }

      await client
        .request({
          method: "POST",
          url: `/snapshots/${snapshotId}/bom`,
          data: await file.text(),
          headers: {
            "Content-Type": "application/octet-stream",
          },
        })
        .then((response) => {
          this.loading = false;
          this.snapshot = response.data as KonarrSnapshot;
        })
        .catch((error) => {
          handleErrors(error);
          throw error;
        });
      return this.snapshot;
    },
  },
});
