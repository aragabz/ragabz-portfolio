import { useEffect, useRef, useState } from 'react';

interface Achievement {
  text: string;
}

interface Experience {
  company: string;
  role: string;
  duration: string;
  achievements: Achievement[] | string[];
}

interface TimelineProps {
  experiences: Experience[];
}

export default function EnhancedTimeline({ experiences }: TimelineProps) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<number>>(
    () => new Set()
  );
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleItem = (index: number) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute('data-index'));
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set(prev).add(index));
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px',
      }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [experiences]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative">
        {/* Animated Timeline Line */}
        <div
          className="absolute left-0 md:left-8 top-0 w-px transition-all duration-1000"
          style={{
            height: '100%',
            background: 'linear-gradient(to bottom, var(--color-brand-orange) 0%, var(--color-brand-gray-light) 100%)',
          }}
        />

        {experiences.map((exp, index) => {
          const isVisible = visibleItems.has(index);
          const isExpanded = expandedItems.has(index);
          const achievements = exp.achievements.map(a => typeof a === 'string' ? a : a.text);

          return (
            <div
              key={`${exp.company}-${index}`}
              ref={(el) => (itemRefs.current[index] = el)}
              data-index={index}
              className="relative pl-12 md:pl-20 pb-12"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
                transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`,
              }}
            >
              {/* Animated Timeline Dot with Pulse */}
              <div
                className="absolute left-0 md:left-6 w-4 h-4 rounded-full border-4 z-10"
                style={{
                  backgroundColor: 'var(--color-brand-orange)',
                  borderColor: 'var(--color-bg)',
                  transform: isVisible ? 'scale(1)' : 'scale(0)',
                  transition: `transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.15}s`,
                  boxShadow: isVisible
                    ? '0 0 0 0 rgba(255, 93, 1, 0)'
                    : '0 0 0 8px rgba(255, 93, 1, 0.4)',
                  animation: isVisible ? 'pulse-dot 2s ease-out infinite' : 'none',
                }}
              />

              {/* Card with Slide-in Animation */}
              <div
                className="border rounded-lg p-6 transition-all duration-300 hover:shadow-xl"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: isVisible ? 'var(--color-brand-orange)' : 'var(--color-border)',
                  transform: 'translateY(0)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'var(--color-brand-orange)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Header */}
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  aria-expanded={isExpanded}
                  className="flex w-full flex-wrap justify-between items-start mb-2 gap-2 cursor-pointer text-left bg-transparent border-none p-0"
                >
                  <h3
                    className="text-xl font-semibold"
                    style={{
                      color: 'var(--color-text)',
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
                      transition: `all 0.5s ease ${index * 0.1 + 0.2}s`,
                    }}
                  >
                    {exp.role}
                  </h3>
                  <span
                    className="text-sm px-3 py-1 rounded-full font-medium"
                    style={{
                      color: 'var(--color-text-secondary)',
                      backgroundColor: 'var(--color-bg)',
                      opacity: isVisible ? 1 : 0,
                      transition: `opacity 0.5s ease ${index * 0.1 + 0.3}s`,
                    }}
                  >
                    {exp.duration}
                  </span>
                </button>

                {/* Company */}
                <p
                  className="font-medium mb-4"
                  style={{
                    color: 'var(--color-brand-orange)',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
                    transition: `all 0.5s ease ${index * 0.1 + 0.3}s`,
                  }}
                >
                  {exp.company}
                </p>

                {/* Expand/Collapse Toggle */}
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  aria-expanded={isExpanded}
                  className="flex items-center gap-2 mb-4 text-sm font-medium cursor-pointer bg-transparent border-none p-0"
                  style={{
                    color: 'var(--color-brand-orange)',
                    opacity: isVisible ? 1 : 0,
                    transition: `all 0.5s ease ${index * 0.1 + 0.35}s`,
                  }}
                >
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                  {isExpanded ? 'Hide details' : 'Show details'}
                </button>

                {/* Achievements with Staggered Animation */}
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                  style={{
                    gridTemplateRows: isExpanded ? '1fr' : '0fr',
                  }}
                >
                  <div className="overflow-hidden">
                <ul className="space-y-2">
                  {achievements.map((achievement, achIndex) => (
                    <li
                      key={achIndex}
                      className="flex items-start gap-2"
                      style={{
                        color: 'var(--color-text-secondary)',
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
                        transition: `all 0.5s ease ${index * 0.1 + achIndex * 0.1 + 0.4}s`,
                      }}
                    >
                      <svg
                        className="w-5 h-5 flex-shrink-0 mt-0.5"
                        style={{ color: 'var(--color-brand-orange)' }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Keyframe Animation */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(255, 93, 1, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(255, 93, 1, 0);
          }
        }
      `}</style>
    </div>
  );
}
