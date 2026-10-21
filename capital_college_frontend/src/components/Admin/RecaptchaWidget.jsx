import React, { useState, useEffect, useRef } from 'react';

/**
 * RecaptchaWidget
 * Google reCAPTCHA v2 Checkbox.
 * - Only Google-issued tokens are emitted.
 * - Missing site-key configuration is reported instead of simulating verification.
 *
 * Registration: https://www.google.com/recaptcha/admin
 */
export default function RecaptchaWidget({
  verified = false,
  onVerify,
  onExpire,
  disabled = false,
  hasError = false,
  resetKey = 0
}) {
  const [internalVerified, setInternalVerified] = useState(verified);
  const [loadError, setLoadError] = useState('');
  const [officialReady, setOfficialReady] = useState(false);

  // React never manages the children of this div — Google owns it entirely.
  const containerRef = useRef(null);

  // Keep latest callbacks in refs so Google callbacks never capture stale closures.
  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);
  const widgetIdRef = useRef(null);
  useEffect(() => {
    onVerifyRef.current = onVerify;
    onExpireRef.current = onExpire;
  });

  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const hasSiteKey = Boolean(siteKey && siteKey.trim() !== '' && !siteKey.includes('your_site_key'));

  // Sync internal state when prop changes
  useEffect(() => {
    setInternalVerified(verified);
  }, [verified]);

  useEffect(() => {
    if (resetKey === 0) return;

    setInternalVerified(false);
    if (hasSiteKey && window.grecaptcha && typeof window.grecaptcha.reset === 'function') {
      window.grecaptcha.reset(widgetIdRef.current ?? undefined);
    }
  }, [hasSiteKey, resetKey]);

  // Load official Google reCAPTCHA script and render the official v2 checkbox
  useEffect(() => {
    if (!hasSiteKey) return undefined;

    let cancelled = false;
    let pollId = null;
    let initialized = false;

    const containerHasWidget = (el) =>
      Boolean(el && el.querySelector('iframe, [data-widget-id]'));
    const configurationError = () =>
      `Google rejected the reCAPTCHA configuration. Confirm the site key is for v2 Checkbox and add "${window.location.hostname}" to its allowed domains.`;

    const tryRender = () => {
      if (cancelled) return;
      const el = containerRef.current;
      if (!el) return;

      // Already rendered (e.g. by a previous mount or HMR) — just adopt it.
      if (containerHasWidget(el)) {
        initialized = true;
        setOfficialReady(true);
        return;
      }

      if (!window.grecaptcha || typeof window.grecaptcha.render !== 'function') return;

      try {
        widgetIdRef.current = window.grecaptcha.render(el, {
          sitekey: siteKey,
          callback: (tok) => {
            setInternalVerified(true);
            if (onVerifyRef.current) onVerifyRef.current(tok);
          },
          'expired-callback': () => {
            setInternalVerified(false);
            if (onExpireRef.current) onExpireRef.current();
          },
          'error-callback': () => {
            console.warn('reCAPTCHA widget reported a transient error.');
            setInternalVerified(false);
            setLoadError(configurationError());
            if (onExpireRef.current) onExpireRef.current();
          }
        });
        initialized = true;
        setOfficialReady(true);
        if (pollId) clearInterval(pollId);
      } catch (err) {
        console.error(
          'reCAPTCHA render failed:',
          err.message
        );
        setLoadError(configurationError());
        if (pollId) clearInterval(pollId);
      }
    };

    const scriptId = 'google-recaptcha-v2-script';
    let scriptEl = document.getElementById(scriptId);

    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
      scriptEl.async = true;
      scriptEl.defer = true;
      scriptEl.onerror = () => {
        if (!cancelled) setLoadError('Could not load Google reCAPTCHA. Check your network connection and reload the page.');
      };
      document.body.appendChild(scriptEl);
    }

    const onLoad = () => tryRender();
    scriptEl.addEventListener('load', onLoad);
    if (window.grecaptcha) tryRender();

    // Poll until the deferred script initializes (bounded at 8s).
    let attempts = 0;
    pollId = setInterval(() => {
      attempts += 1;
      tryRender();
      if (attempts > 80 || cancelled) {
        clearInterval(pollId);
        if (!cancelled && !initialized) {
          setLoadError(`Google reCAPTCHA could not be initialized. Verify the v2 Checkbox key and registered domain.`);
        }
      }
    }, 100);

    return () => {
      cancelled = true;
      clearInterval(pollId);
      scriptEl.removeEventListener('load', onLoad);
    };
  }, [hasSiteKey, siteKey]);

  // Official Google mode: a real site key is configured — no local token fallback.
  // The container div stays permanently mounted so React never swaps/unmounts the
  // node Google rendered into; status text sits in sibling divs only.
  if (hasSiteKey) {
    return (
      <div className="w-full flex flex-col items-center my-1.5">
        {loadError ? (
          <div className="max-w-[320px] w-full rounded-xl border border-red-300 bg-red-50 px-3.5 py-3 text-center">
            <p className="text-[11px] text-red-600 font-semibold">
              {loadError}
            </p>
          </div>
        ) : (
          <>
            {!officialReady && (
              <div className="min-h-[78px] flex items-center justify-center text-[11px] text-gray-400 font-medium">
                Loading security verification…
              </div>
            )}
            <div
              ref={containerRef}
              className={`transition-opacity duration-200 ${
                disabled ? 'opacity-60 pointer-events-none' : 'opacity-100'
              }`}
            />
          </>
        )}
        {hasError && !internalVerified && (
          <p className="text-[11px] text-red-600 font-semibold mt-1.5 flex items-center gap-1">
            <span>* Complete security verification before authenticating</span>
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center my-1.5">
      <div className="max-w-[320px] w-full rounded-xl border border-red-300 bg-red-50 px-3.5 py-3 text-center">
        <p className="text-[11px] text-red-600 font-semibold">
          Google reCAPTCHA v2 is not configured. Set `VITE_RECAPTCHA_SITE_KEY` to your v2 Checkbox site key.
        </p>
      </div>
    </div>
  );
}
