import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Palette, Leaf } from 'lucide-react';
import { useTheme, Theme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes: { key: Theme; icon: React.ReactNode }[] = [
    { key: 'light', icon: <Sun className="h-4 w-4" /> },
    { key: 'dark', icon: <Moon className="h-4 w-4" /> },
    { key: 'colorful', icon: <Palette className="h-4 w-4" /> },
    { key: 'green', icon: <Leaf className="h-4 w-4" /> },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
      {themes.map((themeOption) => (
        <motion.div key={themeOption.key} whileTap={{ scale: 0.95 }}>
          <Button
            variant={theme === themeOption.key ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setTheme(themeOption.key)}
            className={cn(
              "relative h-8 w-8 transition-all duration-200",
              theme === themeOption.key && "shadow-md"
            )}
          >
            {themeOption.icon}
            {theme === themeOption.key && (
              <motion.div
                className="absolute inset-0 bg-primary/10 rounded"
                layoutId="theme-indicator"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

export default ThemeSwitcher;