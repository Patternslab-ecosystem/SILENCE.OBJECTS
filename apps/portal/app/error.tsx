"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 max-w-md text-center">
        <h2 className="text-xl font-bold text-zinc-100 mb-2">Something went wrong</h2>
        <p className="text-zinc-400 text-sm mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-lg bg-zinc-100 text-zinc-950 font-medium text-sm hover:bg-zinc-200 transition-colors"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
