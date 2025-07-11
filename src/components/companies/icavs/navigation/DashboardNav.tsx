// Your main Dashboard Layout component should look like this:

import { DashboardNav } from './DashboardNav';
import { DashboardHeader } from './DashboardHeader'; // Your blue header component

export const DashboardLayout = ({ children }) => {
  return (
    <div className="h-screen flex flex-col">
      {/* Header - Full width at top for large screens */}
      <div className="hidden lg:block">
        <DashboardHeader className="bg-blue-600 h-16 w-full" />
      </div>
      
      {/* Mobile Navigation (shows on small screens) */}
      <div className="lg:hidden">
        <DashboardNav />
      </div>
      
      {/* Content Area - Sidebar + Main Content side by side */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar (hidden on mobile) */}
        <div className="hidden lg:block">
          <DashboardNav />
        </div>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

// Alternative structure if you want header to span full width including over sidebar:
export const DashboardLayoutAlternative = ({ children }) => {
  return (
    <div className="h-screen flex flex-col">
      {/* Header spans full width */}
      <header className="bg-blue-600 h-16 w-full z-30">
        <DashboardHeader />
      </header>
      
      {/* Content area below header */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <DashboardNav />
        </aside>
        
        {/* Mobile nav for small screens */}
        <div className="lg:hidden">
          <DashboardNav />
        </div>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};