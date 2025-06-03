import { Outlet } from '@tanstack/react-router';
import { ThemeToggle } from '@/components/theme-toggle';

export function RootLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}