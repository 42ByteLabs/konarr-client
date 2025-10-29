<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView } from "vue-router";

import NavBar from "@/components/NavBar.vue";
import Footer from "@/components/Footer.vue";
import { useServerStore } from "@/stores/server";

const server = useServerStore();

onMounted(() => {
  // Dark mode
  var darkMode: string | boolean | null = localStorage.getItem("dark-mode");
  if (darkMode === null) {
    darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  document.documentElement.className =
    darkMode === "true" || darkMode === true ? "dark" : "";

  server.fetchInfo();
});
</script>

<template>
  <!-- Skip Navigation Link -->
  <a
    href="#main-content"
    class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent-500 focus:text-white focus:rounded-md focus:shadow-lg"
  >
    Skip to main content
  </a>

  <header>
    <NavBar :user="server.user" />
  </header>

  <notifications
    group="auth"
    position="top center"
    width="50%"
    classes="my-notification"
  />
  <notifications
    group="app"
    position="bottom right"
    width="30%"
    classes="my-notification"
  />

  <main id="main-content" tabindex="-1">
    <RouterView />
  </main>

  <Footer :server="server" />
</template>

<style>
.my-notification {
  margin: 0 5px 5px !important;
  padding: 16px 20px !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  color: #ffffff !important;
  border-radius: 12px !important;
  -webkit-backdrop-filter: blur(12px) !important;
  backdrop-filter: blur(12px) !important;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.08) !important;
  border: 1px solid rgba(255, 255, 255, 0.18) !important;
  position: relative !important;
  overflow: hidden !important;
  animation:
    slideIn 0.3s ease-out,
    pulse 0.5s ease-in-out !important;

  /* Default info/primary style */
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.75) 0%,
    rgba(37, 99, 235, 0.8) 100%
  ) !important;
  border-left: 4px solid #3b82f6;

  /* Animated gradient shimmer effect */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    animation: shimmer 2s infinite;
  }

  /* Close button styling */
  .notification-close {
    opacity: 0.8;
    transition: opacity 0.2s ease;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));

    &:hover {
      opacity: 1;
      transform: scale(1.1);
    }
  }

  &.success {
    background: linear-gradient(
      135deg,
      rgba(16, 185, 129, 0.75) 0%,
      rgba(5, 150, 105, 0.8) 100%
    ) !important;
    border-left: 4px solid #10b981;
    box-shadow:
      0 8px 32px rgba(16, 185, 129, 0.25),
      0 2px 8px rgba(16, 185, 129, 0.15);

    &::after {
      content: "";
      position: absolute;
      top: 50%;
      left: -2px;
      width: 4px;
      height: 60%;
      transform: translateY(-50%);
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.8),
        transparent
      );
      border-radius: 2px;
    }
  }

  &.warn {
    background: linear-gradient(
      135deg,
      rgba(251, 146, 60, 0.75) 0%,
      rgba(249, 115, 22, 0.8) 100%
    ) !important;
    border-left: 4px solid #fb923c;
    box-shadow:
      0 8px 32px rgba(251, 146, 60, 0.25),
      0 2px 8px rgba(251, 146, 60, 0.15);

    &::after {
      content: "";
      position: absolute;
      top: 50%;
      left: -2px;
      width: 4px;
      height: 60%;
      transform: translateY(-50%);
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.8),
        transparent
      );
      border-radius: 2px;
    }
  }

  &.error {
    background: linear-gradient(
      135deg,
      rgba(239, 68, 68, 0.75) 0%,
      rgba(220, 38, 38, 0.8) 100%
    ) !important;
    border-left: 4px solid #ef4444;
    box-shadow:
      0 8px 32px rgba(239, 68, 68, 0.25),
      0 2px 8px rgba(239, 68, 68, 0.15);
    animation:
      slideIn 0.3s ease-out,
      shake 0.5s ease-in-out;

    &::after {
      content: "";
      position: absolute;
      top: 50%;
      left: -2px;
      width: 4px;
      height: 60%;
      transform: translateY(-50%);
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.8),
        transparent
      );
      border-radius: 2px;
    }
  }

  /* Hover effect */
  &:hover {
    transform: translateY(-2px);
    box-shadow:
      0 12px 40px rgba(0, 0, 0, 0.18),
      0 4px 12px rgba(0, 0, 0, 0.12);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

/* Animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-4px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(4px);
  }
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

/* Notification container - ensure no background */
.vue-notification-group {
  background: transparent !important;
  backdrop-filter: none !important;
}

.vue-notification-wrapper {
  background: transparent !important;
  backdrop-filter: none !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* Override any default notification styles */
.notifications {
  background: transparent !important;
}

.notification-wrapper {
  background: transparent !important;
}

.notification {
  background: transparent !important;
}

/* Dark mode support */
.dark .my-notification {
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 2px 8px rgba(0, 0, 0, 0.2);

  &.success {
    box-shadow:
      0 8px 32px rgba(16, 185, 129, 0.35),
      0 2px 8px rgba(16, 185, 129, 0.2);
  }

  &.warn {
    box-shadow:
      0 8px 32px rgba(251, 146, 60, 0.35),
      0 2px 8px rgba(251, 146, 60, 0.2);
  }

  &.error {
    box-shadow:
      0 8px 32px rgba(239, 68, 68, 0.35),
      0 2px 8px rgba(239, 68, 68, 0.2);
  }
}
</style>
