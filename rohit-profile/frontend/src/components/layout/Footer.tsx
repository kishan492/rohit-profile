import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowUp, Linkedin, Twitter, Instagram, Facebook, Github, Youtube } from 'lucide-react';
import { footerService, FooterData } from '@/services/footerService';

const Footer: React.FC = () => {
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFooterData();
    
    const handleCustomUpdate = () => {
      console.log('Footer data update event received');
      loadFooterData();
    };
    
    window.addEventListener('footerDataUpdated', handleCustomUpdate);
    const interval = setInterval(loadFooterData, 30000);
    
    return () => {
      window.removeEventListener('footerDataUpdated', handleCustomUpdate);
      clearInterval(interval);
    };
  }, []);
  
  const loadFooterData = async () => {
    try {
      const data = await footerService.getFooter();
      setFooterData(data);
    } catch (error) {
      console.error('Failed to load footer data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const socialLinks = [
    { name: 'LinkedIn', url: footerData?.social?.linkedin || '#', icon: Linkedin },
    { name: 'Twitter', url: footerData?.social?.twitter || '#', icon: Twitter },
    { name: 'Instagram', url: footerData?.social?.instagram || '#', icon: Instagram },
    { name: 'Facebook', url: footerData?.social?.facebook || '#', icon: Facebook },
    { name: 'YouTube', url: footerData?.social?.youtube || '#', icon: Youtube },
    { name: 'GitHub', url: footerData?.social?.github || '#', icon: Github },
  ];

  const quickLinks = (footerData?.quickLinks && footerData.quickLinks.length > 0) ? footerData.quickLinks : [
    { name: 'Home', url: '#home' },
    { name: 'About', url: '#about' },
    { name: 'Services', url: '#services' },
    { name: 'Contact', url: '#contact' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-custom">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <h3 className="text-2xl font-bold text-gradient">{isLoading ? '' : (footerData?.companyName || 'Portfolio')}</h3>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              {isLoading ? '' : (footerData?.description || 'Building digital experiences that bridge innovation and accessibility. Let\'s create something amazing together.')}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                  title={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url || link.href || '#'}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Get in Touch</h4>
            <div className="space-y-2 text-muted-foreground">
              <p>{isLoading ? '' : (footerData?.email || 'hello@portfolio.com')}</p>
              <p>{isLoading ? '' : (footerData?.phone || '+1 (555) 123-4567')}</p>
              <p>{isLoading ? '' : (footerData?.address || 'San Francisco, CA')}</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 text-muted-foreground mb-4 md:mb-0">
            <span>{isLoading ? '' : (footerData?.copyright || '© 2024 Portfolio. Made with ❤️ All rights reserved.')}</span>
          </div>
          
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;