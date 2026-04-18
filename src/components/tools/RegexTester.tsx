import { useState, useMemo } from 'react';
import { escapeHtml } from '../../utils/escape';
import './RegexTester.css';

interface MatchDetail {
  index: number;
  fullMatch: string;
  groups: string[];
}

const CHEATSHEET = [
  { token: '.', desc: 'Any character' },
  { token: '\\d', desc: 'Digit [0-9]' },
  { token: '\\w', desc: 'Word char' },
  { token: '\\s', desc: 'Whitespace' },
  { token: '\\b', desc: 'Word boundary' },
  { token: '^', desc: 'Start of string' },
  { token: '$', desc: 'End of string' },
  { token: '*', desc: '0 or more' },
  { token: '+', desc: '1 or more' },
  { token: '?', desc: '0 or 1' },
  { token: '{n,m}', desc: 'n to m times' },
  { token: '[abc]', desc: 'Character set' },
  { token: '[^abc]', desc: 'Negated set' },
  { token: '(abc)', desc: 'Capture group' },
  { token: 'a|b', desc: 'Alternation' },
  { token: '(?=…)', desc: 'Lookahead' },
  { token: '(?!…)', desc: 'Neg. lookahead' },
];

const FLAG_OPTIONS = [
  { flag: 'g', label: 'Global', desc: 'Find all matches' },
  { flag: 'i', label: 'Case-insensitive', desc: 'Ignore case' },
  { flag: 'm', label: 'Multiline', desc: '^ and $ match lines' },
  { flag: 's', label: 'Dotall', desc: '. matches newlines' },
] as const;

/**
 * Regex Tester — real-time match highlighting, capture groups, replace preview.
 */
export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState(
    'The quick brown fox jumps over 13 lazy dogs at 4pm.\nContact: alice@example.com or bob@test.org',
  );
  const [replaceValue, setReplaceValue] = useState('');
  const [activeView, setActiveView] = useState<'highlight' | 'replace'>(
    'highlight',
  );

  const { html, matches, error } = useMemo(() => {
    if (!pattern) {
      return { html: '', matches: [] as MatchDetail[], error: null };
    }

    try {
      const regex = new RegExp(pattern, flags);
      const allMatches: MatchDetail[] = [];

      if (flags.includes('g')) {
        let result = '';
        let lastIndex = 0;
        let match: RegExpExecArray | null;
        regex.lastIndex = 0;

        while ((match = regex.exec(testString)) !== null) {
          if (match.index === regex.lastIndex) regex.lastIndex++;
          allMatches.push({
            index: match.index,
            fullMatch: match[0],
            groups: match.slice(1),
          });
          result += escapeHtml(testString.slice(lastIndex, match.index));
          result += `<mark data-match="${allMatches.length}">${escapeHtml(match[0])}</mark>`;
          lastIndex = match.index + match[0].length;
          if (allMatches.length > 500) break; // safety limit
        }
        result += escapeHtml(testString.slice(lastIndex));
        return {
          html: result || escapeHtml(testString),
          matches: allMatches,
          error: null,
        };
      } else {
        const match = regex.exec(testString);
        if (match) {
          allMatches.push({
            index: match.index,
            fullMatch: match[0],
            groups: match.slice(1),
          });
          let result = escapeHtml(testString.slice(0, match.index));
          result += `<mark data-match="1">${escapeHtml(match[0])}</mark>`;
          result += escapeHtml(testString.slice(match.index + match[0].length));
          return { html: result, matches: allMatches, error: null };
        }
        return {
          html: escapeHtml(testString),
          matches: [] as MatchDetail[],
          error: null,
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid regex';
      return { html: '', matches: [] as MatchDetail[], error: msg };
    }
  }, [pattern, flags, testString]);

  const replaceResult = useMemo(() => {
    if (!pattern || !replaceValue) return null;
    try {
      const regex = new RegExp(pattern, flags);
      return testString.replace(regex, replaceValue);
    } catch {
      return null;
    }
  }, [pattern, flags, testString, replaceValue]);

  const hasGroups = matches.some((m) => m.groups.length > 0);

  return (
    <div className="panel-card">
      <div className="panel-header">
        <h2>Regex Tester</h2>
        <p>
          Test regular expressions with live highlighting, capture groups &amp;
          replace preview.
        </p>
      </div>

      <div className="regex-layout">
        {/* Main area */}
        <div className="regex-main">
          {/* Pattern input with live preview */}
          <div className="field-group">
            <label htmlFor="regex-pattern">Pattern</label>
            <div className="pattern-row">
              <span className="pattern-delim">/</span>
              <input
                type="text"
                id="regex-pattern"
                className="pattern-input"
                placeholder="e.g. [A-Za-z]+ or \d{2,4}"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                spellCheck={false}
                autoComplete="off"
              />
              <span className="pattern-delim">/</span>
              <span className="pattern-flags">{flags || '—'}</span>
            </div>
          </div>

          {/* Flags */}
          <div className="field-group">
            <label>Flags</label>
            <div className="flags-row">
              {FLAG_OPTIONS.map(({ flag, label, desc }) => (
                <label
                  key={flag}
                  className={`flag-chip ${flags.includes(flag) ? 'active' : ''}`}
                  title={desc}
                >
                  <input
                    type="checkbox"
                    checked={flags.includes(flag)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFlags((prev) => prev + flag);
                      } else {
                        setFlags((prev) => prev.replace(flag, ''));
                      }
                    }}
                  />
                  <code>{flag}</code>
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Test String */}
          <div className="field-group">
            <label htmlFor="regex-test">Test String</label>
            <textarea
              id="regex-test"
              placeholder="Enter text to test your regex against…"
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              rows={5}
              spellCheck={false}
            />
          </div>

          {/* View toggle + Match count */}
          <div className="result-bar">
            <div className="view-toggle">
              <button
                className={`view-btn ${activeView === 'highlight' ? 'active' : ''}`}
                onClick={() => setActiveView('highlight')}
              >
                Highlight
              </button>
              <button
                className={`view-btn ${activeView === 'replace' ? 'active' : ''}`}
                onClick={() => setActiveView('replace')}
              >
                Replace
              </button>
            </div>
            <div className="match-info">
              {error ? (
                <span className="match-error-badge">Invalid</span>
              ) : (
                <span>
                  <span className="match-count">{matches.length}</span>{' '}
                  {matches.length === 1 ? 'match' : 'matches'}
                </span>
              )}
            </div>
          </div>

          {/* Results */}
          {activeView === 'highlight' && (
            <div className="field-group">
              <label>Results</label>
              {error ? (
                <div className="regex-error">{error}</div>
              ) : !pattern ? (
                <div className="regex-results regex-placeholder">
                  Enter a pattern above to see results.
                </div>
              ) : (
                <div
                  className="regex-results"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              )}
            </div>
          )}

          {/* Replace view */}
          {activeView === 'replace' && (
            <div className="field-group">
              <label htmlFor="regex-replace">Replace With</label>
              <input
                type="text"
                id="regex-replace"
                placeholder="e.g. $1 or replacement text"
                value={replaceValue}
                onChange={(e) => setReplaceValue(e.target.value)}
                spellCheck={false}
              />
              <label style={{ marginTop: 'var(--space-md)' }}>Result</label>
              {error ? (
                <div className="regex-error">{error}</div>
              ) : replaceResult !== null ? (
                <div className="regex-results replace-result">
                  {replaceResult}
                </div>
              ) : (
                <div className="regex-results regex-placeholder">
                  Enter a pattern and replacement to preview.
                </div>
              )}
            </div>
          )}

          {/* Match Details */}
          {matches.length > 0 && (
            <div className="field-group">
              <label>Match Details</label>
              <div className="match-table-wrap">
                <table className="match-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Match</th>
                      <th>Index</th>
                      {hasGroups && <th>Groups</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {matches.slice(0, 50).map((m, i) => (
                      <tr key={i}>
                        <td className="match-num">{i + 1}</td>
                        <td>
                          <code className="match-value">
                            {m.fullMatch || '(empty)'}
                          </code>
                        </td>
                        <td className="match-idx">{m.index}</td>
                        {hasGroups && (
                          <td className="match-groups">
                            {m.groups.length > 0
                              ? m.groups.map((g, gi) => (
                                  <span key={gi} className="group-tag">
                                    ${gi + 1}: <code>{g ?? 'undefined'}</code>
                                  </span>
                                ))
                              : '—'}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {matches.length > 50 && (
                  <div className="match-overflow">
                    …and {matches.length - 50} more matches
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Cheatsheet sidebar */}
        <aside className="cheatsheet">
          <h3>Quick Reference</h3>
          {CHEATSHEET.map((item) => (
            <div
              className="cheatsheet-item"
              key={item.token}
              role="button"
              tabIndex={0}
              title={`Insert ${item.token}`}
              onClick={() => {
                setPattern((prev) => prev + item.token);
                document.getElementById('regex-pattern')?.focus();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setPattern((prev) => prev + item.token);
                  document.getElementById('regex-pattern')?.focus();
                }
              }}
            >
              <code>{item.token}</code>
              <span>{item.desc}</span>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
