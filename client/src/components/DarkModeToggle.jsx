import { useEffect, useState } from 'react';
import { applyTheme, getInitialTheme, THEME_KEY } from '../theme';

export default function DarkModeToggle({ className = '' }) {
  const [theme, setTheme] = useState(getInitialTheme());

  useEffect(() => {
    const handler = (e) => {
      if (localStorage.getItem(THEME_KEY)) return;
      if (e.matches) { setTheme('dark'); applyTheme('dark'); }
      else { setTheme('light'); applyTheme('light'); }
    };
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
  };

  return (
    <button
      onClick={toggle}
      className={`rounded-md px-3 py-1.5 text-sm border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 ${className}`}
      title="Toggle dark mode"
    >
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  );
}