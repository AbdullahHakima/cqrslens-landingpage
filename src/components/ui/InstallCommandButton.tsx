import React, { useState, useRef, useEffect } from 'react';
import { BRAND } from '../../config/brand';
import { CopyIcon, CheckIcon } from './Icons';

interface InstallCommandButtonProps {
  command?: string;
  inverse?: boolean;
  onHoverChange?: (hovering: boolean) => void;
}

export const InstallCommandButton: React.FC<InstallCommandButtonProps> = ({
  command = BRAND.installCommand,
  inverse = false,
  onHoverChange,
}) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number>(0);

  useEffect(() => {
    return () => window.clearTimeout(timerRef.current);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = command;
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

  return (
    <button
      type="button"
      onClick={handleCopy}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      onFocus={() => onHoverChange?.(true)}
      onBlur={() => onHoverChange?.(false)}
      aria-label={`Copy install command: ${command}`}
      className={`group inline-flex min-h-[44px] max-w-full cursor-pointer items-center gap-2.5 rounded-[4px] border px-3 py-2 text-left font-editorial-mono text-xs leading-snug transition-[border-color,background-color,transform] duration-150 ease-[var(--ease-out)] active:scale-[0.985] sm:gap-3 sm:px-3.5 sm:text-[0.8125rem] ${
        inverse
          ? 'border-[var(--color-border-inverse-strong)] bg-[var(--color-bg-inverse-elevated)] text-[var(--color-text-on-inverse)] hover:border-[var(--color-text-on-inverse-muted)]'
          : 'border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] hover:border-[var(--color-text-secondary)]'
      }`}
    >
      <span
        aria-hidden="true"
        className={
          inverse
            ? 'select-none text-[var(--color-text-on-inverse-muted)]'
            : 'select-none text-[var(--color-text-muted)]'
        }
      >
        $
      </span>
      <code className="min-w-0 break-words font-editorial-mono">
        dotnet tool install <span className="whitespace-nowrap">-g {BRAND.nugetPackage}</span>
      </code>
      <span
        aria-live="polite"
        className={`ml-1 inline-flex shrink-0 items-center gap-1.5 text-xs ${
          inverse
            ? 'text-[var(--color-text-on-inverse-muted)] group-hover:text-[var(--color-text-on-inverse)]'
            : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)]'
        }`}
      >
        {copied ? (
          <>
            <CheckIcon className="size-3.5" />
            <span>Copied</span>
          </>
        ) : (
          <>
            <CopyIcon className="size-3.5" />
            <span className="sr-only">Copy command</span>
          </>
        )}
      </span>
    </button>
  );
};
