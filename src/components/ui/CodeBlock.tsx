import React, { useEffect, useRef, useState } from 'react';
import { CheckIcon, CopyIcon } from './Icons';

interface CodeBlockProps {
  label?: string;
  code: string;
  copyText?: string;
  tone?: 'inverse' | 'elevated';
  badge?: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  label,
  code,
  copyText,
  tone = 'inverse',
  badge,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number>(0);

  useEffect(() => {
    return () => window.clearTimeout(timerRef.current);
  }, []);

  const handleCopy = async () => {
    const payload = copyText ?? code;
    try {
      await navigator.clipboard.writeText(payload);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = payload;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 1800);
  };

  const isInverse = tone === 'inverse';

  return (
    <div
      className={`w-full min-w-0 overflow-hidden border ${
        isInverse
          ? 'surface-inverse border-[var(--color-border-strong)] bg-[var(--color-bg-inverse)] text-[var(--color-text-on-inverse)]'
          : 'border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]'
      } ${className}`}
    >
      <div
        className={`flex items-center justify-between gap-2 border-b px-3 py-1 sm:gap-3 sm:px-4 sm:py-1.5 ${
          isInverse
            ? 'border-[var(--color-border-inverse)] bg-[var(--color-bg-inverse-elevated)]'
            : 'border-[var(--color-border-subtle)] bg-[var(--color-bg-subtle)]'
        }`}
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1 py-1">
          {label && (
            <span
              className={`min-w-0 break-words font-editorial-mono text-[0.71875rem] leading-snug sm:truncate sm:text-xs ${
                isInverse
                  ? 'text-[var(--color-text-on-inverse-muted)]'
                  : 'text-[var(--color-text-secondary)]'
              }`}
            >
              {label}
            </span>
          )}
          {badge && (
            <span
              className={`shrink-0 rounded-[3px] px-1.5 py-0.5 font-editorial-mono text-[0.6875rem] whitespace-nowrap ${
                isInverse
                  ? 'bg-[var(--color-bg-inverse)] text-[var(--color-text-on-inverse)]'
                  : 'bg-[var(--color-bg-sunken)] text-[var(--color-text-primary)]'
              }`}
            >
              {badge}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label={label ? `Copy ${label} snippet` : 'Copy code snippet'}
          className={`inline-flex min-h-[44px] min-w-[44px] shrink-0 cursor-pointer items-center justify-center gap-1.5 px-2 font-editorial-mono text-xs whitespace-nowrap transition-colors duration-150 sm:px-2.5 ${
            isInverse
              ? 'text-[var(--color-text-on-inverse-muted)] hover:text-[var(--color-text-on-inverse)]'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
          <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <pre className="m-0 overflow-x-auto p-3.5 font-editorial-mono text-[0.71875rem] leading-[1.68] sm:p-5 sm:text-xs sm:leading-[1.7]">
        <code>{code}</code>
      </pre>
    </div>
  );
};
