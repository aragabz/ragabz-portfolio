import { Icon } from '@iconify/react';
import { StaggerContainer, StaggerItem } from './Animated';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar?: string;
  quote: string;
  rating?: number;
}

interface TestimonialsProps {
  testimonials?: Testimonial[];
}

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'John Doe',
    role: 'CTO',
    company: 'Tech Corp',
    quote: 'Exceptional developer with great attention to detail. Delivered our project ahead of schedule with outstanding quality.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: 'Product Manager',
    company: 'Startup Inc',
    quote: 'A true professional who understands both technical and business requirements. Highly recommend!',
    rating: 5,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    role: 'Lead Developer',
    company: 'Digital Agency',
    quote: 'Great to work with! Excellent communication skills and deep technical knowledge. Would definitely work together again.',
    rating: 5,
  },
];

export default function Testimonials({ testimonials = defaultTestimonials }: TestimonialsProps) {
  return (
    <section 
      id="testimonials"
      style={{ 
        padding: '6rem 1.5rem',
        background: 'var(--color-bg)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 
            style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700',
              marginBottom: '1rem',
              color: 'var(--color-text)',
            }}
          >
            What People Say
          </h2>
          <p style={{ 
            fontSize: '1.125rem',
            color: 'var(--color-text-secondary)',
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            Testimonials from clients and colleagues I've had the pleasure to work with
          </p>
        </div>

        {/* Testimonials Grid */}
        <StaggerContainer staggerDelay={0.1}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
          }}>
            {testimonials.map((testimonial) => (
              <StaggerItem key={testimonial.id}>
                <div
                  style={{
                    padding: '2rem',
                    background: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Quote Icon */}
                  <div style={{ marginBottom: '1rem' }}>
                    <Icon 
                      icon="mdi:format-quote-open" 
                      width={40} 
                      height={40}
                      style={{ color: 'var(--color-brand-orange)', opacity: 0.3 }}
                    />
                  </div>

                  {/* Rating */}
                  {testimonial.rating && (
                    <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Icon 
                          key={i}
                          icon="mdi:star" 
                          width={20} 
                          height={20}
                          style={{ color: '#fbbf24' }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Quote */}
                  <blockquote
                    style={{
                      fontSize: '1rem',
                      lineHeight: '1.6',
                      color: 'var(--color-text)',
                      marginBottom: '1.5rem',
                      flex: 1,
                      fontStyle: 'italic',
                    }}
                  >
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Author */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {/* Avatar */}
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'var(--color-brand-orange)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '1.125rem',
                      }}
                    >
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>

                    {/* Author Info */}
                    <div>
                      <div style={{ 
                        fontWeight: '600',
                        color: 'var(--color-text)',
                        marginBottom: '0.125rem',
                      }}>
                        {testimonial.name}
                      </div>
                      <div style={{ 
                        fontSize: '0.875rem',
                        color: 'var(--color-text-secondary)',
                      }}>
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <p style={{ 
            fontSize: '1rem',
            color: 'var(--color-text-secondary)',
            marginBottom: '1rem',
          }}>
            Want to work together?
          </p>
          <a
            href="#contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '1rem 2rem',
              background: 'var(--color-brand-orange)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-accent)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-brand-orange)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Get In Touch
            <Icon icon="mdi:arrow-right" width={20} height={20} />
          </a>
        </div>
      </div>
    </section>
  );
}
