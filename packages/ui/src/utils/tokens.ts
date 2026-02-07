/** Shared design-system tokens used by @silence/ui components. */

export const button = {
  base: "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-[var(--duration-normal)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] disabled:opacity-50 disabled:cursor-not-allowed",
  primary:
    "inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] active:bg-[var(--primary-active)] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
  secondary:
    "inline-flex items-center justify-center gap-2 px-4 py-2 bg-transparent hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--border-hover)] rounded-md transition-colors",
  ghost:
    "inline-flex items-center justify-center gap-2 px-4 py-2 hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-md transition-colors",
  danger:
    "inline-flex items-center justify-center gap-2 px-4 py-2 bg-transparent hover:bg-[var(--danger-muted)] text-[var(--danger)] border border-[rgba(248,113,113,0.3)] rounded-md transition-colors",
} as const;
