import { motion } from 'framer-motion';
import Image from 'next/image';

interface AnimatedIllustrationProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  animation?: 'float' | 'pulse' | 'bounce' | 'scale';
  delay?: number;
}

export default function AnimatedIllustration({
  src,
  alt,
  width,
  height,
  className = '',
  animation = 'float',
  delay = 0,
}: AnimatedIllustrationProps) {
  const animations = {
    float: {
      y: [0, -20, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      },
    },
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      },
    },
    bounce: {
      y: [0, -10, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: [0.8, 0, 1, 1],
        delay,
      },
    },
    scale: {
      scale: [0.95, 1, 0.95],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      },
    },
  };

  return (
    <motion.div
      animate={animations[animation]}
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="object-contain"
      />
    </motion.div>
  );
}
