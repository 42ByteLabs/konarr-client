<script setup lang="ts">
import { onMounted, computed, onUpdated } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiGraph, mdiPencil, mdiDelete } from "@mdi/js";
import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";

const md = new MarkdownIt();

import type { KonarrProject } from "@/types";

import Title from "@/components/Title.vue";
import DependenciesList from "@/components/DependenciesList.vue";
import ProjectIcon from "@/components/ProjectIcon.vue";
import ProjectInfo from "@/components/ProjectInfo.vue";
import ProjectTile from "@/components/ProjectTile.vue";
import ProjectNav from "@/components/ProjectNav.vue";
import SecuritySummary from "@/components/SecuritySummary.vue";

import { useProjectsStore } from "@/stores/projects";
import { useServerStore } from "@/stores/server";
import { useDependenciesStore } from "@/stores/dependencies";

const props = defineProps<{
    id?: number;
}>();

const projects = useProjectsStore();
const server = useServerStore();
const dependencies = useDependenciesStore();

onUpdated(() => {
    projects.getCurrentProject(props.id);
});

onMounted(() => {
    projects.getCurrentProject(props.id);
});

let project = computed(() => {
    return projects.data.find(
        (p: KonarrProject) => p.id === projects.current,
    );
});

let title = computed(() => {
    return project.value.title || project.value.name;
});

const description = computed(() => {
    const result = md.render(project.value.description || "");
    return DOMPurify.sanitize(result);
});

let container_sha = computed(() => {
    // Truncate the container sha to 12 characters
    if (project.value.snapshot !== undefined && project.value.snapshot.metadata['container.sha'] !== undefined) {
        var sha = project.value.snapshot.metadata['container.sha'].replace('sha256:', '');
        return sha.substring(0, 12);
    } else {
        return '';
    }
});

</script>

<template>
    <main>
        <div v-if="project" class="container mt-4 mb-6 w-full mx-auto">
            <div class="grid grid-cols-6 gap-2 w-full mx-auto">
                <div class="col-span-2 bg-white dark:bg-gray-800 dark:text-white shadow-md rounded-lg p-4">
                    <div class="flex flex-col items-center pb-6 pt-2">
                        <ProjectIcon :type="project.type" size="64" />
                        <h2 class="text-4xl mt-2 text-center">
                            {{ title }}
                        </h2>

                        <div v-if="description" v-html="description"
                            class="text-center text-gray-600 dark:text-white text-sm my-2">
                        </div>

                        <div v-if="project.type === 'Container' && project.snapshot">
                            <ProjectInfo :value="project.snapshot.metadata['container.image']" />
                            <!-- <ProjectInfo name="Status" :value="project.status ? 'Online' : 'Offline'" /> -->

                            <ProjectInfo name="Tool" :value="project.snapshot.metadata['bom.tool']"
                                :version="project.snapshot.metadata['bom.tool.version']" />
                            <!-- <ProjectInfo name="Container Version" -->
                            <!--     :value="project.snapshot.metadata['container.version']" /> -->
                            <ProjectInfo name="Container SHA(256)" :value="container_sha" />
                            <ProjectInfo name="License(s)" :value="project.snapshot.metadata['container.licenses']" />
                            <ProjectInfo name="Author(s)" :value="project.snapshot.metadata['container.authors']" />

                            <ProjectInfo name="Snapshot BOM Type" :value="project.snapshot.metadata.bom"
                                :version="project.snapshot.metadata.bom_version" />
                        </div>
                        <div v-if="project.type === 'Server' && project.snapshot">
                            <ProjectInfo name="Operating System" :value="project.snapshot.metadata.os"
                                :version="project.snapshot.metadata['os.kernel']" />

                            <ProjectInfo v-if="project.snapshot.metadata['container']" name="Container Engine"
                                :value="project.snapshot.metadata['container.engine']"
                                :version="project.snapshot.metadata['container.engine.version']" />
                        </div>
                    </div>
                </div>
                <div v-if="project.snapshot && project.snapshot.dependencies"
                    class="col-span-4 bg-white dark:bg-gray-800 dark:text-white shadow-md rounded-lg p-4">

                    <ProjectNav :title="title" :id="project.id" :parent="project.parent" />

                    <SecuritySummary :summary="project.snapshot.security" :snapshot="project.snapshot.id" />

                    <hr class="my-6 bg-gray-400" />

                    <DependenciesList :snapid="project.snapshot.id" :projectid="project.id"
                        :total="project.snapshot.dependencies" />
                </div>
                <div v-else-if="project.children"
                    class="col-span-4 bg-white dark:bg-gray-800 dark:text-white shadow-md rounded-lg p-4">

                    <ProjectNav :title="title" :id="project.id" :parent="project.parent" />

                    <SecuritySummary :summary="project.snapshot.security" :snapshot="project.snapshot.id" />

                    <h2 class="text-2xl font-bold text-center my-6 dark:text-white">
                        Subprojects - {{ project.children.length }}
                    </h2>

                    <div class="grid grid-cols-2 gap-2">
                        <div v-for="child in project.children" :key="child.id">
                            <ProjectTile :project="child" :id="child.id" />
                        </div>
                    </div>
                </div>
                <div v-else class="col-span-4 bg-white dark:bg-gray-700 shadow-md rounded-lg p-4">
                    <h3 class="dark:text-white text-center text-xl font-bold mt-6">
                        Project has no Snapshots or Subprojects
                    </h3>
                </div>
                <div v-if="server.user.role === 'admin'"
                    class="col-span-2 bg-white dark:bg-gray-800 dark:text-white shadow-md rounded-lg p-4">
                    <h3 class="text-xl font-semibold text-center my-2">Admin Actions</h3>
                    <!-- Delete Project Button -->
                    <div class="mt-4">
                        <div class="grid grid-cols-2 gap-2">
                            <router-link :to="{ name: 'Edit Project', params: { id: project.id } }"
                                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                <svg-icon type="mdi" :path="mdiPencil"></svg-icon>
                            </router-link>
                            <button
                                class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                @click="projects.delete(project.id)">
                                <svg-icon type="mdi" :path="mdiDelete"></svg-icon>
                            </button>
                        </div>
                    </div>
                    <ProjectInfo v-if="project.snapshot" name="Snapshots (ID / count)" :value="project.snapshot.id"
                        :version="project.snapshots" />
                </div>
            </div>
        </div>
        <div v-else class="container mt-4 mb-6 w-full max-w-xs mx-auto">
            <Title title="Project" subtitle="Project not found" description="Please try again with a correct id" />
        </div>
    </main>
</template>
