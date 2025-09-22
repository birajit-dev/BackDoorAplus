'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiHome, FiBarChart2, FiCalendar, FiDollarSign, FiUsers, FiMapPin,
  FiFileText, FiSettings, FiLogOut, FiChevronLeft, FiChevronRight, 
  FiUser, FiBell, FiTrendingUp, FiClock, FiPhone, FiMail, FiImage,
  FiCreditCard, FiPieChart, FiCheckSquare
} from 'react-icons/fi';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface MenuItem {
  name: string;
  icon: JSX.Element;
  href: string;
  badge?: number;
  category?: string;
}

const menuItems: MenuItem[] = [
  { 
    name: 'Dashboard', 
    icon: <FiBarChart2 />, 
    href: '/admin/dashboard',
    category: 'Overview'
  },
  { 
    name: 'Properties', 
    icon: <FiHome />, 
    href: '/admin/properties',
    category: 'Property Management'
  },
  { 
    name: 'Add Property', 
    icon: <FiMapPin />, 
    href: '/admin/properties/add',
    category: 'Property Management'
  },
  { 
    name: 'Property Analytics', 
    icon: <FiTrendingUp />, 
    href: '/admin/properties/analytics',
    category: 'Property Management'
  },
  { 
    name: 'Calendar & Appointments', 
    icon: <FiCalendar />, 
    href: '/admin/calendar',
    category: 'Scheduling'
  },
  { 
    name: 'Book Appointment', 
    icon: <FiClock />, 
    href: '/admin/appointments/book',
    category: 'Scheduling'
  },
  { 
    name: 'Task Management', 
    icon: <FiCheckSquare />, 
    href: '/admin/tasks',
    category: 'Scheduling'
  },
  { 
    name: 'Payroll System', 
    icon: <FiDollarSign />, 
    href: '/admin/payroll',
    category: 'Financial Management'
  },
  { 
    name: 'Attendance Tracking', 
    icon: <FiClock />, 
    href: '/admin/payroll/attendance',
    category: 'Financial Management'
  },
  { 
    name: 'Payroll Calculator', 
    icon: <FiDollarSign />, 
    href: '/admin/payroll/calculator',
    category: 'Financial Management'
  },
  { 
    name: 'Income & Expenses', 
    icon: <FiCreditCard />, 
    href: '/admin/accounting',
    category: 'Financial Management'
  },
  { 
    name: 'Tax Forms & Reports', 
    icon: <FiFileText />, 
    href: '/admin/payroll/tax-forms',
    category: 'Financial Management'
  },
  { 
    name: 'Payroll Reports', 
    icon: <FiBarChart2 />, 
    href: '/admin/reports/payroll',
    category: 'Financial Management'
  },
  { 
    name: 'Clients', 
    icon: <FiUsers />, 
    href: '/admin/clients',
    category: 'Client Management'
  },
  { 
    name: 'Agents', 
    icon: <FiUser />, 
    href: '/admin/agents',
    category: 'Team Management'
  },
  { 
    name: 'Communications', 
    icon: <FiMail />, 
    href: '/admin/communications', 
    badge: 5,
    category: 'Communication'
  },
  {
    name: 'Notifications',
    icon: <FiBell />,
    href: '/admin/notifications',
    badge: 12,
    category: 'Communication'
  },
  { 
    name: 'Documents', 
    icon: <FiFileText />, 
    href: '/admin/documents',
    category: 'Documentation'
  },
  { 
    name: 'Photo Gallery', 
    icon: <FiImage />, 
    href: '/admin/gallery',
    category: 'Media'
  },
  { 
    name: 'Settings', 
    icon: <FiSettings />, 
    href: '/admin/settings',
    category: 'System'
  }
];

interface SidebarItemProps {
  item: MenuItem;
  isActive: boolean;
  isExpanded: boolean;
}

const SidebarItem = ({ item, isActive, isExpanded }: SidebarItemProps) => (
  <li>
    <Link href={item.href}>
      <Button
        variant={isActive ? "default" : "ghost"}
        className={`w-full justify-start hover:bg-blue-50 hover:text-blue-700 transition-colors ${!isExpanded && 'justify-center'} ${isActive ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}`}
      >
        <span className="text-xl mr-2">{item.icon}</span>
        {isExpanded && (
          <span className="text-sm font-medium flex-1 text-left">
            {item.name}
          </span>
        )}
        {item.badge && isExpanded && (
          <Badge variant="destructive" className="ml-auto">
            {item.badge}
          </Badge>
        )}
      </Button>
    </Link>
  </li>
);

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const storedUsername = localStorage.getItem('adminUser') || 'Admin';
    setUsername(storedUsername);
  }, []);

  const groupedMenuItems = menuItems.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="flex h-screen bg-background">
      <motion.aside
        initial={{ width: sidebarOpen ? 280 : 72 }}
        animate={{ width: sidebarOpen ? 280 : 72 }}
        transition={{ duration: 0.3 }}
        className="border-r bg-gradient-to-b from-blue-50 to-slate-50 shadow-lg"
      >
        <ScrollArea className="h-full">
          <div className="space-y-4 py-4">
            <div className="px-3 flex justify-between items-center">
              {sidebarOpen && (
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                    <FiHome className="text-white text-xl" />
                  </div>
                  <div>
                    <span className="text-lg font-bold text-blue-700">Apluslocators</span>
                    <p className="text-xs text-slate-500">Real Estate Admin</p>
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hover:bg-blue-100 transition-colors"
              >
                {sidebarOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
              </Button>
            </div>
            
            <div className="px-3">
              {sidebarOpen && (
                <div className="flex items-center space-x-3 bg-white rounded-lg p-3 shadow-sm">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <FiUser className="text-blue-600" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-700">{username}</span>
                    <p className="text-xs text-slate-500">Administrator</p>
                  </div>
                </div>
              )}
            </div>
            
            <nav className="space-y-1 px-2">
              {Object.entries(groupedMenuItems).map(([category, items]) => (
                <div key={category} className="mb-6">
                  {sidebarOpen && (
                    <h3 className="mb-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {category}
                    </h3>
                  )}
                  <ul className="space-y-1">
                    {items.map((item) => (
                      <SidebarItem
                        key={item.name}
                        item={item}
                        isActive={pathname === item.href}
                        isExpanded={sidebarOpen}
                      />
                    ))}
                  </ul>
                  {sidebarOpen && <Separator className="mt-4 mx-2 opacity-30" />}
                </div>
              ))}
            </nav>
            
            <div className="px-2 pt-4">
              <Link href="/admin/logout">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${!sidebarOpen && 'justify-center'} hover:bg-red-50 hover:text-red-600 transition-colors`}
                >
                  <FiLogOut className="text-xl mr-2" />
                  {sidebarOpen && (
                    <span className="text-sm font-medium">Logout</span>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </ScrollArea>
      </motion.aside>

      <main className="flex-1 overflow-y-auto bg-slate-50">
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
