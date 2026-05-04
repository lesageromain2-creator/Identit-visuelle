"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  COLOR_ROW_META,
  EXTRA_COLOR_MAX,
  FONT_CATEGORY_LABELS,
  FONT_LIMITS,
  FONTS,
  PALETTES,
  fontCss,
  type ColorRole,
  type FontCategory,
} from "@/lib/explorer-data";
import { resolveTheme, type FontBuckets } from "@/lib/resolve-theme";
import { LiveSitePreview } from "@/components/LiveSitePreview";
import "./explorer.css";

type Tab = "fonts" | "colors";
type FontPool = keyof FontBuckets;

type SummaryItem =
  | { kind: "font"; pool: FontPool; name: string }
  | { kind: "color"; role: "bg" | "text" | "primary" | "secondary"; hex: string }
  | { kind: "extra"; hex: string };

const POOL_LABELS: Record<FontPool, string> = {
  headings: "Titres & affichage",
  body: "Corps & interface",
  accent: "Signature & détail",
};

const POOL_HINTS: Record<FontPool, string> = {
  headings: "Titres de page, hero, noms d’œuvres. Tu peux en choisir plusieurs : ils se répartissent dans la maquette.",
  body: "Navigation, paragraphes, boutons. Idéal en sans-serif ou humaniste.",
  accent: "Sous-titres, badge, touches calligraphiques ou display. Combine avec les autres groupes.",
};

export function StyleExplorer() {
  const [tab, setTab] = useState<Tab>("fonts");
  const [fontPoolTab, setFontPoolTab] = useState<FontPool>("headings");
  const [fonts, setFonts] = useState<FontBuckets>({ headings: [], body: [], accent: [] });
  const [colors, setColors] = useState<{
    bg: string | null;
    text: string | null;
    primary: string | null;
    secondary: string | null;
    extras: string[];
  }>({ bg: null, text: null, primary: null, secondary: null, extras: [] });
  const [toast, setToast] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const colorFxRef = useRef<{ toast: string | null; copy: string | null } | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
  }, []);

  useLayoutEffect(() => {
    const fx = colorFxRef.current;
    if (!fx) return;
    colorFxRef.current = null;
    if (fx.toast) showToast(fx.toast);
    if (fx.copy) void navigator.clipboard.writeText(fx.copy).catch(() => {});
  }, [colors, showToast]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  const resolvedTheme = useMemo(() => resolveTheme(colors), [colors]);

  const toggleFont = useCallback(
    (name: string) => {
      const pool = fontPoolTab;
      const limit = FONT_LIMITS[pool];
      let limitReached = false;
      setFonts((prev) => {
        const cur = [...prev[pool]];
        const idx = cur.indexOf(name);
        if (idx >= 0) {
          cur.splice(idx, 1);
        } else {
          if (cur.length >= limit) {
            limitReached = true;
            return prev;
          }
          cur.push(name);
        }
        return { ...prev, [pool]: cur };
      });
      if (limitReached) {
        showToast(`Maximum ${limit} polices dans « ${POOL_LABELS[pool]} »`);
      }
    },
    [fontPoolTab, showToast],
  );

  const fontInPools = useCallback(
    (name: string): FontPool[] => {
      const out: FontPool[] = [];
      if (fonts.headings.includes(name)) out.push("headings");
      if (fonts.body.includes(name)) out.push("body");
      if (fonts.accent.includes(name)) out.push("accent");
      return out;
    },
    [fonts],
  );

  const isFontSelectedHere = (name: string) => fonts[fontPoolTab].includes(name);

  const toggleColor = useCallback((hex: string, role: ColorRole) => {
    setColors((prev) => {
      const out = applyColorToggle(prev, hex, role);
      if (out.toast || out.copyHex) {
        colorFxRef.current = { toast: out.toast, copy: out.copyHex };
      }
      return out.next;
    });
  }, []);

  const isSwatchSelected = useCallback(
    (hex: string, role: ColorRole) => {
      if (role === "extra") return colors.extras.includes(hex);
      return colors[role] === hex;
    },
    [colors],
  );

  const summaryItems: SummaryItem[] = useMemo(() => {
    const items: SummaryItem[] = [];
    (["headings", "body", "accent"] as const).forEach((pool) => {
      fonts[pool].forEach((name) => items.push({ kind: "font", pool, name }));
    });
    if (colors.bg) items.push({ kind: "color", role: "bg", hex: colors.bg });
    if (colors.text) items.push({ kind: "color", role: "text", hex: colors.text });
    if (colors.primary) items.push({ kind: "color", role: "primary", hex: colors.primary });
    if (colors.secondary) items.push({ kind: "color", role: "secondary", hex: colors.secondary });
    colors.extras.forEach((hex) => items.push({ kind: "extra", hex }));
    return items;
  }, [fonts, colors]);

  const selectionCount = summaryItems.length;

  const removeItem = useCallback((item: SummaryItem) => {
    if (item.kind === "font") {
      setFonts((prev) => ({
        ...prev,
        [item.pool]: prev[item.pool].filter((n) => n !== item.name),
      }));
    } else if (item.kind === "color") {
      setColors((prev) => ({ ...prev, [item.role]: null }));
    } else {
      setColors((prev) => ({
        ...prev,
        extras: prev.extras.filter((h) => h !== item.hex),
      }));
    }
  }, []);

  const sendSelection = useCallback(() => {
    setSent(true);
    showToast("Récap enregistré localement !");
  }, [showToast]);

  const sentLines = useMemo(() => {
    const lines: string[] = [];
    (["headings", "body", "accent"] as const).forEach((pool) => {
      fonts[pool].forEach((f) => lines.push(`${POOL_LABELS[pool]} : ${f}`));
    });
    if (colors.bg) lines.push(`Fond : ${colors.bg}`);
    if (colors.text) lines.push(`Texte : ${colors.text}`);
    if (colors.primary) lines.push(`Couleur principale : ${colors.primary}`);
    if (colors.secondary) lines.push(`Couleur secondaire : ${colors.secondary}`);
    colors.extras.forEach((c) => lines.push(`Touche : ${c}`));
    return lines;
  }, [fonts, colors]);

  return (
    <div className="da-root">
      <header className="da-top-header">
        <div className="da-header-left">
          <h1>Direction artistique</h1>
          <p>
            Compose titres, corps, signatures et palette — aperçu type galerie (Site 17 / Shopayado). 100 % local, sans
            serveur.
          </p>
        </div>
        <div className="da-step-indicator">
          <button
            type="button"
            className={`da-step ${tab === "fonts" ? "active" : ""} ${tab !== "fonts" ? "done" : ""}`}
            onClick={() => setTab("fonts")}
            aria-label="Typographies"
          >
            1
          </button>
          <div className="da-step-sep" aria-hidden />
          <button
            type="button"
            className={`da-step ${tab === "colors" ? "active" : ""}`}
            onClick={() => setTab("colors")}
            aria-label="Couleurs"
          >
            2
          </button>
          <div className="da-step-sep" aria-hidden />
          <div className={`da-step ${selectionCount > 0 ? "active" : ""}`} aria-hidden>
            3
          </div>
        </div>
      </header>

      <div className="da-layout">
        <div className="da-left-panel">
          <div className="da-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === "fonts"}
              className={`da-tab-btn ${tab === "fonts" ? "active" : ""}`}
              onClick={() => setTab("fonts")}
            >
              Typographies
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "colors"}
              className={`da-tab-btn ${tab === "colors" ? "active" : ""}`}
              onClick={() => setTab("colors")}
            >
              Couleurs
            </button>
          </div>

          <div className={`da-font-section ${tab === "fonts" ? "active" : ""}`}>
            <div className="da-pool-tabs" role="tablist" aria-label="Groupe de polices actif">
              {(["headings", "body", "accent"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  role="tab"
                  aria-selected={fontPoolTab === p}
                  className={`da-pool-tab ${fontPoolTab === p ? "active" : ""}`}
                  onClick={() => setFontPoolTab(p)}
                >
                  {POOL_LABELS[p]} ({fonts[p].length}/{FONT_LIMITS[p]})
                </button>
              ))}
            </div>
            <p className="da-pool-hint">{POOL_HINTS[fontPoolTab]}</p>

            {(Object.keys(FONTS) as FontCategory[]).map((cat) => (
              <div key={cat}>
                <div className="da-cat-label">{FONT_CATEGORY_LABELS[cat]}</div>
                <div className="da-font-grid">
                  {FONTS[cat].map((f) => {
                    const pools = fontInPools(f.name);
                    const here = isFontSelectedHere(f.name);
                    return (
                      <button
                        key={f.name}
                        type="button"
                        className={`da-font-card ${here ? "selected" : ""}`}
                        onClick={() => toggleFont(f.name)}
                      >
                        <div className="da-fc-name">
                          <span>{f.name}</span>
                          {pools.length > 0 && (
                            <span className="da-font-badges">
                              {pools.map((pl) => (
                                <span key={pl} className="da-font-badge" title={POOL_LABELS[pl]}>
                                  {pl === "headings" ? "T" : pl === "body" ? "C" : "S"}
                                </span>
                              ))}
                            </span>
                          )}
                        </div>
                        <div className="da-fc-preview" style={{ fontFamily: fontCss(f.name) }}>
                          Le Shopayado
                        </div>
                        <div className="da-fc-desc">{f.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className={`da-color-section ${tab === "colors" ? "active" : ""}`}>
            {COLOR_ROW_META.map(({ paletteKey, role, label }) => (
              <PaletteGroup key={paletteKey} label={label}>
                {PALETTES[paletteKey].map((hex) => (
                  <Swatch
                    key={`${paletteKey}-${hex}`}
                    hex={hex}
                    selected={isSwatchSelected(hex, role)}
                    onPick={() => toggleColor(hex, role)}
                  />
                ))}
              </PaletteGroup>
            ))}
          </div>
        </div>

        <div className={`da-preview-panel${sent ? " da-preview-panel-sent" : ""}`}>
          {!sent && (
            <>
              <div className="da-preview-header" id="preview-header">
                <span>Aperçu site</span>
                <span style={{ color: "var(--da-accent)" }}>
                  {selectionCount} choix{selectionCount > 1 ? "s" : ""}
                </span>
              </div>
              <div className="da-preview-body" id="preview-body">
                <LiveSitePreview buckets={fonts} theme={resolvedTheme} />
              </div>
              <div className="da-selection-summary" id="summary">
                <div className="da-summary-title">Synthèse</div>
                <div className="da-summary-chips" id="chips">
                  {summaryItems.map((item) => {
                    const key =
                      item.kind === "font"
                        ? `f-${item.pool}-${item.name}`
                        : item.kind === "color"
                          ? `c-${item.role}-${item.hex}`
                          : `e-${item.hex}`;
                    return (
                      <button type="button" key={key} className="da-chip" title="Retirer" onClick={() => removeItem(item)}>
                        {item.kind === "font" ? (
                          <>
                            <span className="da-chip-role">{POOL_LABELS[item.pool].slice(0, 3)}</span>
                            <span className="da-cname" style={{ fontFamily: fontCss(item.name) }}>
                              {item.name}
                            </span>
                          </>
                        ) : (
                          <>
                            <span
                              className="da-chip-cdot"
                              style={{
                                background: item.hex,
                                border: "1px solid rgba(0,0,0,0.12)",
                              }}
                            />
                            <span className="da-cname">
                              {item.kind === "color"
                                ? `${item.role === "bg" ? "Fond" : item.role === "text" ? "Texte" : item.role === "primary" ? "Princ." : "Second."} ${item.hex}`
                                : item.hex}
                            </span>
                          </>
                        )}
                        <span className="da-chip-rm">×</span>
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  className="da-send-btn"
                  id="send-btn"
                  disabled={summaryItems.length === 0}
                  onClick={sendSelection}
                >
                  Valider ma direction artistique
                </button>
              </div>
            </>
          )}

          <div className={`da-sent-message ${sent ? "show" : ""}`} id="sent-msg">
            <div className="da-sent-icon">✉️</div>
            <div className="da-sent-title">C&apos;est noté</div>
            <div className="da-sent-sub">
              Récapitulatif local (aucun envoi serveur).
              <br />
              Capture d&apos;écran ou copie des codes pour ton cahier des charges.
            </div>
            <div className="da-sent-summary" id="sent-detail">
              <p>Récapitulatif :</p>
              <ul>
                {sentLines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className={`da-toast ${toast ? "show" : ""}`} id="toast" role="status">
        {toast}
      </div>
    </div>
  );
}

type ColorSelections = {
  bg: string | null;
  text: string | null;
  primary: string | null;
  secondary: string | null;
  extras: string[];
};

function applyColorToggle(
  prev: ColorSelections,
  hex: string,
  role: ColorRole,
): { next: ColorSelections; toast: string | null; copyHex: string | null } {
  if (role === "extra") {
    const ex = [...prev.extras];
    const i = ex.indexOf(hex);
    if (i >= 0) {
      ex.splice(i, 1);
      return { next: { ...prev, extras: ex }, toast: null, copyHex: null };
    }
    if (ex.length >= EXTRA_COLOR_MAX) {
      return {
        next: prev,
        toast: `Maximum ${EXTRA_COLOR_MAX} couleurs « touches »`,
        copyHex: null,
      };
    }
    return {
      next: { ...prev, extras: [...ex, hex] },
      toast: `Copié : ${hex.toUpperCase()}`,
      copyHex: hex,
    };
  }
  const r = role as "bg" | "text" | "primary" | "secondary";
  if (prev[r] === hex) {
    return { next: { ...prev, [r]: null }, toast: null, copyHex: null };
  }
  return {
    next: { ...prev, [r]: hex },
    toast: `Copié : ${hex.toUpperCase()}`,
    copyHex: hex,
  };
}

function PaletteGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="da-pal-group">
      <div className="da-cat-label">{label}</div>
      <div className="da-pal-row">{children}</div>
    </div>
  );
}

function Swatch({
  hex,
  selected,
  onPick,
}: {
  hex: string;
  selected: boolean;
  onPick: () => void;
}) {
  return (
    <div className="da-swatch-wrap">
      <button
        type="button"
        className={`da-swatch ${selected ? "selected" : ""}`}
        style={{ background: hex }}
        title={hex}
        onClick={onPick}
        aria-pressed={selected}
      />
      <div className="da-swatch-hex">{hex.toUpperCase()}</div>
    </div>
  );
}
