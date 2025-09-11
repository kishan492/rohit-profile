import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, Award } from 'lucide-react';
import { aboutService, AboutData } from '@/services/aboutService';

const About: React.FC = () => {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAboutData();
    
    // Listen for storage changes (when admin updates data)
    const handleStorageChange = () => {
      loadAboutData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also refresh every 30 seconds to catch updates
    const interval = setInterval(loadAboutData, 30000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);
  
  const loadAboutData = async () => {
    try {
      const data = await aboutService.getAbout();
      setAboutData(data);
    } catch (error) {
      console.error('Failed to load about data:', error);
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

  const stats = [
    { icon: MapPin, label: 'Based in', value: isLoading ? '' : (aboutData?.location || 'San Francisco') },
    { icon: Calendar, label: 'Founded', value: isLoading ? '' : (aboutData?.founded || '2019') },
    { icon: Users, label: 'Team Size', value: isLoading ? '' : (aboutData?.teamSize || '15+') },
    { icon: Award, label: 'Awards', value: isLoading ? '' : (aboutData?.awards || '8') },
  ];

  return (
    <section id="about" className="py-20 bg-muted/30 min-h-screen flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-7xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              {isLoading ? '' : (aboutData?.sectionTitle || 'About Our Story')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {isLoading ? '' : (aboutData?.sectionSubtitle || 'Building digital experiences that bridge innovation and accessibility')}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image Side */}
            <motion.div variants={itemVariants} className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-custom-lg">
                {aboutData?.aboutImage && aboutData.aboutImage.trim() !== '' ? (
                  <img 
                    src={aboutData.aboutImage} 
                    alt="About us" 
                    className="aspect-[4/5] w-full object-cover"
                  />
                ) : (
                  <div className="aspect-[4/5] bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <div className="text-8xl font-bold text-primary/30">
                      About
                    </div>
                  </div>
                )}
                
                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-4 right-4 w-16 h-16 bg-primary/10 rounded-full backdrop-blur-sm flex items-center justify-center"
                >
                  <Award className="h-8 w-8 text-primary" />
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute bottom-4 left-4 w-12 h-12 bg-accent/10 rounded-full backdrop-blur-sm flex items-center justify-center"
                >
                  <Users className="h-6 w-6 text-accent" />
                </motion.div>
              </div>

              {/* Stats Grid */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-2 gap-4 mt-8"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    whileHover={{ scale: 1.05 }}
                    className="bg-card p-4 rounded-2xl shadow-custom hover:shadow-custom-md transition-all duration-300"
                  >
                    <stat.icon className="h-6 w-6 text-primary mb-2" />
                    <div className="font-semibold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Content Side */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {isLoading ? '' : (aboutData?.mainTitle || 'Crafting Digital Excellence Since 2019')}
                </h3>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {isLoading ? '' : (aboutData?.description1 || 'What started as a passion project has evolved into a comprehensive digital agency.')}
                </p>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {isLoading ? '' : (aboutData?.description2 || 'Our mission is to democratize access to high-quality digital solutions.')}
                </p>
              </div>

              {/* Mission & Values */}
              <div className="space-y-6 pt-6">
                <div className="border-l-4 border-primary pl-6">
                  <h4 className="text-xl font-semibold mb-2 text-foreground">Our Mission</h4>
                  <p className="text-muted-foreground">
                    {isLoading ? '' : (aboutData?.mission || 'To empower businesses with cutting-edge digital solutions')}
                  </p>
                </div>

                <div className="border-l-4 border-accent pl-6">
                  <h4 className="text-xl font-semibold mb-2 text-foreground">Our Values</h4>
                  <ul className="text-muted-foreground space-y-1">
                    {(isLoading ? [] : (aboutData?.values || 'Innovation through collaboration\nQuality over quantity\nTransparency in every interaction').split('\n')).map((value, index) => (
                      <li key={index}>• {value}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTA */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="pt-6"
              >
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-2xl border border-primary/20">
                  <h4 className="text-lg font-semibold mb-2 text-foreground">Ready to Start Your Journey?</h4>
                  <p className="text-muted-foreground mb-4">
                    Let's discuss how we can help bring your vision to life.
                  </p>
                  <button 
                    className="text-primary font-medium hover:text-primary/80 transition-colors"
                    onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Get in Touch →
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;