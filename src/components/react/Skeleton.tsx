import { motion } from 'framer-motion';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  count?: number;
  className?: string;
}

export default function Skeleton({ 
  width = '100%', 
  height = '1rem',
  variant = 'rectangular',
  count = 1,
  className = ''
}: SkeletonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'text':
        return {
          width,
          height: height || '1rem',
          borderRadius: '4px',
        };
      case 'circular':
        return {
          width: width || '40px',
          height: height || '40px',
          borderRadius: '50%',
        };
      case 'card':
        return {
          width,
          height: height || '200px',
          borderRadius: '12px',
        };
      case 'rectangular':
      default:
        return {
          width,
          height,
          borderRadius: '8px',
        };
    }
  };

  const skeletonStyle = {
    ...getVariantStyles(),
    background: 'linear-gradient(90deg, var(--color-bg-secondary) 25%, var(--color-bg-tertiary) 50%, var(--color-bg-secondary) 75%)',
    backgroundSize: '200% 100%',
    position: 'relative' as const,
    overflow: 'hidden',
  };

  const items = Array.from({ length: count }, (_, i) => i);

  if (count === 1) {
    return (
      <motion.div
        className={className}
        style={skeletonStyle}
        animate={{
          backgroundPosition: ['200% 0', '-200% 0'],
        }}
        transition={{
          duration: 1.5,
          ease: 'linear',
          repeat: Infinity,
        }}
        aria-label="Loading..."
        role="status"
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {items.map((i) => (
        <motion.div
          key={i}
          className={className}
          style={skeletonStyle}
          animate={{
            backgroundPosition: ['200% 0', '-200% 0'],
          }}
          transition={{
            duration: 1.5,
            ease: 'linear',
            repeat: Infinity,
            delay: i * 0.1,
          }}
          aria-label="Loading..."
          role="status"
        />
      ))}
    </div>
  );
}

// Pre-built skeleton components for common use cases
export function SkeletonCard() {
  return (
    <div style={{ 
      padding: '1.5rem',
      background: 'var(--color-bg-secondary)',
      borderRadius: '12px',
      border: '1px solid var(--color-border)',
    }}>
      <Skeleton variant="rectangular" height="200px" width="100%" />
      <div style={{ marginTop: '1rem' }}>
        <Skeleton variant="text" height="1.5rem" width="70%" />
        <Skeleton variant="text" height="1rem" width="100%" count={2} />
      </div>
      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
        <Skeleton variant="rectangular" height="2rem" width="80px" />
        <Skeleton variant="rectangular" height="2rem" width="80px" />
      </div>
    </div>
  );
}

export function SkeletonPost() {
  return (
    <div style={{ 
      padding: '2rem',
      background: 'var(--color-bg-secondary)',
      borderRadius: '12px',
      border: '1px solid var(--color-border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <Skeleton variant="circular" width="48px" height="48px" />
        <div style={{ flex: 1 }}>
          <Skeleton variant="text" height="1rem" width="150px" />
          <Skeleton variant="text" height="0.875rem" width="100px" />
        </div>
      </div>
      <Skeleton variant="text" height="1.75rem" width="80%" />
      <div style={{ marginTop: '1rem' }}>
        <Skeleton variant="text" height="1rem" width="100%" count={3} />
      </div>
      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
        <Skeleton variant="rectangular" height="1.5rem" width="60px" />
        <Skeleton variant="rectangular" height="1.5rem" width="80px" />
        <Skeleton variant="rectangular" height="1.5rem" width="70px" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  const items = Array.from({ length: count }, (_, i) => i);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {items.map((i) => (
        <div 
          key={i}
          style={{ 
            display: 'flex', 
            gap: '1rem',
            padding: '1rem',
            background: 'var(--color-bg-secondary)',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
          }}
        >
          <Skeleton variant="rectangular" width="80px" height="80px" />
          <div style={{ flex: 1 }}>
            <Skeleton variant="text" height="1.25rem" width="60%" />
            <Skeleton variant="text" height="1rem" width="100%" count={2} />
          </div>
        </div>
      ))}
    </div>
  );
}
