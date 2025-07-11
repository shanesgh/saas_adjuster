import { createFileRoute, Outlet } from '@tanstack/react-router';
import { DashboardNav } from '../components/companies/icavs/navigation/DashboardNav';
import { Header } from '../components/shared/layout/Header';

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Header - only visible on sm+ screens */}
      <div className="hidden sm:block sm:w-full">
        <Header />
      </div>
      
      {/* Mobile: Top navigation, Tablet+: Left sidebar */}
      <div className="lg:hidden">
        <DashboardNav />
      </div>
      
      <div className="flex flex-1 sm:h-[calc(100vh-80px)]">
        {/* Tablet+ sidebar */}
        <div className="hidden sm:block">
          <DashboardNav />
        </div>
        
        <main className="flex-1 overflow-auto p-4 sm:p-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}