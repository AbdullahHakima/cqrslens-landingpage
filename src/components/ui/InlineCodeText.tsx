import React from 'react';

interface InlineCodeTextProps {
  text: string;
}

const SHORT_FLAG_RE = /^--?[a-z0-9-]+$/i;

function renderBreakableToken(token: string): React.ReactNode {
  if (!token.includes('/')) {
    return token;
  }
  const parts = token.split('/');
  return parts.map((segment, i) => (
    <React.Fragment key={i}>
      {i > 0 && (
        <>
          /<wbr />
        </>
      )}
      {segment}
    </React.Fragment>
  ));
}

/**
 * Renders backtick-delimited tokens (`--flag`, `.csproj`) inside plain data strings
 * as semantic `<code>` elements without requiring a heavy Markdown parser.
 */
export const InlineCodeText: React.FC<InlineCodeTextProps> = ({ text }) => {
  if (!text.includes('`')) {
    return <>{text}</>;
  }

  const segments = text.split(/(`[^`]+`)/g);
  return (
    <>
      {segments.map((part, idx) => {
        if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
          const inner = part.slice(1, -1);
          const isShortFlag = SHORT_FLAG_RE.test(inner) && inner.length <= 24;
          return (
            <code
              key={idx}
              className={`rounded-[3px] bg-[var(--color-bg-sunken)] px-1.5 py-0.5 font-editorial-mono text-[0.86em] text-[var(--color-text-primary)] ${
                isShortFlag ? 'whitespace-nowrap' : 'break-words'
              }`}
            >
              {isShortFlag ? inner : renderBreakableToken(inner)}
            </code>
          );
        }
        return <React.Fragment key={idx}>{part}</React.Fragment>;
      })}
    </>
  );
};

export const BreakablePath: React.FC<{ path: string; className?: string }> = ({
  path,
  className = '',
}) => (
  <span className={`break-words ${className}`.trim()}>
    {renderBreakableToken(path)}
  </span>
);
