import React from 'react';

interface InlineCodeTextProps {
  text: string;
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
          return (
            <code
              key={idx}
              className="break-words [overflow-wrap:anywhere] rounded-[3px] bg-[var(--color-bg-sunken)] px-1.5 py-0.5 font-editorial-mono text-[0.86em] text-[var(--color-text-primary)]"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <React.Fragment key={idx}>{part}</React.Fragment>;
      })}
    </>
  );
};
