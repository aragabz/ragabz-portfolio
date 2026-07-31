import { useEffect, useRef, useState } from 'react';

interface TechItem {
  name: string;
  icon: string; // Iconify icon name
  color?: string;
}

interface TechStackMarqueeProps {
  items: TechItem[];
  speed?: number; // pixels per second
  pauseOnHover?: boolean;
  direction?: 'left' | 'right';
}

export default function TechStackMarquee({
  items,
  speed = 50,
  pauseOnHover = true,
  direction = 'left',
}: TechStackMarqueeProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const marqueeElement = marqueeRef.current;
    if (!marqueeElement) return;

    // Duplicate items for seamless loop
    const container = marqueeElement.querySelector('.marquee-content') as HTMLDivElement;
    if (!container) return;

    const clone = container.cloneNode(true) as HTMLDivElement;
    clone.setAttribute('aria-hidden', 'true');
    marqueeElement.appendChild(clone);

    // Calculate animation duration based on speed
    const contentWidth = container.offsetWidth;
    const duration = contentWidth / speed;

    container.style.animationDuration = `${duration}s`;
    clone.style.animationDuration = `${duration}s`;

    return () => {
      if (marqueeElement.contains(clone)) {
        marqueeElement.removeChild(clone);
      }
    };
  }, [speed]);

  return (
    <div
      ref={marqueeRef}
      className="tech-marquee-container"
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      style={{
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        padding: '2rem 0',
      }}
    >
      <div
        className={`marquee-content ${isPaused ? 'paused' : ''}`}
        style={{
          display: 'flex',
          gap: '3rem',
          alignItems: 'center',
          animation: `${direction === 'left' ? 'scroll-left' : 'scroll-right'} 30s linear infinite`,
          animationPlayState: isPaused ? 'paused' : 'running',
        }}
      >
        {items.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="tech-item"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              minWidth: '80px',
              cursor: 'default',
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <div
              style={{
                fontSize: '3rem',
                color: item.color || 'var(--color-text)',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
              }}
            >
              {/* Use iconify icon */}
              <span className={`iconify`} data-icon={item.icon} />
            </div>
            <span
              style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'var(--color-text-secondary)',
                textAlign: 'center',
              }}
            >
              {item.name}
            </span>
          </div>
        ))}
      </div>

      {/* Gradient overlays */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '100px',
          background: 'linear-gradient(to right, var(--color-bg), transparent)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100px',
          background: 'linear-gradient(to left, var(--color-bg), transparent)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .marquee-content.paused {
          animation-play-state: paused !important;
        }

        /* Load Iconify */
        @import url('https://code.iconify.design/3/3.1.0/iconify.min.js');
      `}</style>
    </div>
  );
}

// Default tech stack items
export const defaultTechStack: TechItem[] = [
  { name: 'React', icon: 'logos:react', color: '#61DAFB' },
  { name: 'TypeScript', icon: 'logos:typescript-icon', color: '#3178C6' },
  { name: 'Node.js', icon: 'logos:nodejs-icon', color: '#339933' },
  { name: 'Astro', icon: 'logos:astro-icon', color: '#FF5D01' },
  { name: 'Tailwind', icon: 'logos:tailwindcss-icon', color: '#06B6D4' },
  { name: 'Next.js', icon: 'logos:nextjs-icon', color: '#000000' },
  { name: 'Vue', icon: 'logos:vue', color: '#4FC08D' },
  { name: 'MongoDB', icon: 'logos:mongodb-icon', color: '#47A248' },
  { name: 'PostgreSQL', icon: 'logos:postgresql', color: '#4169E1' },
  { name: 'Docker', icon: 'logos:docker-icon', color: '#2496ED' },
  { name: 'Git', icon: 'logos:git-icon', color: '#F05032' },
  { name: 'AWS', icon: 'logos:aws', color: '#FF9900' },
];
