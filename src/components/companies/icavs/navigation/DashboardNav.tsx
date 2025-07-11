import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { 
  Home, 
  BarChart3, 
  Car, 
  Calculator, 
  Brain, 
  FileText, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: Home },
  { to: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/dashboard/motor-assessment', label: 'Motor Assessment', icon: Car },
  { to: '/dashboard/motor-valuation', label: 'Motor Valuation', icon: Calculator },
  { to: '/dashboard/ai-data-inquiries', label: 'AI Data Inquiries', icon: Brain },
  { to: '/dashboard/reports', label: 'Reports', icon: FileText },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export const DashboardNav = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile/Tablet Navigation - Top Bar (only below lg breakpoint) */}
      <nav className="lg:hidden bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Mobile/Tablet Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-800">ICAVS</h1>
          </div>
          
          {/* Mobile/Tablet Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
        
        {/* Mobile/Tablet Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <div className="grid grid-cols-2 gap-2 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  activeProps={{
                    className: "bg-primary-50 text-primary-700"
                  }}
                >
                  <div className="w-8 h-8 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <item.icon size={20} />
                  </div>
                  <span className="text-xs font-medium text-center leading-tight">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Desktop+ Navigation - Left Sidebar (lg breakpoint and above) */}
      <nav className={`hidden lg:block ${isCollapsed ? 'w-16' : 'w-64'} bg-white shadow-sm border-r border-gray-200 h-full transition-all duration-300 relative`}>
        <>
        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:shadow-lg transition-shadow z-10"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>

        <div className="p-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 whitespace-nowrap overflow-hidden -ml-1">
            {isCollapsed ? 'ICAVS' : 'ICAVS Dashboard'}
          </h2>
          
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <div className="relative group">
                  <Link
                    to={item.to}
                    className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors h-10"
                    activeProps={{
                      className: "bg-primary-100 text-primary-700"
                    }}
                  >
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                      <item.icon size={20} />
                    </div>
                    {!isCollapsed && (
                      <span className="ml-3 whitespace-nowrap">
                        {item.label}
                      </span>
                    )}
                  </Link>
                  
                  {/* Sidebar Tooltip - only shows when collapsed */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                      {item.label}
                      <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        </>
      </nav>
    </>
  );
};