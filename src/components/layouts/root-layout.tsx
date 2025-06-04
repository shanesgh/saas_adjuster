import { useState } from 'react';
import { useLocation } from '@tanstack/react-router';
import { Outlet } from '@tanstack/react-router';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sidebar } from '@/components/layouts/sidebar';

export function RootLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-background flex">
      {!isLoginPage && <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />}
      <div className="flex-1 flex flex-col">
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}