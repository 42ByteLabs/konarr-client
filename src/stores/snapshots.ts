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

      // File validation
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      const allowedMimeTypes = [
        "application/json",
        "application/xml",
        "text/xml",
        "text/json"
      ];
      const allowedExtensions = [".json", ".xml"];

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        this.loading = false;
        throw new Error("File size exceeds the 5MB limit.");
      }

      // Check MIME type
      const fileTypeValid = allowedMimeTypes.includes(file.type);
      // Check extension
      const fileName = file.name.toLowerCase();
      const fileExtensionValid = allowedExtensions.some(ext => fileName.endsWith(ext));

      if (!fileTypeValid && !fileExtensionValid) {
        this.loading = false;
        throw new Error("Invalid file type. Only .json and .xml files are allowed.");
      }
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
            "Content-Type": file.type || "application/octet-stream",
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
