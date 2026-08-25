import type { Analyse } from "@/lib/schema";

// Demo-mode: hvis der ikke er sat en ANTHROPIC_API_KEY, kører appen med denne
// færdige eksempel-analyse i stedet for at kalde Claude. Så kan projektet
// deployes som en offentlig demo uden en rigtig nøgle. Den uploadede fil
// valideres stadig (tom fil / uunderstøttet filtype fejler som normalt),
// men indholdet analyseres ikke.
export const DEMO_MODE = !process.env.ANTHROPIC_API_KEY;

export const DEMO_ANALYSE: Analyse = {
  dokumenttype: "Mobilabonnement (eksempel)",
  resume:
    "Det her er et 12-måneders mobilabonnement til 149 kr. om måneden. Prisen stiger til 199 kr. efter det første halve år, og aftalen fornyes automatisk, hvis du ikke siger op senest en måned før udløb.",
  forklaring:
    "Du binder dig til abonnementet i 12 måneder. De første 6 måneder betaler du 149 kr. om måneden, og derefter stiger prisen automatisk til 199 kr. om måneden - det er vigtigt at være opmærksom på, for det står med småt.\n\nAftalen fornyes af sig selv med 12 måneder ad gangen, medmindre du opsiger den senest 1 måned før perioden udløber. Opsiger du for sent, hænger du på endnu et år.\n\nDer er også et oprettelsesgebyr på 99 kr. på din første regning, og hvis du betaler for sent, kommer der et rykkergebyr på 100 kr. oveni.",
  vigtige_punkter: [
    "Bindingsperiode på 12 måneder - du kan ikke slippe ud før tid uden at betale.",
    "Prisen stiger fra 149 kr. til 199 kr. om måneden efter de første 6 måneder.",
    "Abonnementet fornyes automatisk med et helt år, hvis du ikke siger op i tide.",
    "Oprettelsesgebyr på 99 kr. på den første regning.",
  ],
  datoer: [
    {
      dato: "1. september 2026",
      beskrivelse: "Abonnementet starter, og bindingsperioden begynder at løbe.",
      vigtighed: "mellem",
    },
    {
      dato: "1. marts 2027",
      beskrivelse: "Prisen stiger fra 149 kr. til 199 kr. om måneden.",
      vigtighed: "høj",
    },
    {
      dato: "Senest 31. juli 2027",
      beskrivelse:
        "Sidste frist for at opsige, hvis du vil undgå automatisk fornyelse (1 måned før udløb).",
      vigtighed: "høj",
    },
  ],
  advarsler: [
    "Prisstigningen efter 6 måneder står med småt - husk den, så regningen ikke overrasker dig.",
    "Automatisk fornyelse: siger du ikke op senest en måned før udløb, binder du dig for endnu et år.",
    "Rykkergebyr på 100 kr. hvis du betaler for sent.",
  ],
};
