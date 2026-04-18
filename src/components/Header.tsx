import './Header.css';
import ThemeToggle from './ThemeToggle';

/**
 * App header with logo and theme toggle.
 */
export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <div className="logo-icon">⚡</div>
        <div className="logo-text">
          Dev<span>Toolbox</span>
        </div>
      </div>
      <ThemeToggle />
    </header>
  );
}
