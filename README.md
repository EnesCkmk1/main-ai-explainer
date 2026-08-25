<div align="center">

# 📄 Dokument-AI

**Forstå kontrakter, tilbud, forsikringspapirer og breve — forklaret på almindeligt dansk.**

Upload et dokument og få det oversat fra jura-sprog til noget, du faktisk forstår.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38BDF8?logo=tailwindcss&logoColor=white)
![Claude](https://img.shields.io/badge/Claude-Anthropic-D97757)

</div>

---

## Hvad kan den?

Du uploader et dokument, og systemet:

- 🗣️ **forklarer** det på et sprog, du forstår — uden jura-floskler
- ⭐ **fremhæver** de vigtigste punkter
- 📅 **finder** frister, datoer og deadlines
- 📝 **skriver** et kort resumé
- ⚠️ **advarer** om ting, du bør være ekstra opmærksom på (gebyrer, bindingsperioder, automatisk fornyelse …)

Nyttigt for både private og virksomheder.

> **Bemærk:** Dokument-AI giver en hjælpsom forklaring, men er **ikke** juridisk rådgivning. Er du i tvivl, så kontakt en fagperson.

## 🧪 Demo-tilstand

Uden en API-nøgle kører appen i **demo-tilstand**: den viser en fast eksempel-analyse
i stedet for at kalde Claude. Det gør, at projektet kan deployes og prøves offentligt
uden en rigtig nøgle — upload en vilkårlig fil og se, hvordan resultatet ser ud.

Sæt `ANTHROPIC_API_KEY` (se nedenfor) for at analysere rigtige dokumenter.

## Understøttede filtyper

| Filtype | Håndtering |
| --- | --- |
| **PDF** | Læses direkte af Claude |
| **Billede / scan** (JPG, PNG, GIF, WebP) | Læses direkte af Claude (vision) |
| **Word** (`.docx`) | Tekst trækkes ud med `mammoth` |
| **Tekstfil** (`.txt`) | Læses som ren tekst |

Maks. filstørrelse: **20 MB**.

## Sådan virker det

```
   Upload  ──►  /api/analyze  ──►  Claude  ──►  Struktureret JSON  ──►  UI
 (browser)     (server-route)    (Anthropic)     (fast skema)        (sektioner)
```

Analysen kører **server-side** via en Next.js route handler (`app/api/analyze`), så
API-nøglen aldrig kommer ud i browseren. Claude svarer i et fast JSON-skema
(structured outputs), så UI'et altid får data i samme form — resumé, forklaring,
vigtige punkter, datoer og advarsler.

## Teknologi

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** — responsivt, mobilvenligt design
- **Claude** (`claude-sonnet-4-6`) via [`@anthropic-ai/sdk`](https://www.npmjs.com/package/@anthropic-ai/sdk)
- **mammoth** til udtræk af tekst fra Word

## Kom i gang

**1. Installer afhængigheder**

```bash
npm install
```

**2. Opret `.env.local` og indsæt din Anthropic-nøgle**

```bash
cp .env.local.example .env.local
# rediger .env.local og indsæt din rigtige nøgle
```

```dotenv
ANTHROPIC_API_KEY=sk-ant-...
```

> Din nøgle bliver **aldrig** committet — `.env.local` er med i `.gitignore`.
> Du får en nøgle på [console.anthropic.com](https://console.anthropic.com/).

**3. Start udviklingsserveren**

```bash
npm run dev
```

**4. Åbn** [http://localhost:3000](http://localhost:3000)

## Projektstruktur

```
app/
  api/analyze/route.ts   # Sikker server-route der kalder Claude
  layout.tsx             # Fonts + metadata
  page.tsx               # Forside med upload + resultat
  globals.css            # Globale styles
components/
  UploadZone.tsx         # Drag & drop upload
  ResultView.tsx         # Viser analysen i sektioner
lib/
  extract.ts             # Udtræk indhold fra PDF/billede/Word/tekst
  schema.ts              # JSON-skema + typer for analysen
```

## Scripts

| Kommando | Beskrivelse |
| --- | --- |
| `npm run dev` | Start udviklingsserver |
| `npm run build` | Byg til produktion |
| `npm run start` | Kør produktions-build |
| `npm run lint` | Kør linter |

## Licens

Udgivet under [MIT-licensen](LICENSE).
