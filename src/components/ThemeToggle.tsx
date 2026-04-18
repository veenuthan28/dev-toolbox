import { useEffect, useState, useCallback } from 'react';
import './ThemeToggle.css';

/**
 * A toggle button that switches between dark and light mode.
 * Applies `data-theme` to the <html> element.
 */
export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  // Initialise from the DOM on mount
  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    setIsDark(current !== 'light');
  }, []);

  const toggle = useCallback(() => {
    const next = isDark ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    setIsDark(!isDark);
  }, [isDark]);

  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      title="Toggle light/dark mode"
      aria-label="Toggle theme"
    >
      {isDark ? '🌙' : '☀️'}
    </button>
  );
}
