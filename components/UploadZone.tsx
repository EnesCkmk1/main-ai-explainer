"use client";

import { useRef, useState } from "react";

const ACCEPT = ".pdf,.docx,.txt,image/*";

export function UploadZone({
  onSelect,
  disabled,
}: {
  onSelect: (file: File) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    onSelect(files[0]);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (!disabled) handleFiles(e.dataTransfer.files);
      }}
      className={`card relative flex flex-col items-center justify-center px-6 py-12 text-center transition
        ${dragging ? "border-accent bg-accent-soft/60 shadow-lift" : "hover:border-accent/50"}
        ${disabled ? "pointer-events-none opacity-60" : "cursor-pointer"}`}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      aria-label="Upload et dokument"
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        disabled={disabled}
      />

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 16V4" />
          <path d="m7 9 5-5 5 5" />
          <path d="M5 16v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" />
        </svg>
      </div>

      <p className="mt-4 text-lg font-semibold">
        Træk dit dokument hertil, eller <span className="text-accent">vælg en fil</span>
      </p>
      <p className="mt-1.5 text-sm text-muted">
        PDF, Word, et billede eller en scanning - op til 20 MB
      </p>
    </div>
  );
}
