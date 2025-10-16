<script setup lang="ts">
import { ref } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiUpload, mdiFileDocument } from "@mdi/js";
import { useSnapshotsStore } from "@/stores/snapshots";

const props = defineProps<{
  projectId: number;
}>();

const snapshots = useSnapshotsStore();
const selectedFile = ref<File | null>(null);
const uploading = ref(false);
const uploadError = ref<string | null>(null);

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0];
    uploadError.value = null;
  }
};

const handleUpload = async () => {
  if (!selectedFile.value) {
    uploadError.value = "Please select a file first";
    return;
  }

  uploading.value = true;
  uploadError.value = null;

  try {
    await snapshots.uploadSbom(props.projectId, selectedFile.value);
    selectedFile.value = null;
    // Reset file input
    const fileInput = document.getElementById("sbom-file-input") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  } catch (error) {
    uploadError.value = error instanceof Error ? error.message : "Failed to upload SBOM";
  } finally {
    uploading.value = false;
  }
};

const triggerFileInput = () => {
  const fileInput = document.getElementById("sbom-file-input");
  fileInput?.click();
};
</script>

<template>
  <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
    <h3 class="text-xl font-semibold text-center mb-4 dark:text-white">
      Upload SBOM
    </h3>

    <div class="flex flex-col space-y-4">
      <!-- Hidden file input -->
      <input
        id="sbom-file-input"
        type="file"
        accept=".json,.xml"
        class="hidden"
        @change="handleFileSelect"
      />

      <!-- File selection display -->
      <div
        v-if="selectedFile"
        class="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded"
      >
        <div class="flex items-center space-x-2">
          <svg-icon type="mdi" :path="mdiFileDocument" :size="24" class="text-blue-500" />
          <span class="text-sm dark:text-white truncate">{{ selectedFile.name }}</span>
        </div>
        <button
          class="text-red-500 hover:text-red-700 text-sm"
          @click="selectedFile = null"
        >
          Remove
        </button>
      </div>

      <!-- Error message -->
      <div
        v-if="uploadError"
        class="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded text-sm"
      >
        {{ uploadError }}
      </div>

      <!-- Action buttons -->
      <div class="flex space-x-2">
        <button
          class="flex-1 flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="uploading"
          @click="triggerFileInput"
        >
          <svg-icon type="mdi" :path="mdiFileDocument" :size="20" class="mr-2" />
          {{ selectedFile ? "Change File" : "Select SBOM File" }}
        </button>

        <button
          v-if="selectedFile"
          class="flex-1 flex items-center justify-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="uploading || !selectedFile"
          @click="handleUpload"
        >
          <svg-icon
            v-if="!uploading"
            type="mdi"
            :path="mdiUpload"
            :size="20"
            class="mr-2"
          />
          <span v-if="uploading">Uploading...</span>
          <span v-else>Upload</span>
        </button>
      </div>

      <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
        Supported formats: CycloneDX JSON/XML
      </p>
    </div>
  </div>
</template>
