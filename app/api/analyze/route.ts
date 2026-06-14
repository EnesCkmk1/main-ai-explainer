import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import {
  extractContent,
  UnsupportedFileError,
  EmptyDocumentError,
} from "@/lib/extract";
import { ANALYSE_SCHEMA, type Analyse } from "@/lib/schema";

// Kør i Node-runtime (vi bruger Buffer + mammoth), og giv god tid til analysen.
export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BYTES = 20 * 1024 * 1024; // 20 MB

const SYSTEM_PROMPT = `Du er en hjælpsom dansk dokument-assistent. Du hjælper helt almindelige mennesker og virksomheder med at forstå officielle og juridiske dokumenter — kontrakter, tilbud, forsikringspapirer, breve fra myndigheder osv.

Dine principper:
- Forklar ALT i almindeligt, letforståeligt dansk. Undgå fagsprog og jura-floskler — og hvis et fagord er nødvendigt, så forklar det kort.
- Vær præcis og neutral. Find frem til hvad dokumentet reelt betyder for modtageren.
- Find alle relevante datoer, frister og deadlines.
- Fremhæv ting man bør være ekstra opmærksom på (bindingsperioder, gebyrer, automatisk fornyelse, opsigelsesvarsler, ugunstige vilkår).
- Du giver IKKE juridisk rådgivning og opfordrer ved tvivl til at kontakte en fagperson.
- Hvis noget i dokumentet er uklart eller ulæseligt, så sig det ærligt i stedet for at gætte.`;

const INSTRUCTION = `Analysér det vedhæftede dokument og udfyld felterne. Skriv alt på almindeligt dansk, så en lægmand kan forstå det.`;

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Serveren mangler en API-nøgle. Tilføj ANTHROPIC_API_KEY i .env.local." },
      { status: 500 }
    );
  }

  let file: File | null = null;
  try {
    const formData = await request.formData();
    const entry = formData.get("file");
    if (entry instanceof File) file = entry;
  } catch {
    return NextResponse.json({ error: "Kunne ikke læse den uploadede fil." }, { status: 400 });
  }

  if (!file) {
    return NextResponse.json({ error: "Ingen fil blev uploadet." }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "Filen er tom." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Filen er for stor. Maks. 20 MB." },
      { status: 413 }
    );
  }

  // 1) Udtræk indhold afhængigt af filtype.
  let content;
  try {
    content = await extractContent(file);
  } catch (err) {
    if (err instanceof UnsupportedFileError || err instanceof EmptyDocumentError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Kunne ikke læse dokumentets indhold." },
      { status: 400 }
    );
  }

  // 2) Byg beskedens indhold til Claude.
  const userContent: Anthropic.ContentBlockParam[] = [];
  if (content.kind === "pdf") {
    userContent.push({
      type: "document",
      source: { type: "base64", media_type: "application/pdf", data: content.base64 },
    });
  } else if (content.kind === "image") {
    userContent.push({
      type: "image",
      source: {
        type: "base64",
        media_type: content.mediaType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
        data: content.base64,
      },
    });
  } else {
    userContent.push({
      type: "text",
      text: `Her er dokumentets tekst:\n\n"""\n${content.text}\n"""`,
    });
  }
  userContent.push({ type: "text", text: INSTRUCTION });

  // 3) Kald Claude med struktureret output, så svaret altid har samme form.
  const client = new Anthropic({ apiKey });
  try {
    const message = (await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 16000,
      thinking: { type: "adaptive" },
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userContent }],
      // output_config er nyere end nogle SDK-typer — cast for at undgå typefriktion.
      output_config: { format: { type: "json_schema", schema: ANALYSE_SCHEMA } },
    } as unknown as Anthropic.MessageCreateParamsNonStreaming)) as Anthropic.Message;

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json(
        { error: "Modellen returnerede ikke et brugbart svar. Prøv igen." },
        { status: 502 }
      );
    }

    let analyse: Analyse;
    try {
      analyse = JSON.parse(textBlock.text) as Analyse;
    } catch {
      return NextResponse.json(
        { error: "Kunne ikke fortolke analysen. Prøv igen." },
        { status: 502 }
      );
    }

    return NextResponse.json({ analyse });
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { error: "API-nøglen blev afvist. Tjek ANTHROPIC_API_KEY." },
        { status: 401 }
      );
    }
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "Der er for mange forespørgsler lige nu. Prøv igen om lidt." },
        { status: 429 }
      );
    }
    if (err instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Fejl fra AI-tjenesten (${err.status ?? "?"}). Prøv igen.` },
        { status: 502 }
      );
    }
    return NextResponse.json(
      { error: "Der opstod en uventet fejl under analysen." },
      { status: 500 }
    );
  }
}
