import { useEffect, useState } from 'react';

interface RecaptchaProps {
  siteKey: string;
  onVerify: (token: string) => void;
  action?: string;
}

/**
 * Google reCAPTCHA v3 Component
 * 
 * This component loads the reCAPTCHA v3 script and provides a method
 * to execute reCAPTCHA challenges invisibly (no checkbox needed).
 * 
 * @example
 * ```tsx
 * const handleRecaptchaVerify = (token: string) => {
 *   // Send token to your backend for verification
 *   console.log('reCAPTCHA token:', token);
 * };
 * 
 * <Recaptcha
 *   siteKey={import.meta.env.PUBLIC_RECAPTCHA_SITE_KEY}
 *   onVerify={handleRecaptchaVerify}
 *   action="contact_form"
 * />
 * ```
 */
export default function Recaptcha({ siteKey, onVerify, action = 'submit' }: RecaptchaProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!siteKey) {
      setError('reCAPTCHA site key is missing');
      return;
    }

    // Check if reCAPTCHA script is already loaded
    if (window.grecaptcha) {
      setIsLoaded(true);
      return;
    }

    // Load reCAPTCHA script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      setError('Failed to load reCAPTCHA script');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup: remove script if component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [siteKey]);

  useEffect(() => {
    if (isLoaded && window.grecaptcha) {
      window.grecaptcha.ready(() => {
        window.grecaptcha.execute(siteKey, { action }).then((token) => {
          onVerify(token);
        }).catch((err) => {
          setError('reCAPTCHA execution failed');
          console.error('reCAPTCHA error:', err);
        });
      });
    }
  }, [isLoaded, siteKey, action, onVerify]);

  if (error) {
    console.error(error);
  }

  // reCAPTCHA v3 is invisible, so we don't render anything
  return null;
}

// TypeScript declaration for grecaptcha
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}
