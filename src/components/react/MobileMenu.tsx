import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

interface MobileMenuProps {
  links?: Array<{ href: string; label: string }>;
}

export default function MobileMenu({ 
  links = [
    { href: '#about', label: 'About' },
    { href: '#experience', label: 'Experience' },
    { href: '#blog', label: 'Blog' },
    { href: '#contact', label: 'Contact' },
  ]
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Menu Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        style={{
          padding: '0.5rem',
          background: 'transparent',
          border: 'none',
          color: 'var(--color-text)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001,
          position: 'relative',
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Icon icon="mdi:close" width={28} height={28} />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Icon icon="mdi:menu" width={28} height={28} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 999,
            }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '85%',
              maxWidth: '400px',
              background: 'var(--color-bg)',
              boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.2)',
              zIndex: 1000,
              overflowY: 'auto',
              padding: '5rem 2rem 2rem',
            }}
            aria-label="Mobile navigation"
          >
            {/* Menu Items */}
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {links.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 + 0.1 }}
                  style={{ marginBottom: '1rem' }}
                >
                  <a
                    href={link.href}
                    onClick={handleLinkClick}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      color: 'var(--color-text)',
                      textDecoration: 'none',
                      fontSize: '1.25rem',
                      fontWeight: '500',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--color-bg-secondary)';
                      e.currentTarget.style.color = 'var(--color-brand-orange)';
                      e.currentTarget.style.transform = 'translateX(8px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--color-text)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <Icon 
                      icon={getIconForLink(link.label)} 
                      width={24} 
                      height={24}
                      style={{ flexShrink: 0 }}
                    />
                    <span>{link.label}</span>
                  </a>
                </motion.li>
              ))}
            </ul>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                height: '1px',
                background: 'var(--color-border)',
                margin: '2rem 0',
                transformOrigin: 'left',
              }}
            />

            {/* Social Links */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p style={{ 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: 'var(--color-text-secondary)',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                Connect
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {[
                  { icon: 'mdi:github', label: 'GitHub', href: 'https://github.com/aragabz' },
                  { icon: 'mdi:linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/aragabz/' },
                  { icon: 'mdi:email', label: 'Email', href: 'mailto:ahmedragab.se@gmail.com' },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'var(--color-bg-secondary)',
                      color: 'var(--color-text)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--color-brand-orange)';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--color-bg-secondary)';
                      e.currentTarget.style.color = 'var(--color-text)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <Icon icon={social.icon} width={24} height={24} />
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

// Helper function to get appropriate icons
function getIconForLink(label: string): string {
  const iconMap: Record<string, string> = {
    'About': 'mdi:account-circle',
    'Experience': 'mdi:briefcase',
    'Blog': 'mdi:post',
    'Contact': 'mdi:email',
  };
  return iconMap[label] || 'mdi:chevron-right';
}
