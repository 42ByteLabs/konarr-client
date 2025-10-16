// https://v3.router.vuejs.org/
import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
// Auth Views
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
// Project Views
import ProjectsView from "@/views/projects/ProjectsView.vue";
import ProjectView from "@/views/projects/ProjectView.vue";
import ProjectNew from "@/views/projects/ProjectNew.vue";
import ProjectEdit from "@/views/projects/ProjectEdit.vue";
// Dependency Views
import DependenciesView from "@/views/dependencies/DependenciesView.vue";
import DependencyView from "@/views/dependencies/DependencyView.vue";
// Security Views
import SecurityView from "@/views/SecurityView.vue";
import SecurityAlertView from "@/views/SecurityAlertView.vue";
// Admin Views
import AdminView from "@/views/admin/AdminView.vue";
import AdminUsersView from "@/views/admin/AdminUsersView.vue";
import AdminSecurityView from "@/views/admin/AdminSecurityView.vue";
import AdminAgentsView from "@/views/admin/AdminAgentsView.vue";

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
      component: RegisterView,
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
    // Project tab routes (route updates will keep the same ProjectView component)
    {
      path: "/projects/:id/security",
      name: "Project Security",
      component: ProjectView,
    },
    {
      path: "/projects/:id/dependencies",
      name: "Project Dependencies",
      component: ProjectView,
    },
    {
      path: "/projects/:id/setup",
      name: "Project Setup",
      component: ProjectView,
    },
    {
      path: "/projects/:project_id/dependencies/:dep_id",
      name: "Project Dependency",
      component: DependencyView,
    },
    {
      path: "/projects/new",
      name: "New Project",
      component: ProjectNew,
    },
    {
      path: "/projects/:id/edit",
      name: "Edit Project",
      component: ProjectEdit,
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
      component: SecurityView,
    },
    {
      path: "/security/:id",
      name: "Alert",
      component: SecurityAlertView,
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
      path: "/admin/security",
      name: "Admin Security",
      component: AdminSecurityView,
    },
    {
      path: "/admin/agents",
      name: "Admin Agents",
      component: AdminAgentsView,
    },
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
  { name: "Home", current: false },
  { name: "Projects", current: false },
  { name: "Dependencies", current: false },
  { name: "Security", current: false },
];

export default router;
