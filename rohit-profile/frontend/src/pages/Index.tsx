import React from 'react';
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

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Achievements />
        <Testimonials />
        <Team />
        <YouTubeSection />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
