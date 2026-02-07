"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Badge */}
        <div className="text-center mb-8">
          <span className="inline-block bg-lab-800 text-lab-400 text-xs font-medium tracking-widest uppercase px-4 py-1.5 rounded-full">
            Institutional Access Only
          </span>
        </div>

        {/* Card */}
        <div className="bg-lab-900 border border-lab-800 rounded-lg p-8">
          <h1 className="text-lab-100 text-lg font-medium text-center mb-8">
            Institutional Access
          </h1>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-lab-400 text-xs font-medium tracking-wide uppercase mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="analyst@institution.com"
                className="w-full bg-lab-950 border border-lab-800 rounded px-4 py-2.5 text-lab-100 text-sm placeholder-lab-600 focus:outline-none focus:border-lab-600 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-lab-400 text-xs font-medium tracking-wide uppercase mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter credentials"
                className="w-full bg-lab-950 border border-lab-800 rounded px-4 py-2.5 text-lab-100 text-sm placeholder-lab-600 focus:outline-none focus:border-lab-600 transition-colors"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-lab-800 text-lab-100 py-2.5 text-sm font-medium tracking-wide uppercase rounded hover:bg-lab-700 transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-lab-500 text-xs hover:text-lab-300 transition-colors"
          >
            &larr; Back to PatternsLab
          </Link>
        </div>
      </div>
    </div>
  );
}
