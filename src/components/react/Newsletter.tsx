import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

// Validation schema
const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string().optional(),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

interface NewsletterProps {
  // ConvertKit form ID (get from https://app.convertkit.com/forms)
  convertKitFormId?: string;
  
  // Or EmailOctopus List ID (get from https://emailoctopus.com/)
  emailOctopusListId?: string;
  emailOctopusApiKey?: string;
}

export default function Newsletter({
  convertKitFormId = 'YOUR_CONVERTKIT_FORM_ID',
  emailOctopusListId = 'YOUR_EMAILOCTOPUS_LIST_ID',
  emailOctopusApiKey = 'YOUR_EMAILOCTOPUS_API_KEY',
}: NewsletterProps) {
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setSubmitStatus('loading');

    try {
      // Option 1: ConvertKit (recommended for creators/bloggers)
      const response = await fetch(`https://api.convertkit.com/v3/forms/${convertKitFormId}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          first_name: data.firstName || '',
        }),
      });

      // Option 2: EmailOctopus (alternative - affordable)
      // const response = await fetch(`https://emailoctopus.com/api/1.6/lists/${emailOctopusListId}/contacts`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     api_key: emailOctopusApiKey,
      //     email_address: data.email,
      //     fields: {
      //       FirstName: data.firstName || '',
      //     },
      //     status: 'PENDING', // Double opt-in
      //   }),
      // });

      if (response.ok) {
        setSubmitStatus('success');
        reset();
        // Keep success message visible longer for newsletters
        setTimeout(() => setSubmitStatus('idle'), 8000);
      } else {
        throw new Error('Failed to subscribe');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  return (
    <div
      style={{
        padding: '2rem',
        background: 'var(--color-bg-secondary)',
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h3
          style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '0.5rem',
            color: 'var(--color-text)',
          }}
        >
          📧 Subscribe to Newsletter
        </h3>
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--color-text-secondary)',
            lineHeight: '1.5',
          }}
        >
          Get the latest articles and updates delivered to your inbox. No spam, unsubscribe anytime.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Optional First Name Field */}
          <div>
            <input
              {...register('firstName')}
              type="text"
              id="firstName"
              placeholder="First name (optional)"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'var(--color-bg)',
                border: '2px solid var(--color-border)',
                borderRadius: '8px',
                color: 'var(--color-text)',
                fontSize: '0.875rem',
                transition: 'border-color 0.2s ease',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-brand-orange)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
              }}
            />
          </div>

          {/* Email Field */}
          <div>
            <input
              {...register('email')}
              type="email"
              id="newsletter-email"
              placeholder="Enter your email"
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
              disabled={submitStatus === 'loading' || submitStatus === 'success'}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'var(--color-bg)',
                border: `2px solid ${errors.email ? 'var(--color-accent)' : 'var(--color-border)'}`,
                borderRadius: '8px',
                color: 'var(--color-text)',
                fontSize: '0.875rem',
                transition: 'border-color 0.2s ease',
                outline: 'none',
              }}
              onFocus={(e) => {
                if (!errors.email) {
                  e.currentTarget.style.borderColor = 'var(--color-brand-orange)';
                }
              }}
              onBlur={(e) => {
                if (!errors.email) {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                }
              }}
            />
            {errors.email && (
              <p
                id="email-error"
                role="alert"
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.75rem',
                  color: 'var(--color-accent)',
                }}
              >
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitStatus === 'loading' || submitStatus === 'success'}
            style={{
              padding: '0.75rem 1.5rem',
              background:
                submitStatus === 'loading' || submitStatus === 'success'
                  ? 'var(--color-bg-tertiary)'
                  : 'var(--color-brand-orange)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor:
                submitStatus === 'loading' || submitStatus === 'success'
                  ? 'not-allowed'
                  : 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
            onMouseEnter={(e) => {
              if (submitStatus !== 'loading' && submitStatus !== 'success') {
                e.currentTarget.style.background = 'var(--color-accent)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (submitStatus !== 'loading' && submitStatus !== 'success') {
                e.currentTarget.style.background = 'var(--color-brand-orange)';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {submitStatus === 'loading' ? (
              <>
                <svg
                  style={{ animation: 'spin 1s linear infinite' }}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
                Subscribing...
              </>
            ) : submitStatus === 'success' ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Subscribed!
              </>
            ) : (
              'Subscribe'
            )}
          </button>

          {/* Success Message */}
          {submitStatus === 'success' && (
            <div
              role="status"
              aria-live="polite"
              style={{
                padding: '0.75rem',
                background: 'color-mix(in srgb, var(--color-brand-orange) 10%, transparent)',
                border: '1px solid var(--color-brand-orange)',
                borderRadius: '8px',
                color: 'var(--color-brand-orange)',
                fontSize: '0.75rem',
                textAlign: 'center',
              }}
            >
              🎉 Almost there! Check your email to confirm your subscription.
            </div>
          )}

          {/* Error Message */}
          {submitStatus === 'error' && (
            <div
              role="alert"
              aria-live="assertive"
              style={{
                padding: '0.75rem',
                background: 'color-mix(in srgb, var(--color-accent) 10%, transparent)',
                border: '1px solid var(--color-accent)',
                borderRadius: '8px',
                color: 'var(--color-accent)',
                fontSize: '0.75rem',
                textAlign: 'center',
              }}
            >
              ⚠ Failed to subscribe. Please try again later.
            </div>
          )}
        </div>
      </form>

      {/* Privacy Note */}
      <p
        style={{
          marginTop: '1rem',
          fontSize: '0.625rem',
          color: 'var(--color-text-secondary)',
          textAlign: 'center',
          lineHeight: '1.4',
        }}
      >
        Your email is safe with me. I respect your privacy and you can unsubscribe at any time.
      </p>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
