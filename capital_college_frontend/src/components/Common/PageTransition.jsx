import React, { useEffect, useRef } from 'react';

/**
 * PageTransition
 * A clean, minimal page entrance animation.
 * Plays a smooth fade-up reveal every time `pageKey` changes.
 * No colors, no icons — just a quiet, professional entrance.
 */
export default function PageTransition({ pageKey, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Remove the class, force reflow, then re-add to re-trigger the animation
    el.classList.remove('page-enter-active');
    // eslint-disable-next-line no-unused-expressions
    el.offsetHeight; // force reflow
    el.classList.add('page-enter-active');
  }, [pageKey]);

  return (
    <div ref={ref} className="page-enter">
      {children}
    </div>
  );
}
