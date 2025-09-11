import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { homeService, HomeData } from '@/services/homeService';

const Hero: React.FC = () => {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
    
    // Listen for custom home update events
    const handleCustomUpdate = () => {
      console.log('Home data update event received');
      loadHomeData();
    };
    
    window.addEventListener('homeDataUpdated', handleCustomUpdate);
    
    // Also refresh every 30 seconds to catch updates
    const interval = setInterval(loadHomeData, 30000);
    
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
      {/* Background with gradient */}
      <div className="absolute inset-0 hero-gradient opacity-10" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          {/* Profile Image */}
          <motion.div
            variants={itemVariants}
            className="mb-8 inline-block"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary to-accent p-2 shadow-custom-lg"
            >
              <div className="w-full h-full rounded-full bg-muted flex items-center justify-center overflow-hidden">
                {homeData?.profileImage && homeData.profileImage.trim() !== '' ? (
                  <img 
                    src={homeData.profileImage} 
                    alt={homeData?.name || 'Profile'} 
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      console.error('Image failed to load:', homeData.profileImage);
                      e.currentTarget.style.display = 'none';
                    }}
                    onLoad={() => console.log('Image loaded successfully:', homeData.profileImage)}
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-4xl font-bold text-primary">
                    {isLoading ? '' : (homeData?.name ? homeData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'JD')}
                  </div>
                )}
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-primary to-accent bg-clip-border"
                style={{ 
                  background: 'conic-gradient(from 0deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))',
                  WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), black calc(100% - 2px))',
                  mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), black calc(100% - 2px))'
                }}
              />
            </motion.div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="text-gradient">
              {isLoading ? '' : (homeData?.headline || 'Innovating the Future One Project at a Time')}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            {isLoading ? '' : (homeData?.subtitle || 'Entrepreneur, Content Creator & Developer building digital experiences that matter.')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              variant="hero"
              size="lg"
              className="group px-8 py-4 text-lg"
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Work with Me
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg"
              onClick={() => document.querySelector('#blog')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              Explore My Work
            </Button>
            
            <Button
              variant="ghost"
              size="lg"
              className="px-8 py-4 text-lg group"
              onClick={() => window.open(import.meta.env.VITE_YOUTUBE_URL || 'https://youtube.com', '_blank')}
            >
              <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
              Watch on YouTube
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto"
          >
            {(isLoading ? [
              { number: '', label: 'Projects Completed' },
              { number: '', label: 'YouTube Views' },
              { number: '', label: 'Happy Clients' },
              { number: '', label: 'Years Experience' },
            ] : [
              { number: homeData?.stats.projects || '50+', label: 'Projects Completed' },
              { number: homeData?.stats.views || '100K+', label: 'YouTube Views' },
              { number: homeData?.stats.clients || '25+', label: 'Happy Clients' },
              { number: homeData?.stats.experience || '5+', label: 'Years Experience' },
            ]).map((stat, index) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 rounded-2xl bg-card shadow-custom hover:shadow-custom-md transition-all duration-300"
              >
                <div className="text-2xl sm:text-3xl font-bold text-gradient mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center"
          >
            <div className="w-1 h-3 bg-muted-foreground rounded-full mt-2" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;