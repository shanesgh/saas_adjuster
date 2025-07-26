import { createRootRoute, Outlet, useLocation } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";

export const Route = createRootRoute({
  component: () => {
    const location = useLocation();
    // const { isSignedIn } = useUser();
    const isDashboard = location.pathname.startsWith("/dashboard");

    return (
      <div className="min-h-screen bg-gray-50">
        {!isDashboard && <Navigation />}
        <main>
          <Outlet />
        </main>
        {!isDashboard && <Footer />}
        <TanStackRouterDevtools />
      </div>
    );
  },
});
