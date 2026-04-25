"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./Footer.module.css";

// ─── Filmstrip ────────────────────────────────────────────────────────────────
// No artwork images in /public/artwork/, so using brand-palette placeholders.

const FILMSTRIP_ITEMS = [
  { color: "#1BBFA0", width: 200 },
  { color: "#8B3FE8", width: 160 },
  { color: "#E8402A", width: 220 },
  { color: "#F5A623", width: 180 },
  { color: "#f5f0eb", width: 200 },
  { color: "#0d0d1a", width: 240 },
  { color: "#1BBFA0", width: 175 },
  { color: "#8B3FE8", width: 195 },
] as const;

function FilmstripGroup() {
  return (
    <>
      {FILMSTRIP_ITEMS.map((item, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            flexShrink: 0,
            height: 120,
            width: item.width,
            borderRadius: 8,
            background: item.color,
            marginRight: 12,
          }}
        />
      ))}
    </>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_LINKS = ["Exhibitions", "Artists", "Workshops", "Residency", "Shop", "Visit"] as const;
const SOCIAL    = ["Instagram", "Facebook"] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function Footer() {
  const [watermarkHovered, setWatermarkHovered] = useState(false);

  return (
    <footer>

      {/* ── 1. Artwork filmstrip ─────────────────────────────────────────── */}
      <div className={styles.filmstripWrapper} aria-hidden="true">
        <div className={styles.filmstripTrack}>
          <FilmstripGroup />
          <FilmstripGroup />
        </div>
      </div>

      {/* ── 2. Main footer body ──────────────────────────────────────────── */}
      <div style={{ background: "#111111", padding: "48px 40px 32px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            gap: 40,
          }}
        >

          {/* Left — brand + address */}
          <div>
            <p
              className="font-playfair"
              style={{ fontSize: 20, color: "#ffffff", fontWeight: 400, margin: "0 0 16px" }}
            >
              Inema Arts Centre
            </p>
            <p
              className="font-inter"
              style={{ fontSize: 11, fontWeight: 300, color: "rgba(255,255,255,0.4)", lineHeight: 1.8, margin: "0 0 12px" }}
            >
              Inema — a gift, a talent, to give and to receive.
            </p>
            <p
              className="font-inter"
              style={{ fontSize: 11, fontWeight: 300, color: "rgba(255,255,255,0.4)", lineHeight: 1.8, margin: "0 0 4px" }}
            >
              KG 14 Ave, Kacyiru, Kigali, Rwanda
            </p>
            <p
              className="font-inter"
              style={{ fontSize: 11, fontWeight: 300, color: "rgba(255,255,255,0.4)", lineHeight: 1.8, margin: 0 }}
            >
              Open daily 9am – 6pm
            </p>
          </div>

          {/* Center — nav links */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {NAV_LINKS.map(label => (
              <a
                key={label}
                href="#"
                className={`font-inter ${styles.navLink}`}
                style={{ fontSize: 11, fontWeight: 300, letterSpacing: "0.12em", textTransform: "uppercase" }}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Right — social + resident indicator */}
          <div>
            <p
              className="font-inter"
              style={{ fontSize: 11, fontWeight: 300, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", margin: "0 0 14px" }}
            >
              Follow the work
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
              {SOCIAL.map(platform => (
                <a
                  key={platform}
                  href="#"
                  className={`font-inter ${styles.navLink}`}
                  style={{ fontSize: 11, fontWeight: 300, letterSpacing: "0.12em", textTransform: "uppercase" }}
                >
                  {platform}
                </a>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className={styles.pulse} />
              <span
                className="font-inter"
                style={{ fontSize: 11, fontWeight: 300, color: "rgba(255,255,255,0.6)" }}
              >
                12 artists in residence
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ── 3. Bottom bar ────────────────────────────────────────────────── */}
      <div
        style={{
          background: "#111111",
          borderTop: "0.5px solid rgba(255,255,255,0.08)",
          padding: "16px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          className="font-inter"
          style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}
        >
          © 2026 Inema Arts Centre
        </span>

        {/* INEMA watermark — layout animation reveals Kinyarwanda on hover */}
        <motion.span
          layout="size"
          onHoverStart={() => setWatermarkHovered(true)}
          onHoverEnd={() => setWatermarkHovered(false)}
          animate={{
            color: watermarkHovered ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)",
          }}
          transition={{
            layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
            color:  { duration: 0.2 },
          }}
          className="font-playfair"
          style={{
            display: "inline-block",
            overflow: "hidden",
            whiteSpace: "nowrap",
            fontSize: 11,
            letterSpacing: "0.25em",
            cursor: "default",
            userSelect: "none",
          }}
        >
          {watermarkHovered
            ? "I·N·E·M·A — ikiringo, impano, guha no guhabwa"
            : "INEMA"}
        </motion.span>

        <span
          className="font-inter"
          style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}
        >
          Designed with love in Kigali
        </span>
      </div>

    </footer>
  );
}
