"use client";

import { useState } from "react";
import { UploadZone } from "@/components/UploadZone";
import { ResultView } from "@/components/ResultView";
import type { Analyse } from "@/lib/schema";

type Status = "idle" | "loading" | "done" | "error";

const STEPS = [
  "Forklarer på almindeligt dansk",
  "Fremhæver vigtige punkter",
  "Finder frister og datoer",
  "Skriver et resumé",
];

const FEATURES = [
  {
    label: "Forklaring på dansk",
    icon: (
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    ),
  },
  {
    label: "Vigtige punkter",
    icon: (
      <>
        <path d="m9 11 3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </>
    ),
  },
  {
    label: "Frister og datoer",
    icon: (
      <>
        <path d="M8 2v4M16 2v4M3 10h18" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
      </>
    ),
  },
  {
    label: "Kort resumé",
    icon: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </>
    ),
  },
];

export default function Home() {
  const [status, setStatus] = useState<Status>("idle");
  const [analyse, setAnalyse] = useState<Analyse | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [demo, setDemo] = useState(false);

  async function analyze(file: File) {
    setStatus("loading");
    setError("");
    setFileName(file.name);

    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/analyze", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Noget gik galt. Prøv igen.");
        setStatus("error");
        return;
      }
      setAnalyse(data.analyse as Analyse);
      setDemo(Boolean(data.demo));
      setStatus("done");
    } catch {
      setError("Kunne ikke få forbindelse til serveren. Tjek din internetforbindelse.");
      setStatus("error");
    }
  }

  function reset() {
    setStatus("idle");
    setAnalyse(null);
    setError("");
    setFileName("");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-5 py-8 sm:py-12">
      {/* Wordmark */}
      <div className="mb-10 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white shadow-card">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
          </svg>
        </span>
        <span className="font-display text-lg font-semibold tracking-tight">Dokument-AI</span>
      </div>

      {/* Header */}
      {status === "idle" && (
        <header className="text-center">
          <h1 className="text-4xl leading-tight sm:text-5xl">
            Forstå dine dokumenter
            <br />
            <span className="italic text-accent">på almindeligt dansk</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Kontrakter, tilbud, forsikringspapirer og breve er sjældent skrevet, så de
            er til at forstå. Upload dit dokument, så forklarer vi det i et sprog du
            forstår - og finder de frister og vigtige punkter, du skal huske.
          </p>
        </header>
      )}

      {/* Indhold */}
      <section className={`flex-1 ${status === "idle" ? "mt-10" : "mt-4"}`}>
        {status === "idle" && (
          <div className="space-y-8">
            <UploadZone onSelect={analyze} />

            <div>
              <p className="mb-3 text-center text-sm font-medium text-muted">
                Det får du tilbage på sekunder
              </p>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {FEATURES.map((f) => (
                  <li
                    key={f.label}
                    className="card flex flex-col items-center gap-2 px-3 py-4 text-center"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        {f.icon}
                      </svg>
                    </span>
                    <span className="text-sm font-medium leading-snug">{f.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {status === "loading" && <LoadingState fileName={fileName} />}

        {status === "error" && (
          <div className="card border-danger/30 bg-danger-soft/50 p-8 text-center">
            <h2 className="text-xl font-semibold text-danger">Det gik galt</h2>
            <p className="mx-auto mt-2 max-w-md text-ink/80">{error}</p>
            <button
              onClick={reset}
              className="mt-5 rounded-full bg-accent px-5 py-2.5 font-medium text-white transition hover:bg-accent-ink"
            >
              Prøv igen
            </button>
          </div>
        )}

        {status === "done" && analyse && (
          <ResultView analyse={analyse} fileName={fileName} demo={demo} onReset={reset} />
        )}
      </section>

      <footer className="mt-12 text-center text-xs text-muted">
        Dine dokumenter bruges kun til analysen og gemmes ikke.
      </footer>
    </main>
  );
}

function LoadingState({ fileName }: { fileName: string }) {
  return (
    <div className="card p-8 text-center sm:p-12">
      <div className="mx-auto flex h-14 w-14 items-center justify-center">
        <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-accent-soft border-t-accent" />
      </div>
      <h2 className="mt-5 text-xl font-semibold">Læser dit dokument …</h2>
      <p className="mt-1 truncate text-sm text-muted" title={fileName}>
        {fileName}
      </p>
      <ul className="mx-auto mt-6 max-w-xs space-y-2 text-left text-sm text-muted">
        {STEPS.map((s) => (
          <li key={s} className="flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}
