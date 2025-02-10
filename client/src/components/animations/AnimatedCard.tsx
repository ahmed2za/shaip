import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
}

export default function AnimatedCard({
  children,
  className = '',
  delay = 0,
  onClick,
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay,
        ease: 'easeOut',
      }}
      whileHover={{
        y: -5,
        transition: { duration: 0.2 },
      }}
      className={`
        bg-white rounded-lg shadow-lg overflow-hidden
        transform transition-all duration-300
        hover:shadow-xl
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
