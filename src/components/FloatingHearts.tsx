import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';

interface HeartIcon {
  id: number;
  x: number;
  color: string;
}

export const FloatingHearts: React.FC<{ trigger: number }> = ({ trigger }) => {
  const [hearts, setHearts] = useState<HeartIcon[]>([]);

  useEffect(() => {
    if (trigger > 0) {
      const newHeart = {
        id: Date.now(),
        x: Math.random() * 100 - 50, // Random horizontal offset
        color: ['#ff4b2b', '#ff416c', '#ff0080', '#7928ca'][Math.floor(Math.random() * 4)],
      };
      setHearts((prev) => [...prev, newHeart]);
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
      }, 2000);
    }
  }, [trigger]);

  return (
    <div className="absolute bottom-20 right-6 pointer-events-none z-50">
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ y: 0, opacity: 1, scale: 0.5, x: 0 }}
            animate={{ 
              y: -300, 
              opacity: 0, 
              scale: 1.5,
              x: heart.x,
              rotate: heart.x * 2
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute"
          >
            <Heart size={24} fill={heart.color} color={heart.color} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
