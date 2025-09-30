import React, { useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const StarField: React.FC = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -80]);

  // Generate pattern only once on component mount
  const generatePattern = () => {
    // Reduced number of stars
    const stars = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 94 + 3,
      y: Math.random() * 94 + 3,
      size: Math.random() * 2 + 1, // Smaller stars
      opacity: Math.random() * 0.7 + 0.3,
    }));

    // Reduced connections with higher distance threshold
    const connections = [];
    for (let i = 0; i < stars.length; i++) {
      // Limit connections per star
      let connectionsForStar = 0;
      for (let j = i + 1; j < stars.length && connectionsForStar < 2; j++) {
        const distance = Math.sqrt(
          Math.pow(stars[i].x - stars[j].x, 2) + Math.pow(stars[i].y - stars[j].y, 2)
        );
        if (distance < 25) {
          connections.push({
            id: `${i}-${j}`,
            x1: stars[i].x,
            y1: stars[i].y,
            x2: stars[j].x,
            y2: stars[j].y,
            opacity: Math.max(0.1, 0.4 - distance / 80),
          });
          connectionsForStar++;
        }
      }
    }
    return { stars, connections };
  };

  // Use useMemo to generate pattern only once
  const pattern = useMemo(() => generatePattern(), []);

  return (
    <div className="hidden lg:block absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      <motion.div 
        style={{ y }} 
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <svg className="w-full h-full">
          {pattern.connections.map((connection) => (
            <motion.line
              key={connection.id}
              x1={`${connection.x1}%`}
              y1={`${connection.y1}%`}
              x2={`${connection.x2}%`}
              y2={`${connection.y2}%`}
              stroke="hsl(var(--primary))"
              strokeWidth="0.5"
              opacity={connection.opacity}
              initial={{ opacity: 0 }}
              animate={{ opacity: connection.opacity }}
              transition={{ duration: 1.5 }}
            />
          ))}
        </svg>
        
        {pattern.stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-primary/70"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              boxShadow: `0 0 ${star.size}px hsl(var(--primary) / 0.3)`,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: star.opacity, scale: 1 }}
            transition={{ duration: 1 }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default StarField;