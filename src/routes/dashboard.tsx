import { createFileRoute, Outlet } from '@tanstack/react-router';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { DashboardNav } from '../components/companies/icavs/navigation/DashboardNav';
import { Header } from '../components/shared/layout/Header';
import { UserButton } from '@clerk/clerk-react';

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header - full width at top on large screens only */}
        <div className="hidden lg:block w-full">
          <div className="bg-primary-500 text-white py-4">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between">
                <Header />
                <div className="flex items-center space-x-4">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile/Tablet: Top navigation (shows below header space) */}
        <div className="lg:hidden">
          <DashboardNav />
        </div>
        
        {/* Content area - sidebar and main content side by side on desktop */}
        <div className="flex flex-1 lg:flex-row">
          {/* Desktop+ sidebar */}
          <div className="hidden lg:block">
            <DashboardNav />
          </div>
          
          {/* Main content */}
          <main className="flex-1 overflow-auto p-4 lg:p-6 w-full lg:w-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}