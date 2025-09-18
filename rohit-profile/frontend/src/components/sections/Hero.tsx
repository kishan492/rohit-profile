import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { homeService, HomeData } from '@/services/homeService';
import StarField from '@/components/ui/StarField';

const Hero: React.FC = () => {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
    
    // Listen for custom home update events
    const handleCustomUpdate = () => {
      loadHomeData();
    };
    
    window.addEventListener('homeDataUpdated', handleCustomUpdate);
    
    // Reduced refresh interval to 2 minutes (cached data will be used)
    const interval = setInterval(loadHomeData, 120000);
    
    return () => {
      window.removeEventListener('homeDataUpdated', handleCustomUpdate);
      clearInterval(interval);
    };
  }, []);
  
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
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <StarField />
      {/* Background with gradient */}
      <div className="absolute inset-0 hero-gradient opacity-10" />
      


      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
              
              <Button
                variant="ghost"
                size="default"
                className="px-6 py-3 text-base group"
                onClick={() => window.open(import.meta.env.VITE_YOUTUBE_URL || 'https://youtube.com', '_blank')}
              >
                <Play className="mr-2 h-4 w-4" />
                Watch on YouTube
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-2"
            >
              {(isLoading ? [
                { number: '', label: 'Projects' },
                { number: '', label: 'Views' },
                { number: '', label: 'Clients' },
                { number: '', label: 'Experience' },
              ] : [
                { number: homeData?.stats.projects || '50+', label: 'Projects' },
                { number: homeData?.stats.views || '100K+', label: 'Views' },
                { number: homeData?.stats.clients || '25+', label: 'Clients' },
                { number: homeData?.stats.experience || '5+', label: 'Experience' },
              ]).map((stat, index) => (
                <div
                  key={stat.label}
                  className="relative flex-1 min-w-[120px] p-2 rounded-lg bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-cyan-500/20 backdrop-blur-sm hover:border-purple-500/30 hover:scale-105 transition-all duration-300 group overflow-hidden"
                >
                  {/* Futuristic glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10 text-center">
                    <div className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-1">
                      {stat.number}
                    </div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                  
                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-1 h-1 bg-gradient-to-br from-cyan-400 to-transparent rounded-bl-lg" />
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Profile Image */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="w-80 h-80 lg:w-96 lg:h-96 relative overflow-hidden rounded-3xl">
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