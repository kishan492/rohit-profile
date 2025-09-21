import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { homeService, HomeData } from '@/services/homeService';
import { footerService, FooterData } from '@/services/footerService';
import { Linkedin, Instagram, Facebook, Youtube } from 'lucide-react';
import StarField from '@/components/ui/StarField';

// TypewriterText Component
const TypewriterText: React.FC<{ text: string; delay: number; speed: number }> = ({ text, delay, speed }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      } else {
        // Hide cursor after typing is complete
        setTimeout(() => setShowCursor(false), 1000);
      }
    }, currentIndex === 0 ? delay * 1000 : speed);

    return () => clearTimeout(timer);
  }, [currentIndex, text, delay, speed]);

  return (
    <span 
      className="relative"
      style={{
        background: "linear-gradient(45deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))",
        backgroundSize: "200% 200%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {displayText}
      {showCursor && (
        <motion.span
          className="ml-1"
          style={{
            background: "linear-gradient(45deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))",
            backgroundSize: "200% 200%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          |
        </motion.span>
      )}
      
      {/* Shiny wave effect after typing completes */}
      {currentIndex === text.length && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 1, 1, 0],
            backgroundPosition: ["-200% 0%", "200% 0%", "200% 0%", "-200% 0%"]
          }}
          transition={{ 
            delay: 0.5, 
            duration: 2, 
            ease: "easeInOut",
            times: [0, 0.4, 0.6, 1]
          }}
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            mixBlendMode: "overlay"
          }}
        />
      )}
    </span>
  );
};

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
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      }
    },
  };

  // Advanced text animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -90 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 15,
        delay: 0.3
      }
    },
  };

  // Typewriter effect for headline
  const typewriterVariants = {
    hidden: { width: 0 },
    visible: { 
      width: "100%",
      transition: {
        duration: 2,
        ease: "easeInOut",
        delay: 0.5
      }
    },
  };

  // Floating animation for profile image
  const floatingVariants = {
    hidden: { y: 0, rotateY: -15 },
    visible: { 
      y: [-30, 30, -30],
      rotateY: 0,
      transition: {
        y: {
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut" as const
        },
        rotateY: {
          duration: 1,
          ease: "easeOut" as const
        }
      }
    },
  };

  // Glow effect for buttons
  const buttonVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 15
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 0 30px hsl(var(--primary) / 0.5)",
      transition: {
        duration: 0.2
      }
    }
  };

  // Social icons animation
  const socialVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 150,
        damping: 12
      }
    },
    hover: {
      scale: 1.2,
      rotate: 5,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  return (
  <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-12 lg:pt-48 lg:pb-24">
      <StarField />
      
      {/* Enhanced Background with gradient */}
      <div className="absolute inset-0 hero-gradient opacity-10" />
      
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute border border-primary/20 rounded-lg"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 60 + 20}px`,
              height: `${Math.random() * 60 + 20}px`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [0.8, 1.2, 0.8],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Mobile: Image above all text with Advanced Animations */}
        <motion.div 
          className="block lg:hidden w-full flex justify-center mb-8 pt-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.div 
            className="relative group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* Outer glow effect for mobile - Layer 1 */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary/15 to-accent/15 rounded-3xl blur-2xl"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ 
                duration: 3.5, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            
            {/* Middle glow effect for mobile - Layer 2 */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary/25 to-accent/25 rounded-3xl blur-xl"
              animate={{ 
                scale: [1, 1.08, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ 
                duration: 2.8, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 0.4
              }}
            />
            
            {/* Inner glow effect for mobile - Layer 3 */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary/35 to-accent/35 rounded-3xl blur-lg"
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.4, 0.6, 0.4]
              }}
              transition={{ 
                duration: 2.2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 0.8
              }}
            />
            
            {/* Outer border for mobile - Layer 1 */}
            <motion.div
              className="absolute inset-0 rounded-3xl border-2 border-primary/25"
              animate={{ 
                scale: [1, 1.03, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            
            {/* Middle border for mobile - Layer 2 */}
            <motion.div
              className="absolute inset-0 rounded-3xl border-2 border-primary/40"
              animate={{ 
                scale: [1, 1.02, 1],
                opacity: [0.4, 0.6, 0.4]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 0.2
              }}
            />
            
            {/* Inner border for mobile - Layer 3 */}
            <motion.div
              className="absolute inset-0 rounded-3xl border-2 border-primary/55"
              animate={{ 
                scale: [1, 1.01, 1],
                opacity: [0.5, 0.7, 0.5]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 0.4
              }}
            />
            
          <div className="w-64 h-64 relative overflow-hidden rounded-3xl shadow-custom-md">
            {homeData?.profileImage && homeData.profileImage.trim() !== '' ? (
                <motion.img 
                src={homeData.profileImage} 
                alt={homeData?.name || 'Profile'} 
                className="w-full h-full object-cover"
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                onError={(e) => {
                  console.error('Image failed to load:', homeData.profileImage);
                  e.currentTarget.style.display = 'none';
                }}
                onLoad={() => console.log('Image loaded successfully:', homeData.profileImage)}
              />
            ) : (
                <motion.div 
                  className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-6xl font-bold text-primary"
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                >
                  {isLoading ? (
                    <motion.div
                      className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    <motion.span
                      animate={{ 
                        textShadow: [
                          "0 0 15px hsl(var(--primary) / 0.5)",
                          "0 0 30px hsl(var(--primary) / 0.8)",
                          "0 0 15px hsl(var(--primary) / 0.5)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {homeData?.name ? homeData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'JD'}
                    </motion.span>
                  )}
                </motion.div>
            )}
          </div>
          </motion.div>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Side - Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Main Heading with Typewriter Effect */}
            <motion.div
              variants={textVariants}
              className="relative"
            >
              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight relative"
              >
                {isLoading ? (
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Loading...
                  </motion.span>
                ) : (
                  <TypewriterText 
                    text={homeData?.headline || 'Innovating the Future One Project at a Time'}
                    delay={0.8}
                    speed={50}
                  />
                )}
            </motion.h1>
            </motion.div>

            {/* Subtitle with Word-by-Word Animation */}
            <motion.div
              variants={textVariants}
              className="text-base sm:text-lg text-muted-foreground leading-relaxed"
            >
              {isLoading ? (
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-6 bg-muted rounded w-3/4"
                />
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                  className="relative"
                >
                  {(homeData?.subtitle || 'Entrepreneur, Content Creator & Developer building digital experiences that matter.').split(' ').map((word, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 1.5 + index * 0.1,
                        duration: 0.5,
                        ease: "easeOut"
                      }}
                      className="inline-block mr-2"
                    >
                      {word}
                    </motion.span>
                  ))}
            </motion.p>
              )}
            </motion.div>

            {/* CTA Buttons with Advanced Animations */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start items-center"
            >
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-lg blur-lg opacity-0 group-hover:opacity-75"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <Button
                  variant="hero"
                  size="default"
                  className="relative px-6 py-3 text-base overflow-hidden"
                  onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <motion.span
                    className="relative z-10 flex items-center"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
              >
                Work with Me
                    <motion.div
                      className="ml-2 h-4 w-4"
                      whileHover={{ x: 3, rotate: 15 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </motion.span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
              </Button>
              </motion.div>
              
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <motion.div
                  className="absolute inset-0 border-2 border-primary/50 rounded-lg"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <Button
                  variant="outline"
                  size="default"
                  className="relative px-6 py-3 text-base overflow-hidden"
                  onClick={() => document.querySelector('#blog')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <motion.span
                    className="relative z-10 flex items-center"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className="mr-2 h-4 w-4"
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </motion.div>
                Explore My Work
                  </motion.span>
              </Button>
              </motion.div>
            </motion.div>

            {/* Social Media Links with Advanced Animations */}
            <motion.div
              variants={itemVariants}
              className="flex gap-4 mt-4 justify-center lg:justify-start"
            >
              {/* Only show if footerData is loaded */}
              {footerLoading ? (
                <motion.div
                  className="flex gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                >
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className="w-10 h-10 bg-muted rounded-lg"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        delay: i * 0.2 
                      }}
                    />
                  ))}
                </motion.div>
              ) : (
                <>
                  {[
                    { icon: Linkedin, href: footerData?.social?.linkedin || '#', title: 'LinkedIn', color: 'from-blue-600 to-blue-700' },
                    { icon: Instagram, href: footerData?.social?.instagram || '#', title: 'Instagram', color: 'from-pink-500 to-purple-600' },
                    { icon: Facebook, href: footerData?.social?.facebook || '#', title: 'Facebook', color: 'from-blue-500 to-blue-600' },
                    { icon: Youtube, href: footerData?.social?.youtube || '#', title: 'YouTube', color: 'from-red-500 to-red-600' }
                  ].map((social, index) => (
                    <motion.a
                      key={social.title}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={social.title}
                      className="relative group w-10 h-10 rounded-lg overflow-hidden"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      whileHover={{ 
                        scale: 1.2, 
                        rotate: 5,
                        transition: { duration: 0.3, ease: "easeOut" }
                      }}
                      whileTap={{ scale: 1.9 }}
                      transition={{ 
                        delay: 2.5 + index * 0.1,
                        type: "spring",
                        stiffness: 150,
                        damping: 12,
                        rotate: {
                          type: "spring",
                          stiffness: 200,
                          damping: 15
                        }
                      }}
                    >
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${social.color} opacity-0 group-hover:opacity-100`}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.div
                        className="absolute inset-0 bg-muted group-hover:bg-transparent flex items-center justify-center"
                        transition={{ duration: 0.3 }}
                      >
                        <social.icon className="h-5 w-5 text-muted-foreground group-hover:text-white transition-colors duration-300" />
                      </motion.div>
                      <motion.div
                        className="absolute inset-0 border-2 border-primary/30 rounded-lg"
                        animate={{ 
                          scale: [1, 1.1, 1],
                          opacity: [0, 0.5, 0]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          delay: index * 0.5 
                        }}
                      />
                    </motion.a>
                  ))}
                </>
              )}
            </motion.div>
          </motion.div>

          {/* Desktop: Image right side with Advanced Animations */}
          <motion.div
            initial={{ opacity: 0, y: 100, rotateY: -15 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ duration: 1.2, delay: 0.8, type: "spring", stiffness: 100 }}
            className="hidden lg:flex justify-center lg:justify-end"
          >
            <motion.div
              variants={floatingVariants}
              className="relative group"
            >
              {/* Outer glow effect - Layer 1 */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
              
              {/* Middle glow effect - Layer 2 */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-3xl blur-2xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
              
              {/* Inner glow effect - Layer 3 */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/40 to-accent/40 rounded-3xl blur-xl"
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.4, 0.7, 0.4]
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 1
                }}
              />
              
              {/* Outer animated border - Layer 1 */}
              <motion.div
                className="absolute inset-0 rounded-3xl border-2 border-primary/30"
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
              
              {/* Middle animated border - Layer 2 */}
              <motion.div
                className="absolute inset-0 rounded-3xl border-2 border-primary/50"
                animate={{ 
                  scale: [1, 1.03, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 0.3
                }}
              />
              
              {/* Inner animated border - Layer 3 */}
              <motion.div
                className="absolute inset-0 rounded-3xl border-2 border-primary/70"
                animate={{ 
                  scale: [1, 1.02, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 0.6
                }}
              />
              
            <div className="w-80 h-80 lg:w-96 lg:h-96 relative overflow-hidden rounded-3xl shadow-custom-md">
              {homeData?.profileImage && homeData.profileImage.trim() !== '' ? (
                  <motion.img 
                  src={homeData.profileImage} 
                  alt={homeData?.name || 'Profile'} 
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, delay: 1.2 }}
                    whileHover={{ scale: 1.05 }}
                  onError={(e) => {
                    console.error('Image failed to load:', homeData.profileImage);
                    e.currentTarget.style.display = 'none';
                  }}
                  onLoad={() => console.log('Image loaded successfully:', homeData.profileImage)}
                />
              ) : (
                  <motion.div 
                    className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-6xl font-bold text-primary"
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, delay: 1.2 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {isLoading ? (
                      <motion.div
                        className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <motion.span
                        animate={{ 
                          textShadow: [
                            "0 0 20px hsl(var(--primary) / 0.5)",
                            "0 0 40px hsl(var(--primary) / 0.8)",
                            "0 0 20px hsl(var(--primary) / 0.5)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {homeData?.name ? homeData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'JD'}
                      </motion.span>
                    )}
                  </motion.div>
                )}
                
                {/* Overlay effect on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
            </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}

      </div>
    </section>
  );
};

export default Hero;