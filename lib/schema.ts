// Fælles typer + JSON-skema for den strukturerede analyse fra Claude.
// Skemaet bruges som "output_config.format" så modellen ALTID svarer i samme form.

export type Vigtighed = "høj" | "mellem" | "lav";

export interface DatoPunkt {
  dato: string;
  beskrivelse: string;
  vigtighed: Vigtighed;
}

export interface Analyse {
  dokumenttype: string;
  resume: string;
  forklaring: string;
  vigtige_punkter: string[];
  datoer: DatoPunkt[];
  advarsler: string[];
}

// JSON Schema der sendes til Claude. Bemærk: ingen minLength/maxLength o.l.
// (ikke understøttet af structured outputs), og additionalProperties: false på alle objekter.
export const ANALYSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    dokumenttype: {
      type: "string",
      description:
        "Kort betegnelse for hvilken slags dokument det er, fx 'Lejekontrakt', 'Forsikringspolice', 'Tilbud', 'Brev fra kommunen'.",
    },
    resume: {
      type: "string",
      description:
        "Et kort resumé på 2-4 sætninger i almindeligt dansk, som en lægmand kan forstå.",
    },
    forklaring: {
      type: "string",
      description:
        "En mere udførlig forklaring af hvad dokumentet betyder for modtageren, i almindeligt dansk uden fagsprog. Brug gerne flere afsnit adskilt af linjeskift.",
    },
    vigtige_punkter: {
      type: "array",
      description: "De vigtigste punkter man skal være opmærksom på.",
      items: { type: "string" },
    },
    datoer: {
      type: "array",
      description:
        "Alle relevante datoer, frister og deadlines fundet i dokumentet.",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          dato: {
            type: "string",
            description: "Datoen eller fristen, fx '1. august 2026' eller 'inden 14 dage'.",
          },
          beskrivelse: {
            type: "string",
            description: "Hvad datoen/fristen handler om.",
          },
          vigtighed: {
            type: "string",
            enum: ["høj", "mellem", "lav"],
            description: "Hvor kritisk fristen er.",
          },
        },
        required: ["dato", "beskrivelse", "vigtighed"],
      },
    },
    advarsler: {
      type: "array",
      description:
        "Ting man bør være ekstra opmærksom på: ugunstige vilkår, bindingsperioder, gebyrer, automatisk fornyelse, opsigelsesvarsler osv. Tom liste hvis der ikke er nogen.",
      items: { type: "string" },
    },
  },
  required: [
    "dokumenttype",
    "resume",
    "forklaring",
    "vigtige_punkter",
    "datoer",
    "advarsler",
  ],
} as const;
