# 📄 Dokument-AI

Forstå kontrakter, tilbud, forsikringspapirer og breve — forklaret på almindeligt dansk.

Upload et dokument, så:

- **forklarer** systemet det på et sprog du forstår
- **fremhæver** de vigtige punkter
- **finder** frister og datoer
- **skriver** et kort resumé
- **advarer** om ting du bør være ekstra opmærksom på (gebyrer, bindingsperioder, automatisk fornyelse …)

Nyttigt for både private og virksomheder.

## Sådan virker det

| Filtype | Håndtering |
| --- | --- |
| PDF | Læses direkte af Claude |
| Billede / scan (JPG, PNG …) | Læses direkte af Claude (vision) |
| Word (.docx) | Tekst trækkes ud med `mammoth` |
| Tekstfil (.txt) | Læses som ren tekst |

Analysen kører server-side via en Next.js route handler (`app/api/analyze`), så API-nøglen
aldrig kommer ud i browseren. Claude svarer i et fast JSON-skema (structured outputs),
så UI'et altid får data i samme form.

## Teknologi

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** — responsivt, mobilvenligt design
- **Claude (`claude-sonnet-4-6`)** via `@anthropic-ai/sdk`
- **mammoth** til Word-udtræk

## Kom i gang

1. Installer afhængigheder:

   ```bash
   npm install
   ```

2. Opret `.env.local` og indsæt din Anthropic-nøgle:

   ```bash
   cp .env.local.example .env.local
   # rediger .env.local og indsæt din rigtige nøgle
   ```

   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

3. Start udviklingsserveren:

   ```bash
   npm run dev
   ```

4. Åbn [http://localhost:3000](http://localhost:3000).

## Projektstruktur

```
app/
  api/analyze/route.ts   # Sikker server-route der kalder Claude
  layout.tsx             # Fonts + metadata
  page.tsx               # Forside med upload + resultat
components/
  UploadZone.tsx         # Drag & drop upload
  ResultView.tsx         # Viser analysen i sektioner
lib/
  extract.ts             # Udtræk indhold fra PDF/billede/Word/tekst
  schema.ts              # JSON-skema + typer for analysen
```

## Bemærk

Dokument-AI giver en hjælpsom forklaring, men er **ikke** juridisk rådgivning.
