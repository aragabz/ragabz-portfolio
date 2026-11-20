import { useState } from 'react';

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactForm() {
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    const formId = import.meta.env.PUBLIC_FORMSPREE_ID;
    if (!formId) {
      setErrors(prev => ({ ...prev, form: 'Contact form is not configured. Please email me directly instead.' }));
      setSubmitStatus('error');
      return;
    }

    setSubmitStatus('submitting');

    try {
      const response = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        e.currentTarget.reset();
      } else {
        const errorData = await response.json();
        setErrors(prev => ({ ...prev, form: errorData.message || 'Failed to send message' }));
        setSubmitStatus('error');
      }
    } catch (err) {
      setErrors(prev => ({ ...prev, form: 'Network error. Please try again.' }));
      setSubmitStatus('error');
    }
  };

  return (
    <div>
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
              className="form-field"
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
              className="form-field"
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
              className="form-field"
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
              className="form-field"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitStatus === 'submitting'}
          >
            {submitStatus === 'submitting' ? (
              <span style={{ flexShrink: 0 }}>Sending...</span>
            ) : (
              <span>Send message</span>
            )}
          </button>

          {submitStatus === 'success' && (
            <div role="status" aria-live="polite" className="form-status form-status-ok">
              <span>Message sent successfully!</span>
            </div>
          )}

          {submitStatus === 'error' && (
            <div role="alert" aria-live="assertive" className="form-status">
              <span>{errors.form || 'Failed to send message. Please try again.'}</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}