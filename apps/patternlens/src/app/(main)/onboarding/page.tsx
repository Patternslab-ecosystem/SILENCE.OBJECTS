"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ConsentItem {
  id: string;
  label: string;
  description: string;
  required: boolean;
  link?: { text: string; href: string };
}

const CONSENTS: ConsentItem[] = [
  {
    id: "privacy_policy",
    label: "Polityka Prywatności",
    description: "Zapoznałem/am się z polityką prywatności i wyrażam zgodę na przetwarzanie moich danych osobowych.",
    required: true,
    link: { text: "Przeczytaj", href: "/privacy" },
  },
  {
    id: "terms_of_service",
    label: "Regulamin",
    description: "Akceptuję regulamin korzystania z serwisu SILENCE.OBJECTS.",
    required: true,
    link: { text: "Przeczytaj", href: "/terms" },
  },
  {
    id: "ai_disclaimer",
    label: "Informacja o AI",
    description: "Rozumiem, że SILENCE.OBJECTS używa AI do analizy i że wyniki nie stanowią porady profesjonalnej.",
    required: true,
  },
  {
    id: "marketing",
    label: "Komunikacja marketingowa",
    description: "Zgadzam się na otrzymywanie informacji o nowościach i aktualizacjach (opcjonalne).",
    required: false,
  },
];

export default function OnboardingPage() {
  const [consents, setConsents] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Check if user already completed onboarding
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", user.id)
        .single();

      if (profile?.onboarding_completed) {
        router.push("/dashboard");
        return;
      }

      setCheckingAuth(false);
    };

    checkUser();
  }, [router, supabase]);

  const handleToggleConsent = (id: string) => {
    setConsents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allRequiredAccepted = CONSENTS
    .filter((c) => c.required)
    .every((c) => consents[c.id]);

  const handleComplete = async () => {
    if (!allRequiredAccepted) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consents: Object.entries(consents)
            .filter(([, accepted]) => accepted)
            .map(([type]) => ({
              type,
              version: "1.0",
            })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Nie udało się zapisać zgód");
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił błąd");
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
        <div className="text-[#8b949e]">Ładowanie...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1419] flex items-center justify-center p-4">
      <div className="w-full max-w-[480px]">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[rgba(74,222,128,0.12)] border border-[rgba(74,222,128,0.2)] mb-5">
            <svg className="w-8 h-8 text-[#4ade80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-[28px] font-semibold tracking-[-0.5px] text-[#f5f7fa] leading-tight">
            Witaj w SILENCE.OBJECTS
          </h1>
          <p className="text-sm text-[#6e7681] mt-2">
            Zanim zaczniesz, potrzebujemy kilku zgód
          </p>
        </div>

        {/* Consent Card */}
        <div className="bg-[#161b22] border border-[#2d3748] rounded-xl p-6">
          <div className="space-y-4">
            {CONSENTS.map((consent) => (
              <label
                key={consent.id}
                className="flex items-start gap-4 p-4 rounded-lg bg-[#0f1419] border border-[#2d3748] cursor-pointer hover:border-[#4a90e2] transition-colors group"
              >
                <div className="relative flex items-center justify-center mt-0.5">
                  <input
                    type="checkbox"
                    checked={consents[consent.id] || false}
                    onChange={() => handleToggleConsent(consent.id)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                      consents[consent.id]
                        ? "bg-[#4a90e2] border-[#4a90e2]"
                        : "border-[#2d3748] group-hover:border-[#4a90e2]"
                    }`}
                  >
                    {consents[consent.id] && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-[#f5f7fa] text-sm">
                      {consent.label}
                    </span>
                    {consent.required ? (
                      <span className="px-1.5 py-0.5 text-[9px] font-semibold uppercase rounded bg-[rgba(248,113,113,0.15)] text-[#f87171] border border-[rgba(248,113,113,0.2)]">
                        Wymagane
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 text-[9px] font-semibold uppercase rounded bg-[rgba(139,148,158,0.15)] text-[#8b949e] border border-[rgba(139,148,158,0.2)]">
                        Opcjonalne
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#6e7681] leading-relaxed">
                    {consent.description}
                  </p>
                  {consent.link && (
                    <Link
                      href={consent.link.href}
                      target="_blank"
                      className="inline-flex items-center gap-1 mt-2 text-xs text-[#4a90e2] hover:text-[#3a7bc8] transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {consent.link.text}
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                  )}
                </div>
              </label>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 px-4 py-3 rounded-lg bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.2)] text-sm text-[#f87171]">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleComplete}
            disabled={!allRequiredAccepted || loading}
            className="w-full mt-6 min-h-[48px] px-6 py-3 bg-[#4ade80] hover:bg-[#22c55e] text-[#0f1419] font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Zapisywanie...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                Rozpocznij
              </>
            )}
          </button>

          {!allRequiredAccepted && (
            <p className="mt-3 text-xs text-[#6e7681] text-center">
              Zaznacz wszystkie wymagane zgody, aby kontynuować
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link
            href="/emergency"
            className="inline-flex items-center gap-1.5 text-xs text-[#6e7681] hover:text-[#f87171] transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Zasoby kryzysowe
          </Link>
        </div>
      </div>
    </div>
  );
}
