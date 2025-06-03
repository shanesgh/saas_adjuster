// import { createRouter } from "@tanstack/react-router";
// import { createRootRoute, createRoute } from "@tanstack/react-router";
// import { HomeLoginPage } from "./pages/home-login";
// import { DashboardPage } from "./pages/dashboard";
// import { ErrorPage } from "./pages/error";
// import { RootLayout } from "./components/layouts/root-layout";
// import { AuthGuard } from "./components/auth/auth-guard";

// const rootRoute = createRootRoute({
//   component: RootLayout,
// });

// const indexRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: "/",
//   component: HomeLoginPage,
// });

// const dashboardRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: "/dashboard",
//   component: () => (
//     <AuthGuard>
//       <DashboardPage />
//     </AuthGuard>
//   ),
// });

// const errorRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: "/error",
//   component: ErrorPage,
// });

// const routeTree = rootRoute.addChildren([
//   indexRoute,
//   dashboardRoute,
//   errorRoute,
// ]);

// export const router = createRouter({ routeTree });

// declare module "@tanstack/react-router" {
//   interface Register {
//     router: typeof router;
//   }
// }

import { createRouter } from "@tanstack/react-router";
import { createRootRoute, createRoute } from "@tanstack/react-router";
import { HomeLoginPage } from "./pages/home-login";
import { DashboardPage } from "./pages/dashboard";
import { ErrorPage } from "./pages/error";
import { RootLayout } from "./components/layouts/root-layout";
import { AuthGuard } from "./components/auth/auth-guard";
import { SchedulePage } from "./pages/schedule";
import { AnalyticsPage } from "./pages/analytics";
import { DocumentsPage } from "./pages/documents";
import { UsersPage } from "./pages/users";
import { SettingsPage } from "./pages/settings";
import { ProfilePage } from "./pages/profile";

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomeLoginPage,
});

// Dashboard route (main overview)
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <AuthGuard>
      <DashboardPage />
    </AuthGuard>
  ),
});

// Analytics route
const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analytics",
  component: () => (
    <AuthGuard>
      <AnalyticsPage />
    </AuthGuard>
  ),
});

// Schedule route
const scheduleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/schedule",
  component: () => (
    <AuthGuard>
      <SchedulePage />
    </AuthGuard>
  ),
});

// Documents route
const documentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/documents",
  component: () => (
    <AuthGuard>
      <DocumentsPage />
    </AuthGuard>
  ),
});

// Users route
const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/users",
  component: () => (
    <AuthGuard>
      <UsersPage />
    </AuthGuard>
  ),
});

// Settings route
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: () => (
    <AuthGuard>
      <SettingsPage />
    </AuthGuard>
  ),
});

// Profile route
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: () => (
    <AuthGuard>
      <ProfilePage />
    </AuthGuard>
  ),
});

// Error route
const errorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/error",
  component: ErrorPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  analyticsRoute,
  scheduleRoute,
  documentsRoute,
  usersRoute,
  settingsRoute,
  profileRoute,
  errorRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
