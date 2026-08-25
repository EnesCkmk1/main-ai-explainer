"use client";

import type { Analyse, Vigtighed } from "@/lib/schema";

function VigtighedBadge({ niveau }: { niveau: Vigtighed }) {
  const map: Record<Vigtighed, string> = {
    høj: "bg-danger-soft text-danger",
    mellem: "bg-amber-soft text-amber",
    lav: "bg-accent-soft text-accent-ink",
  };
  return <span className={`pill ${map[niveau]}`}>{niveau} vigtighed</span>;
}

function SectionTitle({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <h2 className="mb-4 flex items-center gap-2.5 text-xl font-semibold">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent">
        {icon}
      </span>
      {children}
    </h2>
  );
}

export function ResultView({
  analyse,
  fileName,
  demo = false,
  onReset,
}: {
  analyse: Analyse;
  fileName: string;
  demo?: boolean;
  onReset: () => void;
}) {
  const paragraphs = analyse.forklaring.split(/\n{1,}/).filter((p) => p.trim());

  return (
    <div className="space-y-5">
      {/* Demo-banner */}
      {demo && (
        <div className="flex items-start gap-3 rounded-xl border border-amber/30 bg-amber-soft/50 px-4 py-3">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-0.5 shrink-0 text-amber"
          >
            <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />
            <path d="M12 8h.01M11 12h1v4h1" />
          </svg>
          <p className="text-sm leading-relaxed text-ink/80">
            <span className="font-semibold">Demo-tilstand.</span> Der er ikke sat en
            API-nøgle, så du ser en fast eksempel-analyse - ikke en analyse af din
            egen fil. Tilføj <code className="rounded bg-paper/70 px-1 py-0.5 text-[0.8em]">ANTHROPIC_API_KEY</code>{" "}
            for at analysere rigtige dokumenter.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="pill bg-accent-soft text-accent-ink">{analyse.dokumenttype}</span>
          <p className="mt-2 truncate text-sm text-muted" title={fileName}>
            {fileName}
          </p>
        </div>
        <button
          onClick={onReset}
          className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium transition hover:border-accent/50 hover:text-accent"
        >
          Nyt dokument
        </button>
      </div>

      {/* Resumé */}
      <section className="card overflow-hidden">
        <div className="border-b border-line bg-accent-soft/40 px-6 py-4">
          <SectionTitle
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
              </svg>
            }
          >
            Kort fortalt
          </SectionTitle>
          <p className="text-lg leading-relaxed text-ink/90">{analyse.resume}</p>
        </div>

        {/* Forklaring */}
        <div className="px-6 py-5">
          <SectionTitle
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />
                <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01" />
              </svg>
            }
          >
            Forklaring
          </SectionTitle>
          <div className="prose-da">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Vigtige punkter */}
        <section className="card p-6">
          <SectionTitle
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 11 3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            }
          >
            Vigtige punkter
          </SectionTitle>
          {analyse.vigtige_punkter.length === 0 ? (
            <p className="text-sm text-muted">Ingen særlige punkter fundet.</p>
          ) : (
            <ul className="space-y-3">
              {analyse.vigtige_punkter.map((punkt, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span className="leading-relaxed text-ink/90">{punkt}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Datoer & frister */}
        <section className="card p-6">
          <SectionTitle
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 2v4M16 2v4M3 10h18" />
                <rect width="18" height="18" x="3" y="4" rx="2" />
              </svg>
            }
          >
            Datoer & frister
          </SectionTitle>
          {analyse.datoer.length === 0 ? (
            <p className="text-sm text-muted">Ingen datoer eller frister fundet.</p>
          ) : (
            <ul className="space-y-3">
              {analyse.datoer.map((d, i) => (
                <li key={i} className="rounded-xl border border-line bg-paper/50 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold">{d.dato}</span>
                    <VigtighedBadge niveau={d.vigtighed} />
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{d.beskrivelse}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Advarsler */}
      {analyse.advarsler.length > 0 && (
        <section className="card border-amber/30 bg-amber-soft/40 p-6">
          <SectionTitle
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3Z" />
                <path d="M12 9v4M12 17h.01" />
              </svg>
            }
          >
            Vær opmærksom på
          </SectionTitle>
          <ul className="space-y-3">
            {analyse.advarsler.map((a, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                <span className="leading-relaxed text-ink/90">{a}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="px-1 text-xs leading-relaxed text-muted">
        Dokument-AI giver en hjælpsom forklaring, men er ikke juridisk rådgivning.
        Ved tvivl om vigtige beslutninger bør du kontakte en fagperson.
      </p>
    </div>
  );
}
