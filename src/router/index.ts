import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import ProjectsView from "@/views/ProjectsView.vue";
import ProjectView from "@/views/ProjectView.vue";
import ProjectNew from "@/views/ProjectNew.vue";
import DependenciesView from "@/views/DependenciesView.vue";
import DependencyView from "@/views/DependencyView.vue";
import SecurityView from "@/views/SecurityView.vue";
// Admin Views
import AdminView from "@/views/AdminView.vue";
import AdminUsersView from "@/views/AdminUsersView.vue";
import AdminAgentsView from "@/views/AdminAgentsView.vue";

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "Home",
            component: HomeView,
        },
        {
            path: "/login",
            name: "Login",
            component: LoginView,
        },
        {
            path: "/register",
            name: "Register",
            component: RegisterView
        },
        {
            path: "/projects",
            name: "Projects",
            component: ProjectsView,
        },
        {
            path: "/projects/:id",
            name: "Project",
            component: ProjectView,
        },
        {
            path: "/projects/:project_id/dependencies/:dep_id",
            name: "Project Dependency",
            component: DependencyView,
        },
        {
            "path": "/projects/new",
            "name": "New Project",
            component: ProjectNew,
        },
        {
            "path": "/projects/:id/edit",
            "name": "Edit Project",
            component: ProjectNew
        },
        {
            path: "/dependencies",
            name: "Dependencies",
            component: DependenciesView,
        },
        {
            path: "/dependencies/:id",
            name: "Dependency",
            component: DependencyView,
        },
        {
            path: "/security",
            name: "Security",
            component: SecurityView
        },
        {
            path: "/admin",
            name: "Admin",
            component: AdminView,
        },
        {
            path: "/admin/users",
            name: "Admin Users",
            component: AdminUsersView,
        },
        {
            path: "/admin/agents",
            name: "Admin Agents",
            component: AdminAgentsView,
        }
    ],
});

router.beforeEach((to, from, next) => {
    // Update the current navigation item
    navigation.forEach((item) => {
        item.current = item.name === to.name;
    });
    next();
});

export const navigation = [
    { name: "Projects", current: false },
    { name: "Dependencies", current: false },
    { name: "Security", current: false },
];

export default router;
