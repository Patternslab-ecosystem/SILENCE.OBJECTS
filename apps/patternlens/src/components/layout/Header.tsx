"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn, layout, text, badge } from "@/constants/design-system";

interface HeaderProps { email?: string; tier: string; remainingObjects?: number | null; }

export function Header({ email, tier }: HeaderProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <header className={layout.header}>
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 bg-[var(--primary)] rounded-md flex items-center justify-center">
          <span className="text-white text-sm font-semibold">S</span>
        </div>
        <span className="text-base font-semibold tracking-[-0.3px]">SILENCE</span>
      </div>
      <div className="flex items-center gap-4">
        {tier === "FREE" && <div className={cn(badge.base, badge.primary)}>FREE TIER</div>}
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-[rgba(255,255,255,0.05)] transition-colors">
            <span className={text.secondary}>{email}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cn("text-[var(--text-muted)] transition-transform", menuOpen && "rotate-180")}><path d="M6 9l6 6 6-6"/></svg>
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg shadow-lg overflow-hidden z-50">
              <button onClick={handleSignOut} className="w-full px-4 py-2.5 text-left text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors">Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
