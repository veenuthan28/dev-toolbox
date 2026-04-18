import { useState, type ReactNode } from 'react';
import Header from './Header';
import BoxShadowGenerator from './tools/BoxShadowGenerator';
import JsonFormatter from './tools/JsonFormatter';
import RegexTester from './tools/RegexTester';
import ColorConverter from './tools/ColorConverter';
import './App.css';

/** Tool tab definition. */
interface Tab {
  id: string;
  icon: string;
  label: string;
  component: ReactNode;
}

const TABS: Tab[] = [
  {
    id: 'shadow',
    icon: '🎨',
    label: 'Box Shadow',
    component: <BoxShadowGenerator />,
  },
  {
    id: 'json',
    icon: '{ }',
    label: 'JSON Formatter',
    component: <JsonFormatter />,
  },
  {
    id: 'regex',
    icon: '.*',
    label: 'Regex Tester',
    component: <RegexTester />,
  },
  {
    id: 'color',
    icon: '🎯',
    label: 'Color Converter',
    component: <ColorConverter />,
  },
];

/**
 * Root application component.
 * Manages tab state and renders the currently active tool.
 */
export default function App() {
  const [activeTab, setActiveTab] = useState('shadow');

  return (
    <div className="app">
      <Header />

      {/* Tab Navigation */}
      <nav className="tab-nav" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Active Tool Panel */}
      {TABS.map((tab) => (
        <section
          key={tab.id}
          className={`tool-panel ${activeTab === tab.id ? 'active' : ''}`}
          role="tabpanel"
          aria-hidden={activeTab !== tab.id}
        >
          {activeTab === tab.id && tab.component}
        </section>
      ))}

      {/* Footer */}
      <footer className="footer">
        <p>
          Built with ⚡ — All tools run 100% client-side. No data leaves your
          browser.
        </p>
        <p className="footer-credit">
          © {new Date().getFullYear()}{' '}
          <a href="https://veenu.ch" target="_blank" rel="noopener noreferrer">
            veenu.ch
          </a>
        </p>
      </footer>
    </div>
  );
}
