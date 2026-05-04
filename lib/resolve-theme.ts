export type ColorSelection = {
  bg: string | null;
  text: string | null;
  primary: string | null;
  secondary: string | null;
  extras: string[];
};

export type ResolvedTheme = {
  bg: string;
  surface: string;
  text: string;
  muted: string;
  primary: string;
  secondary: string;
  extras: string[];
};

const DEF: ResolvedTheme = {
  bg: "#EEEEEE",
  surface: "#FFFFFF",
  text: "#171615",
  muted: "#575757",
  primary: "#2C2825",
  secondary: "#FFC800",
  extras: [],
};

/** Compte les rôles « principaux » (hors extras) */
function countMain(c: ColorSelection): number {
  let n = 0;
  if (c.bg) n++;
  if (c.text) n++;
  if (c.primary) n++;
  if (c.secondary) n++;
  return n;
}

/**
 * Si une seule couleur « principale » est choisie, on garde le reste sobre pour
 * mettre en valeur ce choix. Sinon, champs vides = défauts type Site 17.
 */
export function resolveTheme(c: ColorSelection): ResolvedTheme {
  const extras = [...c.extras];
  const mainCount = countMain(c);

  if (mainCount === 0 && extras.length === 0) {
    return { ...DEF, extras: [] };
  }

  if (mainCount === 1) {
    if (c.primary) {
      return {
        bg: "#FAFAFA",
        surface: "#FFFFFF",
        text: "#171615",
        muted: "#575757",
        primary: c.primary,
        secondary: c.primary,
        extras,
      };
    }
    if (c.secondary) {
      return {
        bg: "#FFFFFF",
        surface: "#FAFAFA",
        text: "#171615",
        muted: "#575757",
        primary: c.secondary,
        secondary: c.secondary,
        extras,
      };
    }
    if (c.bg) {
      return {
        bg: c.bg,
        surface: "#FFFFFF",
        text: "#171615",
        muted: "#575757",
        primary: "#2563EB",
        secondary: "#FBBF24",
        extras,
      };
    }
    if (c.text) {
      return {
        bg: "#FAFAFA",
        surface: "#FFFFFF",
        text: c.text,
        muted: "#575757",
        primary: "#2563EB",
        secondary: "#F472B6",
        extras,
      };
    }
  }

  return {
    bg: c.bg ?? DEF.bg,
    surface: "#FFFFFF",
    text: c.text ?? DEF.text,
    muted: DEF.muted,
    primary: c.primary ?? c.secondary ?? DEF.primary,
    secondary: c.secondary ?? c.primary ?? DEF.secondary,
    extras,
  };
}

export type FontBuckets = { headings: string[]; body: string[]; accent: string[] };

const FALLBACK_HEADING = "Cormorant Garamond";
const FALLBACK_BODY = "Outfit";

export function pickFont(bucket: string[], index: number, fallback: string): string {
  if (!bucket.length) return fallback;
  return bucket[index % bucket.length];
}

/** Polices uniques conservant l’ordre d’apparition (titres → corps → signature) */
export function uniqueFontsOrdered(b: FontBuckets): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const name of [...b.headings, ...b.body, ...b.accent]) {
    if (!seen.has(name)) {
      seen.add(name);
      out.push(name);
    }
  }
  return out;
}

export function resolveFontBuckets(b: FontBuckets): {
  heading: string;
  body: string;
  accent: string;
  all: string[];
  singleFont: boolean;
} {
  const all = uniqueFontsOrdered(b);
  if (all.length === 0) {
    return {
      heading: FALLBACK_HEADING,
      body: FALLBACK_BODY,
      accent: FALLBACK_HEADING,
      all: [FALLBACK_HEADING, FALLBACK_BODY],
      singleFont: false,
    };
  }
  if (all.length === 1) {
    const f = all[0];
    return { heading: f, body: f, accent: f, all: [f], singleFont: true };
  }
  return {
    heading: pickFont(b.headings.length ? b.headings : all, 0, FALLBACK_HEADING),
    body: pickFont(b.body.length ? b.body : b.headings.length ? b.headings : all, 0, FALLBACK_BODY),
    accent: pickFont(
      b.accent.length ? b.accent : b.headings.length ? b.headings : all,
      0,
      pickFont(b.headings, 0, FALLBACK_HEADING),
    ),
    all,
    singleFont: false,
  };
}
