import { motion } from 'framer-motion';
import { ReactNode } from 'react';

// Fade In Animation
interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

export function FadeIn({ 
  children, 
  delay = 0, 
  duration = 0.5,
  direction = 'up',
  className = ''
}: FadeInProps) {
  const directionOffset = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
  };

  return (
    <motion.div
      className={className}
      initial={{ 
        opacity: 0,
        ...directionOffset[direction],
      }}
      whileInView={{ 
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ 
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// Scale In Animation
interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function ScaleIn({ 
  children, 
  delay = 0, 
  duration = 0.5,
  className = ''
}: ScaleInProps) {
  return (
    <motion.div
      className={className}
      initial={{ 
        opacity: 0,
        scale: 0.8,
      }}
      whileInView={{ 
        opacity: 1,
        scale: 1,
      }}
      viewport={{ once: true }}
      transition={{ 
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// Stagger Children Animation
interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggerContainer({ 
  children, 
  staggerDelay = 0.1,
  className = ''
}: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className = '' }: StaggerItemProps) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.25, 0.4, 0.25, 1],
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Animated Card with Hover Effect
interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  href?: string;
}

export function AnimatedCard({ 
  children, 
  delay = 0,
  className = '',
  href,
}: AnimatedCardProps) {
  const Component = href ? motion.a : motion.div;
  
  return (
    <Component
      className={className}
      href={href}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
      style={{
        display: 'block',
        cursor: href ? 'pointer' : 'default',
      }}
    >
      {children}
    </Component>
  );
}

// Animated Button
interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  className?: string;
}

export function AnimatedButton({ 
  children, 
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
}: AnimatedButtonProps) {
  const variants = {
    primary: {
      background: 'var(--color-brand-orange)',
      color: 'white',
      border: 'none',
    },
    secondary: {
      background: 'var(--color-bg-secondary)',
      color: 'var(--color-text)',
      border: '1px solid var(--color-border)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--color-brand-orange)',
      border: '2px solid var(--color-brand-orange)',
    },
  };

  return (
    <motion.button
      className={className}
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '0.75rem 1.5rem',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        ...variants[variant],
      }}
      whileHover={!disabled ? { 
        scale: 1.05,
        transition: { duration: 0.2 },
      } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      initial={{ opacity: 0 }}
      animate={{ opacity: disabled ? 0.6 : 1 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.button>
  );
}

// Slide In Animation
interface SlideInProps {
  children: ReactNode;
  direction?: 'left' | 'right';
  delay?: number;
  className?: string;
}

export function SlideIn({ 
  children, 
  direction = 'left',
  delay = 0,
  className = ''
}: SlideInProps) {
  return (
    <motion.div
      className={className}
      initial={{ 
        opacity: 0,
        x: direction === 'left' ? -100 : 100,
      }}
      whileInView={{ 
        opacity: 1,
        x: 0,
      }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.6,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// Bounce Animation
interface BounceProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function Bounce({ 
  children, 
  delay = 0,
  className = ''
}: BounceProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.6,
        delay,
        type: 'spring',
        stiffness: 200,
        damping: 10,
      }}
    >
      {children}
    </motion.div>
  );
}

// Rotate Animation
interface RotateInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function RotateIn({ 
  children, 
  delay = 0,
  className = ''
}: RotateInProps) {
  return (
    <motion.div
      className={className}
      initial={{ 
        opacity: 0,
        rotate: -180,
        scale: 0,
      }}
      whileInView={{ 
        opacity: 1,
        rotate: 0,
        scale: 1,
      }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.8,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// Parallax Scroll Effect
interface ParallaxProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export function Parallax({ 
  children, 
  speed = 50,
  className = ''
}: ParallaxProps) {
  return (
    <motion.div
      className={className}
      style={{ y: 0 }}
      whileInView={{ y: speed }}
      transition={{ 
        duration: 0,
      }}
    >
      {children}
    </motion.div>
  );
}
