import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  BarChart3,
  FileText,
  Settings,
  Car,
  Calculator,
  Brain,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Motor Assessment", href: "/dashboard/motor-assessment", icon: Car },
  {
    name: "Motor Valuation",
    href: "/dashboard/motor-valuation",
    icon: Calculator,
  },
  {
    name: "AI Data Inquiries",
    href: "/dashboard/ai-data-inquiries",
    icon: Brain,
  },
  { name: "Reports", href: "/dashboard/reports", icon: FileText },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export const DashboardNav = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return (
        location.pathname === "/dashboard" ||
        location.pathname === "/dashboard/"
      );
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Navigation (< lg) */}
      <nav className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-lg font-bold text-lg">
              ICAVS
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white">
            <div className="grid grid-cols-2 gap-2 p-4">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex flex-col items-center p-3 rounded-lg transition-all duration-200 hover:scale-105 ${
                      isActive(item.href)
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={20} className="mb-1" />
                    <span className="text-xs font-medium text-center">
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Desktop Sidebar (lg+) */}
      <nav
        className={`hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 relative">
          <h2 className="font-bold text-xl text-gray-800 whitespace-nowrap overflow-hidden relative">
            <span
              className={`transition-opacity duration-300 ${isCollapsed ? "opacity-0" : "opacity-100"}`}
            >
              ICAVS Dashboard
            </span>
            <span
              className={`absolute inset-0 transition-opacity duration-300 ${isCollapsed ? "opacity-100" : "opacity-0"}`}
            >
              ICAVS
            </span>
          </h2>

          {/* Collapse Toggle Button - positioned in header */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-200 z-10"
          >
            {isCollapsed ? (
              <ChevronRight size={14} />
            ) : (
              <ChevronLeft size={14} />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4">
          <ul className="space-y-2 px-3">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name} className="relative group">
                  <Link
                    to={item.href}
                    className={`flex items-center px-2.5 py-2 rounded-lg transition-colors duration-200 relative ${
                      isActive(item.href)
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={20} className="flex-shrink-0 min-w-[20px]" />
                    <span
                      className={`ml-3 transition-opacity duration-300 whitespace-nowrap ${
                        isCollapsed
                          ? "opacity-0 pointer-events-none"
                          : "opacity-100"
                      }`}
                    >
                      {item.name}
                    </span>
                  </Link>

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.name}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-800"></div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </>
  );
};
