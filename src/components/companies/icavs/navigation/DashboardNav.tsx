import { Link } from '@tanstack/react-router';
import { 
  Home, 
  BarChart3, 
  Car, 
  Calculator, 
  Brain, 
  FileText, 
  Settings 
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
  return (
    <nav className="w-64 bg-white shadow-sm border-r border-gray-200 h-full">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">ICAVS Dashboard</h2>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                activeProps={{
                  className: "bg-primary-100 text-primary-700"
                }}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};