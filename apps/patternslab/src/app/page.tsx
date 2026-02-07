import Link from "next/link";

const usps = [
  {
    title: "Multi-Tenant Architecture",
    description:
      "Complete data isolation between institutional tenants. Each organization operates within its own secure partition with dedicated encryption keys and access controls.",
  },
  {
    title: "Audit Trail",
    description:
      "Comprehensive logging of every action, query, and data access event. Immutable records with timestamps, actor identification, and full operation context.",
  },
  {
    title: "Compliance Ready",
    description:
      "Built for GDPR, SOC 2, and regulatory frameworks from day one. Data residency controls, retention policies, and exportable compliance reports.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-lab-800 px-8 py-4 flex items-center justify-between">
        <span className="text-lab-100 text-sm font-medium tracking-widest uppercase">
          PatternsLab
        </span>
        <Link
          href="/login"
          className="text-lab-400 text-sm hover:text-lab-200 transition-colors"
        >
          Institutional Login
        </Link>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-8 pt-32 pb-20 text-center">
          <h1 className="text-6xl font-light text-lab-50 tracking-tight">
            PatternsLab
          </h1>
          <p className="mt-6 text-xl text-lab-400 font-light leading-relaxed max-w-2xl mx-auto">
            Institutional Behavioral Pattern Analysis
          </p>
          <p className="mt-4 text-lab-500 text-sm max-w-xl mx-auto leading-relaxed">
            A modular platform for organizations that require structured
            behavioral analysis, pattern recognition, and compliance-grade audit
            infrastructure.
          </p>
        </section>

        {/* USP Grid */}
        <section className="max-w-5xl mx-auto px-8 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {usps.map((usp) => (
              <div
                key={usp.title}
                className="bg-lab-900 border border-lab-800 rounded-lg p-8"
              >
                <h3 className="text-lab-100 text-sm font-medium tracking-wide uppercase mb-4">
                  {usp.title}
                </h3>
                <p className="text-lab-400 text-sm leading-relaxed">
                  {usp.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-8 pb-32 text-center">
          <a
            href="mailto:access@patternslab.app"
            className="inline-block bg-lab-800 text-lab-100 px-8 py-3 text-sm font-medium tracking-wide uppercase rounded hover:bg-lab-700 transition-colors"
          >
            Request Access
          </a>
          <p className="mt-4 text-lab-600 text-xs">
            Available to qualified institutional partners only.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-lab-800 px-8 py-8 text-center">
        <p className="text-lab-500 text-xs">
          PatternsLab is a division of SILENCE.OBJECTS
        </p>
        <p className="text-lab-600 text-xs mt-2">
          &copy; {new Date().getFullYear()} SILENCE.OBJECTS. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
