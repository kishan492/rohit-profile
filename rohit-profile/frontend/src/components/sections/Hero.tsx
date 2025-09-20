import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { homeService, HomeData } from '@/services/homeService';
import { footerService, FooterData } from '@/services/footerService';
import { Linkedin, Instagram, Facebook, Youtube } from 'lucide-react';
import StarField from '@/components/ui/StarField';

const Hero: React.FC = () => {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [footerLoading, setFooterLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
    loadFooterData();
    // Listen for custom home update events
    const handleCustomUpdate = () => {
      loadHomeData();
    };
    window.addEventListener('homeDataUpdated', handleCustomUpdate);
    // Listen for custom footer update events
    const handleFooterUpdate = () => {
      loadFooterData();
    };
    window.addEventListener('footerDataUpdated', handleFooterUpdate);
    // Reduced refresh interval to 2 minutes (cached data will be used)
    const interval = setInterval(loadHomeData, 120000);
    const footerInterval = setInterval(loadFooterData, 30000);
    return () => {
      window.removeEventListener('homeDataUpdated', handleCustomUpdate);
      window.removeEventListener('footerDataUpdated', handleFooterUpdate);
      clearInterval(interval);
      clearInterval(footerInterval);
    };
  }, []);
  const loadFooterData = async () => {
    try {
      const data = await footerService.getFooter();
      setFooterData(data);
    } catch (error) {
      console.error('Failed to load footer data:', error);
    } finally {
      setFooterLoading(false);
    }
  };
  
  const loadHomeData = async () => {
    try {
      const data = await homeService.getHome();
      // console.log('Hero loaded data:', data); // Removed for production
      setHomeData(data);
    } catch (error) {
      console.error('Failed to load home data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
  <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-12 lg:pt-48 lg:pb-24">
      <StarField />
      {/* Background with gradient */}
      <div className="absolute inset-0 hero-gradient opacity-10" />
      


      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Mobile: Image above all text */}
        <div className="block lg:hidden w-full flex justify-center mb-8 pt-8">
          <div className="w-64 h-64 relative overflow-hidden rounded-3xl shadow-custom-md">
            {homeData?.profileImage && homeData.profileImage.trim() !== '' ? (
              <img 
                src={homeData.profileImage} 
                alt={homeData?.name || 'Profile'} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Image failed to load:', homeData.profileImage);
                  e.currentTarget.style.display = 'none';
                }}
                onLoad={() => console.log('Image loaded successfully:', homeData.profileImage)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-6xl font-bold text-primary fade-from-bottom">
                {isLoading ? '' : (homeData?.name ? homeData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'JD')}
              </div>
            )}
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Side - Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Main Heading (plain text, no animation) */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
            >
              <span className="text-gradient">
                {isLoading
                  ? 'Loading...'
                  : (homeData?.headline || 'Innovating the Future One Project at a Time')}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-muted-foreground leading-relaxed"
            >
              {isLoading ? '' : (homeData?.subtitle || 'Entrepreneur, Content Creator & Developer building digital experiences that matter.')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                variant="hero"
                size="default"
                className="group px-6 py-3 text-base"
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Work with Me
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              
              <Button
                variant="outline"
                size="default"
                className="px-6 py-3 text-base"
                onClick={() => document.querySelector('#blog')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Explore My Work
              </Button>
              
              
            </motion.div>

            {/* Social Media Links */}
            <motion.div
              variants={itemVariants}
              className="flex gap-4 mt-4 justify-center lg:justify-start"
            >
              {/* Only show if footerData is loaded */}
              {footerLoading ? null : (
                <>
                  <a href={footerData?.social?.linkedin || '#'} target="_blank" rel="noopener noreferrer" title="LinkedIn" className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a href={footerData?.social?.instagram || '#'} target="_blank" rel="noopener noreferrer" title="Instagram" className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href={footerData?.social?.facebook || '#'} target="_blank" rel="noopener noreferrer" title="Facebook" className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href={footerData?.social?.youtube || '#'} target="_blank" rel="noopener noreferrer" title="YouTube" className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                    <Youtube className="h-5 w-5" />
                  </a>
                </>
              )}
            </motion.div>
          </motion.div>

          {/* Desktop: Image right side only for lg and up */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hidden lg:flex justify-center lg:justify-end"
          >
            <div className="w-80 h-80 lg:w-96 lg:h-96 relative overflow-hidden rounded-3xl shadow-custom-md">
              {homeData?.profileImage && homeData.profileImage.trim() !== '' ? (
                <img 
                  src={homeData.profileImage} 
                  alt={homeData?.name || 'Profile'} 
                  className="w-full h-full object-cover fade-from-bottom"
                  onError={(e) => {
                    console.error('Image failed to load:', homeData.profileImage);
                    e.currentTarget.style.display = 'none';
                  }}
                  onLoad={() => console.log('Image loaded successfully:', homeData.profileImage)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-6xl font-bold text-primary fade-from-bottom">
                  {isLoading ? '' : (homeData?.name ? homeData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'JD')}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}

      </div>
    </section>
  );
};

export default Hero;