<script setup lang="ts">
import { onMounted, computed, onUpdated } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import {
  mdiPencil,
  mdiArchive,
  mdiCloudOffOutline,
  mdiCloudCheckOutline,
} from "@mdi/js";
import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";

const md = new MarkdownIt();

import type { Project } from "@/types";

import Title from "@/components/Title.vue";
import ProjectIcon from "@/components/ProjectIcon.vue";
import ProjectInfo from "@/components/ProjectInfo.vue";
import ProjectTile from "@/components/ProjectTile.vue";
import ProjectNav from "@/components/ProjectNav.vue";
import ProjectSummary from "@/views/projects/ProjectSummary.vue";
import ProjectSecurity from "@/views/projects/ProjectSecurity.vue";
import ProjectDependencies from "@/views/projects/ProjectDependencies.vue";
import ProjectSetup from "@/views/projects/ProjectSetup.vue";
import SbomUpload from "@/components/SbomUpload.vue";

import { useProjectsStore } from "@/stores/projects";
import { useServerStore } from "@/stores/server";
import { useRoute } from "vue-router";

const props = defineProps<{
  id?: number;
}>();

const projects = useProjectsStore();
const server = useServerStore();

onUpdated(() => {
  projects.getCurrentProject(props.id);
});

onMounted(() => {
  projects.getCurrentProject(props.id);
});

let project = computed(() => {
  return projects.projects.find((p: Project) => p.id === projects.current);
});

let title = computed(() => {
  return project.value?.title || project.value?.name || "";
});

const description = computed(() => {
  const result = md.render(project.value?.description || "");
  return DOMPurify.sanitize(result);
});

const route = useRoute();

// derive active tab from route path (e.g., /projects/:id/security)
const activeTab = computed(() => {
  if (route.path.includes("/security")) return "security";
  if (route.path.includes("/dependencies")) return "dependencies";
  if (route.path.includes("/setup")) return "setup";
  return "summary";
});

const subviewComponent = computed(() => {
  switch (activeTab.value) {
    case "summary":
      return ProjectSummary;
    case "dependencies":
      return ProjectDependencies;
    case "setup":
      return ProjectSetup;
    default:
      return ProjectSecurity;
  }
});

let container_sha = computed(() => {
  // Truncate the container sha to 12 characters
  if (
    project.value?.snapshot !== undefined &&
    project.value.snapshot.metadata["container.sha"] !== undefined
  ) {
    var sha = project.value.snapshot.metadata["container.sha"].replace(
      "sha256:",
      "",
    );
    return sha.substring(0, 12);
  } else {
    return "";
  }
});
</script>

<template>
  <main>
    <div v-if="project" class="container mt-4 mb-6 px-2 w-full mx-auto">
      <div class="grid grid-cols-6 md:gap-2 w-full mx-auto">
        <div
          class="col-span-6 md:col-span-2 bg-white dark:bg-gray-900 dark:text-white shadow-md rounded-lg p-4 mb-4 md:mb-0"
        >
          <div class="flex flex-col items-center pb-6 pt-2">
            <!-- Project Icons -->
            <div class="grid grid-cols-6 w-full mb-6">
              <div class="col-span-3 flex justify-center">
                <svg-icon
                  v-if="project.status"
                  type="mdi"
                  :path="mdiCloudCheckOutline"
                  :size="86"
                  class="text-sec-information-400"
                >
                </svg-icon>
                <svg-icon
                  v-else
                  type="mdi"
                  :path="mdiCloudOffOutline"
                  :size="86"
                  class="text-error-400"
                >
                </svg-icon>
              </div>
              <div class="col-span-3 flex justify-center">
                <ProjectIcon :type="project.type" size="86" />
              </div>
            </div>
            <h2 class="text-4xl mt-2 text-center">
              {{ title }}
            </h2>

            <div
              v-if="description"
              class="text-center text-gray-600 dark:text-white text-sm my-2"
              v-html="description"
            />

            <div v-if="project.type === 'Container' && project.snapshot">
              <ProjectInfo
                name="Container Image"
                :value="project.snapshot.metadata['container.image']"
              />

              <ProjectInfo name="Container SHA(256)" :value="container_sha" />

              <ProjectInfo
                name="Tool"
                :value="
                  project.snapshot.metadata['bom.tool.name'] ||
                  project.snapshot.metadata['bom.tool']
                "
                :version="project.snapshot.metadata['bom.tool.version']"
              />

              <ProjectInfo
                name="License(s)"
                :value="project.snapshot.metadata['container.licenses']"
              />
              <ProjectInfo
                name="Author(s)"
                :value="project.snapshot.metadata['container.authors']"
              />

              <ProjectInfo
                name="Snapshot BOM Type"
                :value="project.snapshot.metadata['bom.type']"
              />
            </div>
            <div v-if="project.type === 'Server' && project.snapshot">
              <ProjectInfo
                name="Operating System"
                :value="project.snapshot.metadata.os"
                :version="project.snapshot.metadata['os.kernel']"
              />

              <ProjectInfo
                v-if="project.snapshot.metadata['container']"
                name="Container Engine"
                :value="project.snapshot.metadata['container.engine']"
                :version="project.snapshot.metadata['container.engine.version']"
              />
            </div>
          </div>
        </div>

        <div
          v-if="project.snapshot"
          class="col-span-6 md:col-span-4 bg-white dark:bg-gray-900 dark:text-white shadow-md rounded-lg p-4 mb-4 md:mb-0"
        >
          <ProjectNav
            :id="project.id"
            :project="project"
            :title="title"
            :parent="project.parent"
            edit
            :active="activeTab"
            :project-type="project.type"
          />

          <div class="mt-4">
            <!-- pass the project id explicitly to subviews that expect it -->
            <component
              :is="subviewComponent"
              :id="project.id"
              :project="project"
            />
          </div>

          <div v-if="project.children">
            <h2 class="text-2xl font-bold text-center my-6 dark:text-white">
              Subprojects - {{ project.children.length }}
            </h2>

            <div class="grid md:grid-cols-2 sm:grid-cols-1 gap-4">
              <div v-for="child in project.children" :key="child.id">
                <ProjectTile :id="child.id" :project="child" />
              </div>
            </div>
          </div>
        </div>

        <div
          v-else
          class="col-span-8 md:col-span-4 bg-white dark:bg-gray-700 shadow-md rounded-lg p-4"
        >
          <h3 class="dark:text-white text-center text-xl font-bold mt-6">
            Project has no Snapshots or Subprojects
          </h3>

          <hr class="my-6 bg-gray-400" />
          <h3 class="dark:text-white text-center text-xl font-bold mt-6">
            Setup Konarr Agent
          </h3>

          <div class="grid grid-cols-8 dark:text-white mt-8">
            <h4 class="col-span-8 sm:col-span-1 text-xl my-4 font-bold">
              Docker
            </h4>
            <div class="col-span-8 sm:col-span-7">
              <code lang="bash">
                docker run -e KONARR_INSTANCE -e KONARR_AGENT_TOKEN -e
                KONARR_PROJECT_ID -v
                "/var/run/docker.sock:/var/run/docker.sock:ro"
                ghrc.io/42bytelabs/konarr-agent:latest
              </code>
            </div>
          </div>
        </div>
        <div
          v-if="server.adminMode"
          class="col-span-6 md:col-span-2 bg-white dark:bg-gray-900 dark:text-white shadow-md rounded-lg p-4"
        >
          <h3 class="text-xl font-semibold text-center my-2">Admin Actions</h3>

          <ProjectInfo
            v-if="project.snapshot"
            name="Snapshots (ID / count)"
            :value="project.snapshot.id"
            :version="project.snapshot.id"
          />

          <ProjectInfo
            v-if="project.snapshot"
            name="Snapshots Creation"
            :value="project.snapshot.createdAt"
          />

          <!-- SBOM Upload Component -->
          <div class="mt-4">
            <SbomUpload :project-id="project.id" />
          </div>

          <!-- Edit and Delete Project Button -->
          <div class="mt-8">
            <div class="grid grid-cols-8 gap-2">
              <router-link
                :to="{ name: 'Edit Project', params: { id: project.id } }"
                class="col-span-3 col-start-2 flex justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                <svg-icon type="mdi" :path="mdiPencil"></svg-icon>
              </router-link>
              <button
                class="col-span-3 bg-red-500 hover:bg-red-700 text-white flex justify-center font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                @click="projects.delete(project.id)"
              >
                <svg-icon type="mdi" :path="mdiArchive"></svg-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="container mt-4 mb-6 w-full max-w-xs mx-auto">
      <Title
        title="Project"
        subtitle="Project not found"
        description="Please try again with a correct id"
      />
    </div>
  </main>
</template>
