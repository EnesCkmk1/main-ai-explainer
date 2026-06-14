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

export default function Home() {
  const [status, setStatus] = useState<Status>("idle");
  const [analyse, setAnalyse] = useState<Analyse | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

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
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-5 py-10 sm:py-16">
      {/* Header */}
      <header className="text-center">
        <span className="pill mx-auto bg-surface text-accent-ink shadow-card">
          <span className="h-2 w-2 rounded-full bg-accent" />
          Drevet af Claude
        </span>
        <h1 className="mt-5 text-4xl leading-tight sm:text-5xl">
          Forstå dine dokumenter
          <br />
          <span className="italic text-accent">på almindeligt dansk</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          Upload en kontrakt, et tilbud, forsikringspapirer eller et brev. Få det
          forklaret i et sprog du forstår — med frister, vigtige punkter og et resumé.
        </p>
      </header>

      {/* Indhold */}
      <section className="mt-10 flex-1">
        {status === "idle" && (
          <div className="space-y-6">
            <UploadZone onSelect={analyze} />
            <ul className="grid grid-cols-2 gap-3 text-sm text-muted sm:grid-cols-4">
              {STEPS.map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="text-accent">✓</span>
                  {s}
                </li>
              ))}
            </ul>
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
          <ResultView analyse={analyse} fileName={fileName} onReset={reset} />
        )}
      </section>

      <footer className="mt-12 text-center text-xs text-muted">
        Dine dokumenter sendes kun til analyse og gemmes ikke.
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
      <h2 className="mt-5 text-xl font-semibold">Læser dit dokument…</h2>
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
