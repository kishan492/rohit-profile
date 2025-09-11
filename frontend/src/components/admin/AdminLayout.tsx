import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/scrollbar.css';
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  MessageSquare, 
  Trophy, 
  Users, 
  FileText, 
  Settings,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  Home,
  Play,
  Mail,
  Globe,
  Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ThemeSwitcher from '@/components/ui/theme-switcher';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Home Section', href: '/admin/home', icon: Home },
    { name: 'About Section', href: '/admin/about', icon: User },
    { name: 'Services', href: '/admin/services', icon: Briefcase },
    { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
    { name: 'Achievements', href: '/admin/achievements', icon: Trophy },
    { name: 'YouTube Section', href: '/admin/youtube', icon: Play },
    { name: 'Team', href: '/admin/team', icon: Users },
    { name: 'Blog', href: '/admin/blog', icon: FileText },
    { name: 'Contact Section', href: '/admin/contact', icon: Mail },
    { name: 'Footer Section', href: '/admin/footer', icon: Globe },
    { name: 'Site Branding', href: '/admin/branding', icon: Palette },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: sidebarOpen ? 0 : -200 }}
          className={cn(
            "fixed inset-y-0 left-0 z-50 bg-card border-r border-border shadow-custom-lg",
            sidebarOpen ? "w-64" : "w-16"
          )}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center gap-3 p-6 border-b border-border">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.h1
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-xl font-bold text-gradient"
                  >
                    Portfolio Admin
                  </motion.h1>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200",
                      active
                        ? "bg-primary text-primary-foreground shadow-custom"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                      !sidebarOpen && "justify-center"
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <AnimatePresence>
                      {sidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="font-medium"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  localStorage.removeItem('loginTime');
                  window.location.href = '/';
                }}
                className={cn(
                  "w-full justify-start gap-3 text-muted-foreground hover:text-foreground",
                  !sidebarOpen && "justify-center"
                )}
              >
                <LogOut className="h-4 w-4" />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      Logout
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </motion.aside>
      </AnimatePresence>

      {/* Main Content */}
      <div className={cn("flex-1 flex flex-col", sidebarOpen ? "ml-64" : "ml-16")}>
        {/* Top Bar */}
        <header className="bg-card border-b border-border shadow-custom p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>

              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-10 bg-muted border-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>

              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">JD</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 custom-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;