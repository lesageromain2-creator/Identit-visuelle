export type FontEntry = { name: string; desc: string; stack?: "serif" | "sans" | "script" | "display" };

/** Polices regroupées par usage suggéré */
export const FONTS = {
  display: [
    { name: "Syne", desc: "Bold, contemporain", stack: "sans" as const },
    { name: "Unbounded", desc: "Impact digital", stack: "sans" as const },
    { name: "Staatliches", desc: "Affiche compacte", stack: "display" as const },
    { name: "Bebas Neue", desc: "Titres ultra condensés", stack: "display" as const },
    { name: "Anton", desc: "Poster, fort", stack: "sans" as const },
    { name: "Righteous", desc: "Rétro fun", stack: "display" as const },
    { name: "Abril Fatface", desc: "Gras expressif", stack: "serif" as const },
    { name: "DM Serif Display", desc: "Luxe éditorial", stack: "serif" as const },
  ],
  serif: [
    { name: "Playfair Display", desc: "Élégant classique", stack: "serif" as const },
    { name: "Cormorant Garamond", desc: "Raffiné", stack: "serif" as const },
    { name: "EB Garamond", desc: "Intemporel", stack: "serif" as const },
    { name: "Lora", desc: "Chaleureux", stack: "serif" as const },
    { name: "Bodoni Moda", desc: "Mode & luxe", stack: "serif" as const },
    { name: "Philosopher", desc: "Poétique", stack: "serif" as const },
    { name: "Cinzel", desc: "Romain gravé", stack: "serif" as const },
    { name: "Gilda Display", desc: "Art déco", stack: "serif" as const },
    { name: "Italiana", desc: "Léger couture", stack: "serif" as const },
    { name: "Bellefair", desc: "Délicat", stack: "serif" as const },
    { name: "Libre Baskerville", desc: "Lisible classique", stack: "serif" as const },
    { name: "Spectral", desc: "Éditorial fin", stack: "serif" as const },
    { name: "Crimson Text", desc: "Livre", stack: "serif" as const },
    { name: "Rufina", desc: "Sobre chic", stack: "serif" as const },
  ],
  script: [
    { name: "Sacramento", desc: "Signature fluide", stack: "script" as const },
    { name: "Great Vibes", desc: "Calligraphie", stack: "script" as const },
    { name: "Dancing Script", desc: "Script vivant", stack: "script" as const },
    { name: "Pacifico", desc: "Rondeur chaleur", stack: "script" as const },
    { name: "Caveat", desc: "Manuscrit naturel", stack: "script" as const },
    { name: "Satisfy", desc: "Brush léger", stack: "script" as const },
    { name: "Lobster", desc: "Rétro bold", stack: "script" as const },
    { name: "Alex Brush", desc: "Romantique", stack: "script" as const },
    { name: "Pinyon Script", desc: "Précis fin", stack: "script" as const },
  ],
  sans: [
    { name: "Outfit", desc: "Neutre propre", stack: "sans" as const },
    { name: "Montserrat", desc: "Polyvalent", stack: "sans" as const },
    { name: "Poppins", desc: "Friendly", stack: "sans" as const },
    { name: "Raleway", desc: "Géométrique chic", stack: "sans" as const },
    { name: "Josefin Sans", desc: "Art déco", stack: "sans" as const },
    { name: "Quicksand", desc: "Doux arrondi", stack: "sans" as const },
    { name: "Karla", desc: "Humaniste", stack: "sans" as const },
    { name: "Jost", desc: "Neutre", stack: "sans" as const },
    { name: "Mulish", desc: "Minimal", stack: "sans" as const },
    { name: "Space Grotesk", desc: "Tech créatif", stack: "sans" as const },
    { name: "Nunito", desc: "Rond joyeux", stack: "sans" as const },
    { name: "Rubik", desc: "Moderne doux", stack: "sans" as const },
    { name: "Lexend", desc: "Lisibilité max", stack: "sans" as const },
    { name: "Barlow", desc: "Technique chaleureux", stack: "sans" as const },
    { name: "Manrope", desc: "Géométrique chaleureux", stack: "sans" as const },
  ],
  slab: [
    { name: "Josefin Slab", desc: "Vintage géo", stack: "serif" as const },
    { name: "Zilla Slab", desc: "Éditorial", stack: "serif" as const },
    { name: "Poiret One", desc: "Art nouveau", stack: "display" as const },
    { name: "Roboto Slab", desc: "Tech ancré", stack: "serif" as const },
  ],
  playful: [
    { name: "Fredoka", desc: "Arrondi ludique", stack: "sans" as const },
    { name: "Comfortaa", desc: "Courbes douces", stack: "sans" as const },
    { name: "Varela Round", desc: "UI friendly", stack: "sans" as const },
    { name: "Sniglet", desc: "Display fun", stack: "display" as const },
  ],
} as const;

export type FontCategory = keyof typeof FONTS;

export function fontCss(name: string): string {
  for (const cat of Object.keys(FONTS) as FontCategory[]) {
    const hit = FONTS[cat].find((f) => f.name === name);
    if (hit) {
      const fb =
        hit.stack === "script"
          ? "cursive"
          : hit.stack === "sans"
            ? "system-ui,sans-serif"
            : hit.stack === "display"
              ? "Impact,system-ui,sans-serif"
              : "Georgia,serif";
      return `'${hit.name}', ${fb}`;
    }
  }
  return `'${name}', system-ui, sans-serif`;
}

export const FONT_CATEGORY_LABELS: Record<FontCategory, string> = {
  display: "Display & impact — titres forts",
  serif: "Serif — élégance & éditorial",
  script: "Script & manuscrit — signature",
  sans: "Sans-serif — interface & lecture",
  slab: "Slab & structure",
  playful: "Arrondi & joyeux",
};

/** Couleurs : fonds neutres + pastels */
export const PALETTES = {
  bg: [
    "#FAFAFA",
    "#F5F5F0",
    "#FFF8F0",
    "#F0F7FF",
    "#FFF0F5",
    "#F5FFF8",
    "#FFFBEB",
    "#F3E8FF",
    "#ECFEFF",
    "#FEF3C7",
    "#E0F2FE",
    "#FCE7F3",
  ],
  text: [
    "#171615",
    "#1E293B",
    "#0F172A",
    "#292524",
    "#134E4A",
    "#4C0519",
    "#312E81",
    "#14532D",
    "#7C2D12",
    "#1E3A5F",
    "#3B0764",
    "#0C4A6E",
  ],
  primary: [
    "#2563EB",
    "#0891B2",
    "#059669",
    "#CA8A04",
    "#EA580C",
    "#DC2626",
    "#DB2777",
    "#9333EA",
    "#4F46E5",
    "#0D9488",
    "#16A34A",
    "#E11D48",
  ],
  secondary: [
    "#FBBF24",
    "#F472B6",
    "#34D399",
    "#60A5FA",
    "#FB923C",
    "#A78BFA",
    "#FACC15",
    "#2DD4BF",
    "#F9A8D4",
    "#93C5FD",
    "#FDE047",
    "#6EE7B7",
  ],
  blue: [
    "#EFF6FF",
    "#DBEAFE",
    "#BFDBFE",
    "#60A5FA",
    "#3B82F6",
    "#2563EB",
    "#1D4ED8",
    "#1E40AF",
    "#172554",
    "#0EA5E9",
    "#0369A1",
    "#0C4A6E",
  ],
  yellowOrange: [
    "#FFFBEB",
    "#FEF3C7",
    "#FDE68A",
    "#FCD34D",
    "#FBBF24",
    "#F59E0B",
    "#EA580C",
    "#F97316",
    "#FB923C",
    "#FFEDD5",
    "#FDBA74",
    "#C2410C",
  ],
  pink: [
    "#FDF2F8",
    "#FCE7F3",
    "#FBCFE8",
    "#F9A8D4",
    "#F472B6",
    "#EC4899",
    "#DB2777",
    "#BE185D",
    "#FBCFE8",
    "#FDA4AF",
    "#FB7185",
    "#9F1239",
  ],
  green: [
    "#F0FDF4",
    "#DCFCE7",
    "#BBF7D0",
    "#86EFAC",
    "#4ADE80",
    "#22C55E",
    "#16A34A",
    "#15803D",
    "#A7F3D0",
    "#34D399",
    "#059669",
    "#064E3B",
  ],
  /** Touches supplémentaires (multi-sélection) */
  mix: [
    "#E0E7FF",
    "#CFFAFE",
    "#FEE2E2",
    "#FFEDD5",
    "#EDE9FE",
    "#D1FAE5",
    "#FCE7F3",
    "#BFDBFE",
    "#FEF08A",
    "#FECACA",
    "#DDD6FE",
    "#A5F3FC",
  ],
} as const;

export type ColorRole = "bg" | "text" | "primary" | "secondary" | "extra";

export const COLOR_ROW_META: { paletteKey: keyof typeof PALETTES; role: ColorRole; label: string }[] = [
  { paletteKey: "bg", role: "bg", label: "Fond de page" },
  { paletteKey: "text", role: "text", label: "Texte principal" },
  { paletteKey: "primary", role: "primary", label: "Couleur principale (marque, CTA)" },
  { paletteKey: "secondary", role: "secondary", label: "Couleur secondaire (badges, liens)" },
  { paletteKey: "blue", role: "extra", label: "Bleus — fraîcheur & créativité" },
  { paletteKey: "yellowOrange", role: "extra", label: "Jaunes & oranges — énergie" },
  { paletteKey: "pink", role: "extra", label: "Roses & corails — douceur artistique" },
  { paletteKey: "green", role: "extra", label: "Verts — nature & vitalité" },
  { paletteKey: "mix", role: "extra", label: "Pastels & mélanges" },
];

/** Paramètre Google Fonts par famille */
function familyParam(name: string): string {
  const slug = name.replace(/ /g, "+");
  if (FONTS.script.some((f) => f.name === name)) return `family=${slug}`;
  const w400 = ["Bebas Neue", "Staatliches", "Anton", "Righteous", "Sniglet"];
  if (w400.includes(name)) return `family=${slug}:wght@400`;
  return `family=${slug}:ital,wght@0,300;0,400;0,600;0,700;1,400`;
}

const ALL_NAMES = (() => {
  const s = new Set<string>();
  (Object.keys(FONTS) as FontCategory[]).forEach((cat) => {
    FONTS[cat].forEach((f) => s.add(f.name));
  });
  return [...s].sort();
})();

export const GOOGLE_FONTS_STYLESHEET =
  `https://fonts.googleapis.com/css2?${ALL_NAMES.map(familyParam).join("&")}&display=swap`;

export const FONT_LIMITS = { headings: 10, body: 10, accent: 8 } as const;

export const EXTRA_COLOR_MAX = 12;
