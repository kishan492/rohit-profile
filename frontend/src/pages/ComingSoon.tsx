import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ComingSoon: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mx-auto"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <Wrench className="h-12 w-12 text-white" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl sm:text-5xl font-bold mb-4"
        >
          <span className="text-gradient">Coming Soon</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-muted-foreground mb-8 leading-relaxed"
        >
          We're working hard to bring you something amazing. This page will be available soon with exciting new features and content.
        </motion.p>

        {/* Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-card p-6 rounded-2xl shadow-custom mb-8 border border-border/50"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Clock className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold">Work in Progress</h3>
          </div>
          <p className="text-muted-foreground">
            Our team is currently developing this section. Please check back later for updates.
          </p>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={() => navigate('/')}
            variant="hero"
            size="lg"
            className="group"
          >
            <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ComingSoon;