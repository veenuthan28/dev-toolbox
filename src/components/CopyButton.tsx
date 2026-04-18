import { useState, useCallback, useRef, type ReactNode } from 'react';
import { copyToClipboard } from '../utils/clipboard';
import './CopyButton.css';

interface CopyButtonProps {
  /** The text to copy to the clipboard. */
  text: string;
  /** Optional custom label. Defaults to "Copy". */
  label?: string;
  /** Optional children to render instead of the default label. */
  children?: ReactNode;
  /** Additional CSS class names. */
  className?: string;
}

/**
 * A button that copies text to the clipboard and shows
 * a brief "Copied!" confirmation flash.
 */
export default function CopyButton({ text, label = 'Copy', children, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const handleCopy = useCallback(async () => {
    const ok = await copyToClipboard(text);
    if (!ok) return;
    setCopied(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 1500);
  }, [text]);

  return (
    <button
      type="button"
      className={`copy-btn ${copied ? 'copied' : ''} ${className}`}
      onClick={handleCopy}
      aria-label={copied ? 'Copied' : label}
    >
      {copied ? '✅ Copied!' : (children ?? `📋 ${label}`)}
    </button>
  );
}
