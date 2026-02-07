'use client';

import { useState } from 'react';

interface AccordionSectionProps {
  title: string;
  content: string;
  subtext?: string;
  defaultOpen?: boolean;
}

export function AccordionSection({
  title,
  content,
  subtext,
  defaultOpen = false,
}: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-[var(--border)]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 py-3 px-1 text-left hover:bg-[var(--bg-hover)] transition-colors"
      >
        {/* Inline SVG chevron — replaces lucide-react ChevronRight */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-[var(--text-muted)] transition-transform ${
            isOpen ? 'rotate-90' : ''
          }`}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span className="text-sm font-semibold text-[var(--primary)] uppercase tracking-wide">
          {title}
        </span>
      </button>
      {isOpen && (
        <div className="pb-4 px-1 pl-7">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{content}</p>
          {subtext && (
            <p className="mt-2 text-xs text-[var(--text-muted)] italic">{subtext}</p>
          )}
        </div>
      )}
    </div>
  );
}
