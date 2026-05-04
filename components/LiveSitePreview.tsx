"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { fontCss } from "@/lib/explorer-data";
import {
  pickFont,
  resolveFontBuckets,
  uniqueFontsOrdered,
  type FontBuckets,
  type ResolvedTheme,
} from "@/lib/resolve-theme";

const SPECIMEN_FALLBACK = ["Cormorant Garamond", "Outfit"] as const;

type Props = { buckets: FontBuckets; theme: ResolvedTheme };

export function LiveSitePreview({ buckets, theme }: Props) {
  const rf = useMemo(() => resolveFontBuckets(buckets), [buckets]);
  const { headings: H, body: B, accent: A } = buckets;

  const titlePool = useMemo(
    () => (H.length ? H : B.length ? B : A.length ? A : [rf.heading]),
    [H, B, A, rf.heading],
  );
  const bodyPool = useMemo(
    () => (B.length ? B : H.length ? H : A.length ? A : [rf.body]),
    [B, H, A, rf.body],
  );
  const accPool = useMemo(
    () => (A.length ? A : H.length ? H : B.length ? B : [rf.heading]),
    [A, H, B, rf.heading],
  );

  const fh = (i: number) => pickFont(titlePool, i, rf.heading);
  const fb = (i: number) => pickFont(bodyPool, i, rf.body);
  const fa = (i: number) => pickFont(accPool, i, rf.accent);

  const specimen = useMemo(() => {
    const u = uniqueFontsOrdered(buckets);
    return u.length ? u : [...SPECIMEN_FALLBACK];
  }, [buckets]);

  const heroBg = useMemo(() => {
    const e = theme.extras;
    const stops = [
      `${theme.bg} 0%`,
      `${theme.primary}26 38%`,
      `${theme.secondary}35 72%`,
      `${theme.bg} 100%`,
    ];
    if (e.length) {
      stops.splice(2, 0, `${e[0]}40 55%`);
    }
    return `linear-gradient(145deg, ${stops.join(", ")})`;
  }, [theme]);

  const borderSoft = `${theme.text}14`;
  const motionKey = `${specimen.join("|")}-${theme.bg}-${theme.primary}-${theme.secondary}`;

  return (
    <motion.div
      key={motionKey}
      initial={{ opacity: 0.94, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="rounded-2xl border shadow-sm overflow-hidden text-left"
      style={{
        borderColor: borderSoft,
        background: theme.surface,
        color: theme.text,
      }}
    >
      {/* Nav type Site 17 */}
      <nav
        className="sticky top-0 z-10 flex items-center justify-between gap-4 px-4 md:px-8 h-[72px] border-b"
        style={{
          background: theme.surface,
          borderColor: borderSoft,
        }}
      >
        <span
          className="text-[clamp(1.15rem,2.8vw,1.75rem)] font-semibold tracking-tight leading-none"
          style={{ fontFamily: fontCss(fh(0)), color: theme.text }}
        >
          Le Shopayado
        </span>
        <div
          className="hidden sm:flex items-center gap-6 text-[11px] font-bold uppercase tracking-[0.12em]"
          style={{ fontFamily: fontCss(fb(0)), color: theme.text }}
        >
          {["Accueil", "Boutique", "Galerie", "Contact"].map((label, i) => (
            <span key={label} className="opacity-85 hover:opacity-100 cursor-default" style={{ fontFamily: fontCss(fb(i)) }}>
              {label}
            </span>
          ))}
        </div>
      </nav>

      {/* Hero — image simulée + badge (template Site 17) */}
      <header className="px-4 md:px-8 pt-8 md:pt-12 pb-6 max-w-[1100px] mx-auto w-full">
        <div className="relative w-full aspect-[16/10] md:aspect-[1120/520] rounded-[24px] overflow-hidden shadow-inner">
          <div className="absolute inset-0" style={{ background: heroBg }} />
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: `repeating-linear-gradient(-45deg, ${theme.text}, ${theme.text} 1px, transparent 1px, transparent 10px)`,
            }}
          />
          <div className="absolute inset-0 flex items-center justify-end p-4 md:p-8 md:pr-10">
            <div
              className="rounded-xl shadow-md flex flex-col items-center justify-center gap-1.5 px-5 py-4 md:px-7 md:py-6 max-w-[200px]"
              style={{
                background: theme.secondary,
                color: theme.text,
                fontFamily: fontCss(fa(0)),
              }}
            >
              <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.14em] opacity-90">
                Bienvenue
              </span>
              <span className="text-center text-[13px] md:text-[15px] leading-snug font-medium">
                Jeu–Sam 11h–19h
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wide opacity-80">
                Lyon
              </span>
            </div>
          </div>
        </div>
        <p
          className="mt-5 text-[14px] md:text-[16px] leading-[140%] max-w-2xl"
          style={{ fontFamily: fontCss(fb(1)), color: theme.muted }}
        >
          Atelier et galerie — estampes artisanales, jolis dessins. Taxidermiste de chimères. Un aperçu avec{" "}
          <strong style={{ color: theme.text }}>tes couleurs et tes polices</strong>.
        </p>
      </header>

      {/* Section « À propos » */}
      <section
        className="flex flex-col items-center py-10 md:py-14 px-4 md:px-12 gap-6 border-t"
        style={{ borderColor: borderSoft, background: theme.bg }}
      >
        <span
          className="text-[11px] font-bold uppercase tracking-[0.14em]"
          style={{ fontFamily: fontCss(fa(1)), color: theme.muted }}
        >
          À propos
        </span>
        <h2
          className="text-center text-[clamp(1.35rem,3.5vw,2.1rem)] font-bold tracking-[-0.03em] leading-tight max-w-xl"
          style={{ fontFamily: fontCss(fh(1)), color: theme.text }}
        >
          Le Shopayado — atelier &amp; galerie à Lyon
        </h2>
        <p
          className="text-center text-[15px] md:text-[17px] leading-[150%] max-w-xl"
          style={{ fontFamily: fontCss(fb(2)), color: theme.text }}
        >
          Estampes artisanales, sérigraphies, univers singulier entre art et curiosité. Cette maquette réagit à ta direction
          artistive : change les familles et les couleurs à gauche pour projeter ton identité.
        </p>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.1em] text-white shadow-sm transition-opacity hover:opacity-92"
          style={{
            fontFamily: fontCss(fb(3)),
            background: theme.primary,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white/90" aria-hidden />
          Voir la galerie
        </button>
      </section>

      {/* Grille œuvres */}
      <section className="px-4 md:px-8 py-8 border-t" style={{ borderColor: borderSoft, background: theme.surface }}>
        <h3
          className="text-[12px] font-bold uppercase tracking-[0.12em] mb-5"
          style={{ fontFamily: fontCss(fh(2)), color: theme.muted }}
        >
          En boutique
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {[
            { t: "Lune d'encre", p: "38 €" },
            { t: "Sérigraphie n°4", p: "55 €" },
            { t: "Forêt profonde", p: "42 €" },
          ].map((row, i) => (
            <article
              key={row.t}
              className="rounded-xl border overflow-hidden flex flex-col"
              style={{ borderColor: borderSoft, background: theme.bg }}
            >
              <div
                className="aspect-square w-full"
                style={{
                  background: `linear-gradient(160deg, ${theme.primary}35, ${theme.secondary}40)`,
                }}
              />
              <div className="p-3 md:p-4 flex flex-col gap-1">
                <h4
                  className="text-[15px] md:text-[16px] font-semibold leading-tight"
                  style={{ fontFamily: fontCss(fh(3 + i)), color: theme.text }}
                >
                  {row.t}
                </h4>
                <p
                  className="text-[13px] opacity-80"
                  style={{ fontFamily: fontCss(fb(4 + i)), color: theme.primary }}
                >
                  {row.p}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Bandeau : toutes les typos sélectionnées */}
      <section
          className="border-t px-4 md:px-8 py-6 md:py-8"
          style={{ borderColor: borderSoft, background: theme.surface }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-[0.16em] mb-4"
            style={{ fontFamily: fontCss(fb(0)), color: theme.muted }}
          >
            Typographies actives dans cette maquette
          </p>
          <div className="flex flex-col gap-4">
            {specimen.map((name, idx) => (
              <div
                key={name}
                className="rounded-lg px-4 py-3 border flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1"
                style={{ borderColor: borderSoft, background: theme.bg }}
              >
                <span className="text-[10px] uppercase tracking-widest opacity-60" style={{ fontFamily: fontCss(fb(0)) }}>
                  {idx + 1}. {name}
                </span>
                <span
                  className="text-[clamp(1.1rem,2.8vw,1.45rem)] break-words"
                  style={{ fontFamily: fontCss(name) }}
                >
                  Aa Bb Cc 123 — L&apos;art imprimé à la main
                </span>
              </div>
            ))}
          </div>
        </section>

      {/* Pastilles couleurs extras */}
      {theme.extras.length > 0 && (
        <div
          className="flex flex-wrap gap-2 px-4 md:px-8 py-4 border-t justify-center"
          style={{ borderColor: borderSoft, background: theme.bg }}
        >
          {theme.extras.map((hex) => (
            <span
              key={hex}
              className="h-2.5 w-10 rounded-full border border-black/10"
              style={{ background: hex }}
              title={hex}
            />
          ))}
        </div>
      )}

      <footer
        className="px-4 md:px-8 py-5 text-center text-[11px] border-t opacity-80"
        style={{ borderColor: borderSoft, fontFamily: fontCss(fb(5)), color: theme.muted }}
      >
        Aperçu direction artistique · Aucune donnée envoyée
      </footer>
    </motion.div>
  );
}
