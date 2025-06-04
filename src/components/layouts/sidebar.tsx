import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import {
  Shield,
  LogOut,
  Home,
  BarChart3,
  Calendar,
  FileText,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuthStore } from '@/stores/auth-store';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'overview';
    if (path === '/analytics') return 'analytics';
    if (path === '/schedule') return 'schedule';
    if (path === '/documents') return 'documents';
    if (path === '/users') return 'users';
    if (path === '/settings') return 'settings';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate({ to: '/' });
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Home, path: '/dashboard' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics' },
    { id: 'schedule', label: 'Schedule', icon: Calendar, path: '/schedule' },
    { id: 'documents', label: 'Documents', icon: FileText, path: '/documents' },
    { id: 'users', label: 'Team Members', icon: Users, path: '/users' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div
      className={`relative flex flex-col border-r bg-card transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-6 z-50 h-6 w-6 rounded-full border bg-background"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      <div className={`p-4 flex items-center gap-3 h-16 border-b ${isCollapsed ? 'justify-center' : ''}`}>
        <Shield className="h-6 w-6 text-primary flex-shrink-0" />
        {!isCollapsed && <h1 className="font-semibold text-lg">SecureAuth</h1>}
      </div>

      <ScrollArea className="flex-1 pt-4">
        <div className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <TooltipProvider key={item.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="relative group"
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <Button
                        variant={activeTab === item.id ? 'secondary' : 'ghost'}
                        className={`w-full justify-${isCollapsed ? 'center' : 'start'} ${
                          activeTab === item.id ? 'font-medium' : ''
                        }`}
                        onClick={() => navigate({ to: item.path })}
                      >
                        <Icon className={`h-4 w-4 ${!isCollapsed && 'mr-2'}`} />
                        {!isCollapsed && item.label}
                      </Button>
                    </div>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right" sideOffset={10}>
                      {item.label}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-4 border-t mt-auto">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className="relative group"
                onMouseEnter={() => setHoveredItem('logout')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Button
                  variant="outline"
                  className={`w-full justify-${isCollapsed ? 'center' : 'start'} text-destructive`}
                  onClick={handleLogout}
                >
                  <LogOut className={`h-4 w-4 ${!isCollapsed && 'mr-2'}`} />
                  {!isCollapsed && 'Log Out'}
                </Button>
              </div>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" sideOffset={10}>
                Log Out
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}