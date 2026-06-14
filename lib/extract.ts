import mammoth from "mammoth";

// Understøttede billedformater i Claudes vision.
const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
] as const;

export type ExtractedContent =
  | { kind: "pdf"; base64: string }
  | { kind: "image"; base64: string; mediaType: string }
  | { kind: "text"; text: string };

export class UnsupportedFileError extends Error {}
export class EmptyDocumentError extends Error {}

/**
 * Læser en uploadet fil og gør den klar til Claude:
 *  - PDF  -> base64 (Claude læser PDF direkte)
 *  - Billede/scan -> base64 (Claude læser tekst via vision)
 *  - Word (.docx) -> ren tekst udtrukket med mammoth
 *  - .txt -> ren tekst
 */
export async function extractContent(file: File): Promise<ExtractedContent> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const type = (file.type || "").toLowerCase();
  const name = (file.name || "").toLowerCase();

  if (type === "application/pdf" || name.endsWith(".pdf")) {
    return { kind: "pdf", base64: buffer.toString("base64") };
  }

  if (SUPPORTED_IMAGE_TYPES.includes(type as (typeof SUPPORTED_IMAGE_TYPES)[number])) {
    return { kind: "image", base64: buffer.toString("base64"), mediaType: type };
  }

  if (
    name.endsWith(".docx") ||
    type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const { value } = await mammoth.extractRawText({ buffer });
    const text = value.trim();
    if (!text) {
      throw new EmptyDocumentError("Word-dokumentet ser ud til at være tomt.");
    }
    return { kind: "text", text };
  }

  if (type.startsWith("text/") || name.endsWith(".txt")) {
    const text = buffer.toString("utf-8").trim();
    if (!text) {
      throw new EmptyDocumentError("Filen ser ud til at være tom.");
    }
    return { kind: "text", text };
  }

  throw new UnsupportedFileError(
    "Filtypen understøttes ikke. Upload en PDF, et billede (JPG/PNG), et Word-dokument (.docx) eller en tekstfil."
  );
}
