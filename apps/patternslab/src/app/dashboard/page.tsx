import Link from "next/link";

type ModuleStatus = "active" | "development";

interface ModuleEntry {
  name: string;
  package: string;
  status: ModuleStatus;
}

const modules: ModuleEntry[] = [
  { name: "Contracts", package: "@silence/contracts", status: "active" },
  { name: "Events", package: "@silence/events", status: "active" },
  { name: "Language", package: "@silence/language", status: "active" },
  { name: "Safety", package: "@silence/safety", status: "active" },
  { name: "UI", package: "@silence/ui", status: "active" },
  { name: "Voice", package: "@silence/voice", status: "active" },
  { name: "Archetypes", package: "@silence/archetypes", status: "development" },
  { name: "Core", package: "@silence/core", status: "development" },
  { name: "Validator", package: "@silence/validator", status: "development" },
];

const navItems = ["Overview", "Modules", "Users", "Audit Log", "Settings"];

function StatusDot({ status }: { status: ModuleStatus }) {
  const color =
    status === "active" ? "bg-lab-300" : "bg-lab-500";
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${color}`}
      title={status === "active" ? "Active" : "In Development"}
    />
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-lab-800 bg-lab-950 flex flex-col">
        {/* Sidebar Header */}
        <div className="px-6 py-5 border-b border-lab-800">
          <Link href="/" className="text-lab-100 text-sm font-medium tracking-widest uppercase">
            PatternsLab
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-1">
            {navItems.map((item, index) => (
              <li key={item}>
                <span
                  className={`block px-3 py-2 rounded text-sm cursor-default ${
                    index === 0
                      ? "bg-lab-900 text-lab-100"
                      : "text-lab-500 hover:text-lab-300 hover:bg-lab-900"
                  } transition-colors`}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="px-6 py-4 border-t border-lab-800">
          <p className="text-lab-600 text-xs">v5.0.0</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header Bar */}
        <header className="border-b border-lab-800 px-8 py-4 flex items-center justify-between">
          <h1 className="text-lab-100 text-sm font-medium">
            PatternsLab Dashboard
          </h1>
          <span className="bg-lab-800 text-lab-400 text-xs font-medium tracking-widest uppercase px-3 py-1 rounded-full">
            Institutional
          </span>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8">
          {/* Empty State */}
          <div className="bg-lab-900 border border-lab-800 rounded-lg p-12 text-center mb-8">
            <p className="text-lab-500 text-sm">
              Select a module to begin analysis.
            </p>
          </div>

          {/* Module List */}
          <div>
            <h2 className="text-lab-400 text-xs font-medium tracking-widest uppercase mb-4">
              Available Modules
            </h2>
            <div className="bg-lab-900 border border-lab-800 rounded-lg divide-y divide-lab-800">
              {modules.map((mod) => (
                <div
                  key={mod.package}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div className="flex items-center gap-3">
                    <StatusDot status={mod.status} />
                    <div>
                      <p className="text-lab-100 text-sm font-medium">
                        {mod.name}
                      </p>
                      <p className="text-lab-500 text-xs font-mono">
                        {mod.package}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium tracking-wide uppercase ${
                      mod.status === "active"
                        ? "text-lab-300"
                        : "text-lab-500"
                    }`}
                  >
                    {mod.status === "active" ? "Active" : "In Development"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-lab-300" />
              <span className="text-lab-500 text-xs">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-lab-500" />
              <span className="text-lab-500 text-xs">In Development</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
