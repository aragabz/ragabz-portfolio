import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200, 'Subject is too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message is too long'),
});

type ContactFormData = z.infer<typeof contactSchema>;

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

interface ContactFormProps {
  formspreeId?: string;
}

export default function ContactForm({ formspreeId = 'YOUR_FORMSPREE_ID' }: ContactFormProps) {
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitStatus('loading');

    try {
      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus('success');
        reset();
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--color-text)' }}>
              Name <span style={{ color: 'var(--color-accent)' }}>*</span>
            </label>
            <input
              {...register('name')}
              type="text"
              id="name"
              placeholder="John Doe"
              aria-invalid={errors.name ? 'true' : 'false'}
              aria-describedby={errors.name ? 'name-error' : undefined}
              style={{
                width: '100%', padding: '0.75rem 1rem', background: 'var(--color-bg-secondary)',
                border: `2px solid ${errors.name ? 'var(--color-accent)' : 'var(--color-border)'}`,
                borderRadius: '8px', color: 'var(--color-text)', fontSize: '1rem', outline: 'none'
              }}
            />
            {errors.name && <p id="name-error" role="alert" style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--color-accent)' }}>{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--color-text)' }}>
              Email <span style={{ color: 'var(--color-accent)' }}>*</span>
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              placeholder="john@example.com"
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
              style={{
                width: '100%', padding: '0.75rem 1rem', background: 'var(--color-bg-secondary)',
                border: `2px solid ${errors.email ? 'var(--color-accent)' : 'var(--color-border)'}`,
                borderRadius: '8px', color: 'var(--color-text)', fontSize: '1rem', outline: 'none'
              }}
            />
            {errors.email && <p id="email-error" role="alert" style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--color-accent)' }}>{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="subject" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--color-text)' }}>
              Subject <span style={{ color: 'var(--color-accent)' }}>*</span>
            </label>
            <input
              {...register('subject')}
              type="text"
              id="subject"
              placeholder="Project inquiry"
              aria-invalid={errors.subject ? 'true' : 'false'}
              aria-describedby={errors.subject ? 'subject-error' : undefined}
              style={{
                width: '100%', padding: '0.75rem 1rem', background: 'var(--color-bg-secondary)',
                border: `2px solid ${errors.subject ? 'var(--color-accent)' : 'var(--color-border)'}`,
                borderRadius: '8px', color: 'var(--color-text)', fontSize: '1rem', outline: 'none'
              }}
            />
            {errors.subject && <p id="subject-error" role="alert" style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--color-accent)' }}>{errors.subject.message}</p>}
          </div>

          <div>
            <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--color-text)' }}>
              Message <span style={{ color: 'var(--color-accent)' }}>*</span>
            </label>
            <textarea
              {...register('message')}
              id="message"
              rows={6}
              placeholder="Tell me about your project..."
              aria-invalid={errors.message ? 'true' : 'false'}
              aria-describedby={errors.message ? 'message-error' : undefined}
              style={{
                width: '100%', padding: '0.75rem 1rem', background: 'var(--color-bg-secondary)',
                border: `2px solid ${errors.message ? 'var(--color-accent)' : 'var(--color-border)'}`,
                borderRadius: '8px', color: 'var(--color-text)', fontSize: '1rem', outline: 'none',
                resize: 'vertical', fontFamily: 'inherit'
              }}
            />
            {errors.message && <p id="message-error" role="alert" style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--color-accent)' }}>{errors.message.message}</p>}
          </div>

          <button
            type="submit"
            disabled={submitStatus === 'loading'}
            style={{
              padding: '1rem 2rem',
              background: submitStatus === 'loading' ? 'var(--color-bg-tertiary)' : 'var(--color-brand-orange)',
              color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600',
              cursor: submitStatus === 'loading' ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
            }}
          >
            {submitStatus === 'loading' ? 'Sending...' : 'Send Message'}
          </button>

          {submitStatus === 'success' && (
            <div role="status" aria-live="polite" style={{
              padding: '1rem', background: 'color-mix(in srgb, var(--color-brand-orange) 10%, transparent)',
              border: '1px solid var(--color-brand-orange)', borderRadius: '8px', color: 'var(--color-brand-orange)',
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
              <span>✓ Message sent successfully! I'll get back to you soon.</span>
            </div>
          )}

          {submitStatus === 'error' && (
            <div role="alert" aria-live="assertive" style={{
              padding: '1rem', background: 'color-mix(in srgb, var(--color-accent) 10%, transparent)',
              border: '1px solid var(--color-accent)', borderRadius: '8px', color: 'var(--color-accent)',
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
              <span>⚠ Failed to send message. Please try again or email me directly.</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
