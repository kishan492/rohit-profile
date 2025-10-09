import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { testimonialsService, TestimonialsData } from '@/services/testimonialsService';

const Testimonials: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    rating: 0,
    content: ''
  });

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

  const [testimonials, setTestimonials] = useState([
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'CEO, TechStart',
      avatar: 'SJ',
      content: 'Working with this team transformed our digital presence. Their expertise in both development and strategy delivered results beyond our expectations.',
      rating: 5,
      status: 'approved'
    },
    {
      id: '2',
      name: 'Michael Chen',
      role: 'Marketing Director, InnovateCorp',
      avatar: 'MC',
      content: 'The content creation and YouTube strategy helped us reach 100K+ views. Professional, creative, and results-driven approach.',
      rating: 5,
      status: 'approved'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      role: 'Founder, StartupHub',
      avatar: 'ER',
      content: 'From concept to launch, they guided us through every step. The website development was flawless and the ongoing support exceptional.',
      rating: 5,
      status: 'approved'
    },
  ]);

  useEffect(() => {
    const handleTestimonialsUpdate = () => {
      const adminData = localStorage.getItem('adminTestimonials');
      if (adminData) {
        const parsed = JSON.parse(adminData);
        const approved = parsed.filter((t: any) => t.status === 'approved');
        setTestimonials(approved.length > 0 ? approved : testimonials);
      }
    };

    // Initial check for testimonials in localStorage
    handleTestimonialsUpdate();

    // Set up polling for mobile devices to check for updates
    const checkInterval = setInterval(handleTestimonialsUpdate, 3000);
    
    // Also keep the event listener for desktop
    window.addEventListener('testimonialsDataUpdated', handleTestimonialsUpdate);
    
    return () => {
      window.removeEventListener('testimonialsDataUpdated', handleTestimonialsUpdate);
      clearInterval(checkInterval);
    };
  }, []);

  const approvedTestimonials = testimonials.filter(t => t.status === 'approved');

  return (
    <section id="testimonials" className="py-20 bg-muted/30 min-h-screen flex items-center">
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
              What Our <span className="text-gradient">Clients Say</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our clients have to say about working with us.
            </p>
          </motion.div>

          {/* Testimonials Infinite Scroll */}
          <div className="overflow-hidden">
            <motion.div
              animate={{ x: [0, -approvedTestimonials.length * 400] }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: 'linear',
                repeatType: 'loop'
              }}
              className="flex gap-8 items-center whitespace-nowrap will-change-transform"
              style={{ transform: 'translateZ(0)' }}
            >
              {[...approvedTestimonials, ...approvedTestimonials, ...approvedTestimonials].map((testimonial, index) => (
                <motion.div
                  key={`${testimonial.id || testimonial.name}-${index}`}
                  className="group bg-card rounded-3xl p-8 shadow-custom border border-border/50 relative flex-shrink-0 w-96 transform-gpu"
                >
                  {/* Quote Icon */}
                  <div className="absolute top-6 right-6 text-primary/20">
                    <Quote className="h-8 w-8" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>

                  {/* Content */}
                  <blockquote className="text-muted-foreground mb-6 leading-relaxed italic whitespace-normal">
                    "{testimonial.content}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-custom">
                      <span className="text-white font-bold text-sm">
                        {testimonial.avatar || testimonial.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Feedback Form */}
          <motion.div
            variants={itemVariants}
            className="mt-16"
          >
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-8 border border-primary/20">
              <h3 className="text-2xl font-bold mb-4 text-center">Share Your Experience</h3>
              <p className="text-muted-foreground mb-6 text-center max-w-2xl mx-auto">
                We'd love to hear about your experience working with us. Your feedback helps us improve and helps others make informed decisions.
              </p>
              
              <form className="max-w-2xl mx-auto space-y-4" onSubmit={(e) => {
                e.preventDefault();
                console.log('Form submitted:', formData);
                
                if (!formData.name.trim()) {
                  alert('Please enter your name');
                  return;
                }
                if (!formData.role.trim()) {
                  alert('Please enter your role & company');
                  return;
                }
                if (formData.rating === 0) {
                  alert('Please select a rating');
                  return;
                }
                if (!formData.content.trim()) {
                  alert('Please write your review');
                  return;
                }
                
                try {
                  const newReview = {
                    id: Date.now().toString(),
                    name: formData.name.trim(),
                    role: formData.role.trim(),
                    rating: formData.rating,
                    content: formData.content.trim(),
                    date: new Date().toISOString().split('T')[0],
                    status: 'pending'
                  };
                  
                  const existing = JSON.parse(localStorage.getItem('adminTestimonials') || '[]');
                  const updated = [...existing, newReview];
                  localStorage.setItem('adminTestimonials', JSON.stringify(updated));
                  
                  setFormData({ name: '', role: '', rating: 0, content: '' });
                  alert('Thank you! Your review has been submitted for approval.');
                } catch (error) {
                  console.error('Error submitting review:', error);
                  alert('Error submitting review. Please try again.');
                }
              }}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Your Role & Company"
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-4 py-3 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">Rating:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                          className={`text-2xl transition-colors ${
                            star <= formData.rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'
                          }`}
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <textarea
                    placeholder="Share your experience working with us..."
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    required
                  />
                </div>
                
                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-2xl font-medium hover:bg-primary/90 transition-colors shadow-custom hover:shadow-custom-md"
                  >
                    Submit Feedback
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;