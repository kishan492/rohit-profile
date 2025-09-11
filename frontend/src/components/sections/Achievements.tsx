import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Award, Users, Zap, Target } from 'lucide-react';
import { achievementsService, AchievementsData } from '@/services/achievementsService';

const Achievements: React.FC = () => {
  const [achievementsData, setAchievementsData] = useState<AchievementsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAchievementsData();
    
    // Listen for achievements update events
    const handleCustomUpdate = () => {
      console.log('Achievements data update event received');
      loadAchievementsData();
    };
    
    window.addEventListener('achievementsDataUpdated', handleCustomUpdate);
    
    // Also refresh every 30 seconds to catch updates
    const interval = setInterval(loadAchievementsData, 30000);
    
    return () => {
      window.removeEventListener('achievementsDataUpdated', handleCustomUpdate);
      clearInterval(interval);
    };
  }, []);
  
  const loadAchievementsData = async () => {
    try {
      const data = await achievementsService.getAchievements();
      setAchievementsData(data);
    } catch (error) {
      console.error('Failed to load achievements data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Calendar, MapPin, Award, Users, Zap, Target
    };
    return icons[iconName] || Award;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        delayChildren: 0.1,
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    },
  };

  const defaultAchievements = [
    {
      year: '2024',
      title: 'Platform Expansion',
      description: 'Launched multi-platform content strategy reaching 500K+ users across YouTube, LinkedIn, and Instagram.',
      icon: 'Target',
      color: 'from-purple-500 to-violet-500',
    },
    {
      year: '2023',
      title: 'Award Recognition',
      description: 'Received "Digital Innovation Award" for outstanding contributions to the tech and content creation space.',
      icon: 'Award',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      year: '2023',
      title: 'Team Growth',
      description: 'Expanded team to 15+ talented individuals across development, design, and marketing disciplines.',
      icon: 'Users',
      color: 'from-green-500 to-emerald-500',
    },
    {
      year: '2022',
      title: 'Major Milestone',
      description: 'Reached 100K YouTube subscribers and completed 50+ successful client projects.',
      icon: 'Zap',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      year: '2021',
      title: 'Business Launch',
      description: 'Officially launched consulting services, combining real estate expertise with digital solutions.',
      icon: 'MapPin',
      color: 'from-red-500 to-pink-500',
    },
    {
      year: '2019',
      title: 'Foundation',
      description: 'Started the journey with a vision to democratize access to high-quality digital solutions.',
      icon: 'Calendar',
      color: 'from-indigo-500 to-purple-500',
    },
  ];

  const achievements = (achievementsData?.achievements && achievementsData.achievements.length > 0) ? achievementsData.achievements : defaultAchievements;

  return (
    <section id="achievements" className="py-20 min-h-screen flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="max-w-7xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              {isLoading ? '' : (achievementsData?.sectionTitle || 'Our Journey')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {isLoading ? '' : (achievementsData?.sectionDescription || 'Milestones and achievements that mark our path of continuous growth and innovation')}
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-accent transform md:-translate-x-0.5" />

            <div className="space-y-12">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={`${achievement.year}-${index}`}
                  variants={itemVariants}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background shadow-custom transform md:-translate-x-2 z-10" />

                  {/* Content Card */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`bg-card rounded-3xl p-8 shadow-custom hover:shadow-custom-lg transition-all duration-300 border border-border/50 hover:border-primary/20 ml-16 md:ml-0 ${
                      index % 2 === 0 ? 'md:mr-8 md:ml-0' : 'md:ml-8 md:mr-0'
                    } md:w-5/12`}
                  >
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${achievement.color} p-0.5 mb-6`}>
                      <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center">
                        {React.createElement(getIconComponent(achievement.icon), { className: "h-8 w-8 text-primary" })}
                      </div>
                    </div>

                    {/* Year Badge */}
                    <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                      {achievement.year}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold mb-3 text-foreground">
                      {achievement.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {achievement.description}
                    </p>
                  </motion.div>

                  {/* Year Display for larger screens */}
                  <div className={`hidden md:block text-2xl font-bold text-muted-foreground/50 ${
                    index % 2 === 0 ? 'ml-8' : 'mr-8'
                  }`}>
                    {achievement.year}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-20"
          >
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-8 border border-primary/20">
              <h3 className="text-2xl font-bold mb-4">
                {isLoading ? '' : (achievementsData?.ctaTitle || 'Be Part of Our Next Chapter')}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                {isLoading ? '' : (achievementsData?.ctaDescription || 'Every milestone represents the trust our clients place in us. Let\'s create the next success story together.')}
              </p>
              <button 
                className="bg-primary text-primary-foreground px-8 py-3 rounded-2xl font-medium hover:bg-primary/90 transition-colors shadow-custom hover:shadow-custom-md"
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Start Your Journey
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Achievements;