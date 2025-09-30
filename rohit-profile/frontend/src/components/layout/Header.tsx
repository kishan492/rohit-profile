import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeSwitcher from '@/components/ui/theme-switcher';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { brandingService, BrandingData } from '@/services/brandingService';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [brandingData, setBrandingData] = useState<BrandingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadBrandingData();
  }, []);

  const loadBrandingData = async () => {
    try {
      const data = await brandingService.getBranding();
      setBrandingData(data);
      
      // Update document title and favicon
      document.title = data.browserTitle;
      
      if (data.favicon) {
        const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = data.favicon;
        document.getElementsByTagName('head')[0].appendChild(link);
      }
    } catch (error) {
      console.error('Failed to load branding data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminAccess = () => {
    navigate('/admin');
  };

  const [sectionVisibility, setSectionVisibility] = useState({
    hero: true,
    about: true,
    services: true,
    testimonials: true,
    achievements: true,
    youtube: true,
    team: true,
    blog: true,
    contact: true,
  });

  useEffect(() => {
    const loadVisibility = () => {
      const settings = localStorage.getItem('siteSettings');
      if (settings) {
        const parsed = JSON.parse(settings);
        setSectionVisibility(parsed.sectionVisibility);
      }
    };

    loadVisibility();
    
    const handleSettingsUpdate = () => {
      loadVisibility();
    };
    
    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    return () => window.removeEventListener('settingsUpdated', handleSettingsUpdate);
  }, []);

  const allNavigation = [
    { name: 'Home', href: '#home', key: 'hero' },
    { name: 'About', href: '#about', key: 'about' },
    { name: 'Services', href: '#services', key: 'services' },
    { name: 'Achievements', href: '#achievements', key: 'achievements' },
    { name: 'Testimonials', href: '#testimonials', key: 'testimonials' },
    { name: 'Team', href: '#team', key: 'team' },
    { name: 'YouTube', href: '#youtube', key: 'youtube' },
    { name: 'Blog', href: '#blog', key: 'blog' },
    { name: 'Contact', href: '#contact', key: 'contact' },
  ];

  const navigation = allNavigation.filter(item => sectionVisibility[item.key as keyof typeof sectionVisibility]);

  const scrollToSection = (href: string) => {
    setIsMenuOpen(false);
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Left Side */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleAdminAccess}
            className="flex items-center cursor-pointer bg-transparent border-none p-0 flex-shrink-0"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mr-1 sm:mr-2">
              {isLoading ? (
                <span className="text-white font-bold text-lg sm:text-xl"></span>
              ) : brandingData?.logoImage ? (
                <img 
                  src={brandingData.logoImage} 
                  alt="Logo" 
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <span className="text-white font-bold text-lg sm:text-xl">
                  {brandingData?.logoText ? brandingData.logoText.charAt(0).toUpperCase() : 'P'}
                </span>
              )}
            </div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gradient truncate max-w-[120px] sm:max-w-[200px] lg:max-w-none">
              {isLoading ? '' : (brandingData?.logoText || 'Portfolio')}
            </h1>
          </motion.button>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navigation.map((item) => (
              <motion.button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-sm xl:text-base text-muted-foreground hover:text-foreground transition-colors duration-200 relative group whitespace-nowrap"
                whileHover={{ y: -2 }}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </motion.button>
            ))}
          </div>

          {/* Theme Switcher & Mobile Menu - Right Side */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <ThemeSwitcher />
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden py-4 space-y-4"
            >
              {navigation.map((item, index) => (
                <motion.button
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left px-4 py-3 text-base text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors duration-200 mb-1"
                >
                  {item.name}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Header;