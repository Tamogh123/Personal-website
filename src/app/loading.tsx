export default function Loading() {
  return (
    <main
      className="min-h-screen w-full flex items-center justify-center px-6"
      style={{ background: "#f5f7fb" }}
      aria-label="Loading portfolio systems"
    >
      <section
        className="w-full max-w-4xl"
        style={{
          background: "#ffffff",
          border: "1px solid rgba(15, 32, 58, 0.14)",
          boxShadow: "0 16px 42px rgba(20, 34, 52, 0.14)",
          padding: "1.5rem",
        }}
      >
        <header
          className="flex items-center justify-between gap-4"
          style={{ borderBottom: "1px solid rgba(15, 32, 58, 0.12)", paddingBottom: "0.75rem" }}
        >
          <div>
            <p className="text-xs uppercase tracking-[0.14em]" style={{ color: "#0f55de", fontWeight: 700 }}>
              VU3TKI CORE LINK
            </p>
            <h1 className="text-xl md:text-2xl" style={{ color: "#17263a", fontWeight: 800 }}>
              Career Engine Bootstrap
            </h1>
            <p className="text-sm" style={{ color: "#51627a" }}>
              Initializing portfolio modules in Gundam systems format
            </p>
          </div>
          <div className="flex items-center gap-2" style={{ color: "#0f55de", fontWeight: 700 }}>
            <span className="inline-block h-2 w-2 rounded-sm animate-pulse" style={{ background: "#0f55de" }} />
            SYNCING
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {[
            ["[ML-CORE]", "Model design, evaluation, and production reliability checks"],
            ["[RUST-OPS]", "Low-latency systems modules armed and telemetry stable"],
            ["[DATA-BUS]", "Pipelines, validation gates, and observability online"],
            ["[OPEN-SOURCE]", "Reusable tooling and docs published for collaboration"],
          ].map(([tag, text]) => (
            <article
              key={tag}
              style={{
                border: "1px solid rgba(21, 47, 88, 0.16)",
                background: "linear-gradient(180deg, #ffffff, #f4f8ff)",
                padding: "0.85rem",
              }}
            >
              <p className="text-xs uppercase tracking-[0.12em]" style={{ color: "#1152cc", fontWeight: 700 }}>
                {tag}
              </p>
              <p className="text-sm mt-1" style={{ color: "#24364f" }}>
                {text}
              </p>
              <div className="mt-3 h-1.5 w-full" style={{ background: "#dce6f8" }}>
                <div className="h-full animate-pulse" style={{ width: "78%", background: "#1b63ea" }} />
              </div>
            </article>
          ))}
        </div>

        <footer className="mt-4 text-sm" style={{ color: "#3f5067" }}>
          <p>Console: Portfolio reactor calibrated. Deploying interface modules…</p>
        </footer>
      </section>
    </main>
  );
}
