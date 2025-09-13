import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import emailjs from '@emailjs/browser';

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSubmitting(true);
    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      alert('Message sent successfully!');
      formRef.current.reset();
    } catch (error) {
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0,
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us an email anytime',
      value: 'hello@portfolio.com',
      action: 'mailto:hello@portfolio.com',
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Mon-Fri from 8am to 6pm',
      value: '+1 (555) 123-4567',
      action: 'tel:+15551234567',
    },
    {
      icon: MessageSquare,
      title: 'WhatsApp',
      description: 'Chat with us directly',
      value: '+1 (555) 123-4567',
      action: 'https://wa.me/15551234567',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      description: 'Come say hello',
      value: 'San Francisco, CA',
      action: '#',
    },
  ];



  return (
    <section id="contact" className="py-20 min-h-screen flex items-center">
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
              Get In <span className="text-gradient">Touch</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ready to start your project? Have a question? We'd love to hear from you. 
              Let's create something amazing together.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              <div className="bg-card rounded-3xl p-8 shadow-custom-lg border border-border/50">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
                    <Send className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">Send us a message</h3>
                    <p className="text-muted-foreground">We'll get back to you within 24 hours</p>
                  </div>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name</label>
                      <Input name="first_name" placeholder="John" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name</label>
                      <Input name="last_name" placeholder="Doe" required />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input name="user_email" type="email" placeholder="john@example.com" required />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <Input name="subject" placeholder="What's this about?" required />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <Textarea 
                      name="message"
                      placeholder="Tell us about your project or question..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" variant="hero" className="w-full" size="lg" disabled={isSubmitting}>
                    <Send className="mr-2 h-5 w-5" />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants} className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-foreground">Other ways to reach us</h3>
                
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <motion.a
                      key={info.title}
                      href={info.action}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-start gap-4 p-6 bg-card rounded-2xl shadow-custom hover:shadow-custom-md transition-all duration-300 border border-border/50 hover:border-primary/20 group"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center group-hover:from-primary group-hover:to-accent transition-all duration-300">
                        <info.icon className="h-6 w-6 text-primary group-hover:text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{info.title}</h4>
                        <p className="text-sm text-muted-foreground mb-1">{info.description}</p>
                        <p className="font-medium text-primary">{info.value}</p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-card rounded-2xl p-6 shadow-custom border border-border/50">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                  <h4 className="font-semibold text-foreground">Business Hours</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monday - Friday</span>
                    <span className="font-medium">8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="font-medium">9:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                </div>
              </div>


            </motion.div>
          </div>

          {/* FAQ Link */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-8 border border-primary/20">
              <h3 className="text-xl font-bold mb-4">Still have questions?</h3>
              <p className="text-muted-foreground mb-6">
                Check out our frequently asked questions or schedule a free consultation call.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline">
                  View FAQ
                </Button>
                <Button variant="hero">
                  Schedule Call
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;