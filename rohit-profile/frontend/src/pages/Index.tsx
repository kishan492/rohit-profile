import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Services from '@/components/sections/Services';
import Testimonials from '@/components/sections/Testimonials';
import Achievements from '@/components/sections/Achievements';
import YouTubeSection from '@/components/sections/YouTubeSection';
import Team from '@/components/sections/Team';
import Blog from '@/components/sections/Blog';
import Contact from '@/components/sections/Contact';

import { SectionVisibility } from '@/services/settingsService';

const Index = () => {
  const [sectionVisibility, setSectionVisibility] = useState<SectionVisibility>({
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

  return (
    <div className="min-h-screen bg-background relative">
      <div className="relative z-20">
        <Header />
        <main>
          {sectionVisibility.hero && <Hero />}
          {sectionVisibility.about && <About />}
          {sectionVisibility.services && <Services />}
          {sectionVisibility.achievements && <Achievements />}
          {sectionVisibility.testimonials && <Testimonials />}
          {sectionVisibility.team && <Team />}
          {sectionVisibility.youtube && <YouTubeSection />}
          {sectionVisibility.blog && <Blog />}
          {sectionVisibility.contact && <Contact />}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
