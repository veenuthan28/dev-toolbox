import { useState, useCallback, useRef, useEffect } from 'react';
import CopyButton from '../CopyButton';
import './JsonFormatter.css';

/**
 * JSON Formatter & Validator tool.
 * Parses, validates, pretty-prints and syntax-highlights JSON.
 */
export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [formatted, setFormatted] = useState('');
  const [status, setStatus] = useState<{ type: 'valid' | 'invalid'; message: string } | null>(null);
  const codeRef = useRef<HTMLElement>(null);

  // Re-highlight whenever formatted output changes
  useEffect(() => {
    if (formatted && codeRef.current) {
      // Dynamic import to avoid SSR issues
      import('highlight.js/lib/core').then(async (hljs) => {
        const json = (await import('highlight.js/lib/languages/json')).default;
        hljs.default.registerLanguage('json', json);
        if (codeRef.current) {
          codeRef.current.textContent = formatted;
          hljs.default.highlightElement(codeRef.current);
        }
      });
    }
  }, [formatted]);

  const handleFormat = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) {
      setFormatted('');
      setStatus(null);
      return;
    }
    try {
      const parsed = JSON.parse(trimmed);
      const pretty = JSON.stringify(parsed, null, 2);
      setFormatted(pretty);
      setStatus({ type: 'valid', message: '✅ Valid JSON' });
    } catch (err: unknown) {
      setFormatted('');
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setStatus({ type: 'invalid', message: `❌ ${msg}` });
    }
  }, [input]);

  return (
    <div className="panel-card">
      <div className="panel-header">
        <h2>JSON Formatter &amp; Validator</h2>
        <p>Paste raw JSON to format it with syntax highlighting and validate its structure.</p>
      </div>

      {/* Input */}
      <div className="field-group">
        <label htmlFor="json-input">Input JSON</label>
        <textarea
          id="json-input"
          className="json-input"
          placeholder='{"key": "value", "list": [1, 2, 3]}'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="action-bar">
        <button className="btn-primary" onClick={handleFormat}>
          ✨ Format &amp; Validate
        </button>
        {formatted && <CopyButton text={formatted} label="Copy Formatted" />}
      </div>

      {/* Status badge */}
      {status && (
        <div className="json-status-wrap">
          <span className={`json-status ${status.type}`}>{status.message}</span>
        </div>
      )}

      {/* Formatted output */}
      {formatted && (
        <div className="json-output-wrap">
          <pre>
            <code ref={codeRef} className="language-json">
              {formatted}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
}
