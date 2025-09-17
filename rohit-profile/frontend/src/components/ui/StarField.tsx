import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const StarField: React.FC = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -80]);

  const [patternKey, setPatternKey] = useState(0);

  // Generate new pattern on each cycle
  const generatePattern = () => {
    const stars = Array.from({ length: 35 }, (_, i) => ({
      id: i,
      x: Math.random() * 94 + 3,
      y: Math.random() * 94 + 3,
      size: Math.random() * 3 + 1.5,
      opacity: Math.random() * 0.8 + 0.5,
    }));

    const connections = [];
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const distance = Math.sqrt(
          Math.pow(stars[i].x - stars[j].x, 2) + Math.pow(stars[i].y - stars[j].y, 2)
        );
        if (distance < 30) {
          connections.push({
            id: `${i}-${j}`,
            x1: stars[i].x,
            y1: stars[i].y,
            x2: stars[j].x,
            y2: stars[j].y,
            opacity: Math.max(0.2, 0.5 - distance / 80),
          });
        }
      }
    }
    return { stars, connections };
  };

  const [pattern, setPattern] = useState(generatePattern);

  useEffect(() => {
    const interval = setInterval(() => {
      setPattern(generatePattern());
      setPatternKey(prev => prev + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      <motion.div 
        style={{ y }} 
        className="absolute inset-0"
        animate={{ opacity: [1, 1, 0.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
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
              strokeWidth="0.8"
              opacity={connection.opacity}
              filter="drop-shadow(0 0 1px hsl(var(--primary) / 0.3))"
              animate={{ pathLength: [0, 1, 1, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </svg>
        
        {pattern.stars.map((star) => (
          <motion.div
            key={`${patternKey}-${star.id}`}
            className="absolute rounded-full bg-primary/70"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              boxShadow: `0 0 ${star.size * 4}px hsl(var(--primary) / 0.6), 0 0 ${star.size * 8}px hsl(var(--primary) / 0.3)`,
            }}
            animate={{
              opacity: [0, star.opacity, star.opacity, 0],
              scale: [0.9, 1.1, 1.1, 0.9],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default StarField;