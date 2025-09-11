import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Video, Home, Smartphone, Globe, Palette, BarChart, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { servicesService, ServicesData } from '@/services/servicesService';

const Services: React.FC = () => {
  const navigate = useNavigate();
  const [servicesData, setServicesData] = useState<ServicesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadServicesData();
    
    // Listen for storage changes (when admin updates data)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'servicesDataUpdated') {
        loadServicesData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom services update events
    const handleCustomUpdate = () => {
      console.log('Services data update event received');
      loadServicesData();
    };
    
    window.addEventListener('servicesDataUpdated', handleCustomUpdate);
    
    // Also refresh every 30 seconds to catch updates
    const interval = setInterval(loadServicesData, 30000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('servicesDataUpdated', handleCustomUpdate);
      clearInterval(interval);
    };
  }, []);

  const loadServicesData = async () => {
    try {
      const data = await servicesService.getServices();
      setServicesData(data);
    } catch (error) {
      console.error('Failed to load services data:', error);
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
        staggerChildren: 0.03,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Video, Home, Code, Smartphone, Globe, Palette, BarChart, Shield
    };
    return icons[iconName] || Code;
  };

  const defaultServices = [
    {
      icon: 'Video',
      title: 'Content Creation',
      description: 'Engaging video content, tutorials, and educational materials for YouTube and social media platforms.',
      features: ['Video Production', 'Script Writing', 'Post-Production', 'Channel Strategy'],
      color: 'from-red-500 to-pink-500',
    },
    {
      icon: 'Home',
      title: 'Real Estate Consulting',
      description: 'Strategic consulting for real estate investments, market analysis, and property development guidance.',
      features: ['Market Analysis', 'Investment Strategy', 'Property Valuation', 'Deal Structuring'],
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: 'Code',
      title: 'Website Development',
      description: 'Custom web applications, e-commerce solutions, and responsive websites built with modern technologies.',
      features: ['React Development', 'E-commerce Solutions', 'API Integration', 'Performance Optimization'],
      color: 'from-blue-500 to-indigo-500',
    },
    {
      icon: 'Smartphone',
      title: 'Mobile App Development',
      description: 'Native and cross-platform mobile applications designed for optimal user experience.',
      features: ['iOS Development', 'Android Development', 'React Native', 'App Store Optimization'],
      color: 'from-purple-500 to-violet-500',
    },
    {
      icon: 'Palette',
      title: 'UI/UX Design',
      description: 'User-centered design solutions that enhance engagement and drive conversions.',
      features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
      color: 'from-orange-500 to-amber-500',
    },
    {
      icon: 'BarChart',
      title: 'Digital Marketing',
      description: 'Data-driven marketing strategies to grow your online presence and reach your target audience.',
      features: ['SEO Strategy', 'Social Media Marketing', 'Content Marketing', 'Analytics'],
      color: 'from-teal-500 to-cyan-500',
    },
  ];

  // Always show default services
  const services = defaultServices;
  const partners = servicesData?.partnersList ? servicesData.partnersList.split(',').map(p => p.trim()).filter(p => p) : ['TechCorp', 'InnovateLab', 'DesignStudio', 'StartupHub', 'CreativeAgency', 'DataCorp'];

  return (
    <section id="services" className="py-20 min-h-screen flex items-center">
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
              {isLoading ? '' : (servicesData?.sectionTitle || 'Our Services')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {isLoading ? '' : (servicesData?.sectionDescription || 'Comprehensive solutions to help your business thrive in the digital landscape')}
            </p>
          </motion.div>

          {/* Services Grid */}
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
          >
            {services && services.length > 0 ? services.map((service, index) => {
              const IconComponent = getIconComponent(service.icon);
              return (
                <motion.div
                  key={service.title || index}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="group bg-card rounded-3xl p-8 shadow-custom hover:shadow-custom-lg transition-all duration-300 border border-border/50 hover:border-primary/20"
                >
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} p-0.5 mb-6`}>
                    <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {service.features && service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                    onClick={() => navigate('/coming-soon')}
                  >
                    Learn More
                  </Button>
                </motion.div>
              );
            }) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Loading services...</p>
              </div>
            )}
          </motion.div>

          {/* Partners Section */}
          <motion.div variants={itemVariants} className="text-center">
            <h3 className="text-2xl font-bold mb-8 text-foreground">
              {isLoading ? '' : (servicesData?.partnersTitle || 'Trusted by Industry Leaders')}
            </h3>
            
            {partners.length > 0 && (
              <div className="overflow-hidden">
                <motion.div
                  animate={{ x: [0, -partners.length * 200] }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: 'linear',
                    repeatType: 'loop'
                  }}
                  className="flex gap-8 items-center whitespace-nowrap"
                >
                  {[...partners, ...partners, ...partners].map((partner, index) => (
                    <motion.div
                      key={`${partner}-${index}`}
                      whileHover={{ scale: 1.1, opacity: 1 }}
                      className="flex items-center justify-center p-4 bg-card rounded-2xl shadow-custom hover:shadow-custom-md transition-all duration-300 opacity-60 hover:opacity-100 flex-shrink-0 min-w-[180px]"
                    >
                      <span className="font-bold text-lg text-muted-foreground">
                        {partner}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}

            <motion.div
              variants={itemVariants}
              className="mt-12 p-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl border border-primary/20"
            >
              <h4 className="text-xl font-bold mb-4 text-foreground">
                Ready to Get Started?
              </h4>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Let's discuss your project and create something amazing together. 
                We're here to turn your ideas into reality.
              </p>
              <Button 
                variant="hero" 
                size="lg" 
                className="px-8"
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Start Your Project
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;