import React from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  animationType: 'instant' | 'transition';
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, animationType }) => {
  const spring = useSpring(value, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  const display = useTransform(spring, (current) => 
    Math.round(current).toLocaleString()
  );

  React.useEffect(() => {
    if (animationType === 'transition') {
      spring.set(value);
    } else {
      spring.jump(value);
    }
  }, [value, animationType, spring]);

  return <motion.span>{display}</motion.span>;
};