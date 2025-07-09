import { createFileRoute, Outlet } from '@tanstack/react-router';
import { DashboardNav } from '../components/companies/icavs/navigation/DashboardNav';
import { Header } from '../components/shared/layout/Header';

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex h-[calc(100vh-80px)]">
        <DashboardNav />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}