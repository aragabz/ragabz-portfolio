import { useState } from 'react';

type SubmitStatus = 'idle' | 'success';

export default function ContactForm() {
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    const fullSubject = encodeURIComponent(`Contact Form: ${subject} from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`);

    window.location.href = `mailto:ahmedragab.se@gmail.com?subject=${fullSubject}&body=${body}`;
    setSubmitStatus('success');
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--color-text)' }}>
              Name <span style={{ color: 'var(--color-accent)' }}>*</span>
            </label>
            <input
              name="name"
              type="text"
              id="name"
              placeholder="John Doe"
              required
              minLength={2}
              maxLength={100}
              style={{
                width: '100%', padding: '0.75rem 1rem', background: 'var(--color-bg-secondary)',
                border: '2px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text)', fontSize: '1rem', outline: 'none'
              }}
            />
          </div>

          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--color-text)' }}>
              Email <span style={{ color: 'var(--color-accent)' }}>*</span>
            </label>
            <input
              name="email"
              type="email"
              id="email"
              placeholder="john@example.com"
              required
              maxLength={100}
              style={{
                width: '100%', padding: '0.75rem 1rem', background: 'var(--color-bg-secondary)',
                border: '2px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text)', fontSize: '1rem', outline: 'none'
              }}
            />
          </div>

          <div>
            <label htmlFor="subject" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--color-text)' }}>
              Subject <span style={{ color: 'var(--color-accent)' }}>*</span>
            </label>
            <input
              name="subject"
              type="text"
              id="subject"
              placeholder="Project inquiry"
              required
              minLength={3}
              maxLength={200}
              style={{
                width: '100%', padding: '0.75rem 1rem', background: 'var(--color-bg-secondary)',
                border: '2px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text)', fontSize: '1rem', outline: 'none'
              }}
            />
          </div>

          <div>
            <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--color-text)' }}>
              Message <span style={{ color: 'var(--color-accent)' }}>*</span>
            </label>
            <textarea
              name="message"
              id="message"
              rows={6}
              placeholder="Tell me about your project..."
              required
              minLength={10}
              maxLength={1000}
              style={{
                width: '100%', padding: '0.75rem 1rem', background: 'var(--color-bg-secondary)',
                border: '2px solid var(--color-border)', borderRadius: '8px', color: 'var(--color-text)', fontSize: '1rem', outline: 'none',
                resize: 'vertical', fontFamily: 'inherit'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '1rem 2rem',
              background: 'var(--color-brand-orange)',
              color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600',
              cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
            }}
          >
            Send Message
          </button>

          {submitStatus === 'success' && (
            <div role="status" aria-live="polite" style={{
              padding: '1rem', background: 'color-mix(in srgb, var(--color-brand-orange) 10%, transparent)',
              border: '1px solid var(--color-brand-orange)', borderRadius: '8px', color: 'var(--color-brand-orange)',
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
              <span>Opening your email client...</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
