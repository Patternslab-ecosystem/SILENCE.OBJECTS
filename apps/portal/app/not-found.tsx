import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 max-w-md text-center">
        <h2 className="text-xl font-bold text-zinc-100 mb-2">404 — Not Found</h2>
        <p className="text-zinc-400 text-sm mb-6">This page does not exist.</p>
        <Link
          href="/"
          className="px-4 py-2 rounded-lg bg-zinc-100 text-zinc-950 font-medium text-sm hover:bg-zinc-200 transition-colors"
        >
          Back to Portal
        </Link>
      </div>
    </main>
  );
}
