"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import styles from "./CardGrid.module.css";

// ─── Spiral path ────────────────────────────────────────────────────────────
// 3-turn Archimedean spiral, r = 5 + 50·(θ_deg / 1080), sampled every 30°.
// viewBox -60 -60 120 120, max r = 55.
const SPIRAL_PATH =
  "M 5,0 L 5.53,3.19 L 3.89,6.74 L 0,9.17 L -5.28,9.14" +
  " L -10.34,5.97 L -13.33,0 L -12.75,-7.36 L -8.06,-13.95" +
  " L 0,-17.5 L 9.45,-16.35 L 17.57,-10.14 L 21.67,0" +
  " L 19.98,11.53 L 12.22,21.17 L 0,25.83 L -13.61,23.58" +
  " L -24.79,14.31 L -30,0 L -27.18,-15.7 L -16.39,-28.39" +
  " L 0,-34.17 L 17.78,-30.8 L 31.99,-18.47 L 38.33,0" +
  " L 34.4,19.86 L 20.56,35.6 L 0,42.5 L -21.95,38.02" +
  " L -39.21,22.64 L -46.67,0 L -41.62,-24.03 L -24.72,-42.82" +
  " L 0,-50.83 L 26.11,-45.22 L 46.43,-26.81 L 55,0";

// ─── Crowd figures ───────────────────────────────────────────────────────────
// 40 figures × 10px slot = 400px/group. Two groups = 800px total.
// CSS translateX(-50%) = −400px → exact seamless loop.
const FIGURE_COUNT = 40;

function Figure() {
  return (
    <svg
      className={styles.figure}
      width="6"
      height="10"
      viewBox="0 0 6 10"
      aria-hidden="true"
    >
      <circle cx="3" cy="2" r="1.5" fill="rgba(255,255,255,0.35)" />
      <rect
        x="1.5"
        y="4"
        width="3"
        height="5.5"
        rx="0.8"
        fill="rgba(255,255,255,0.35)"
      />
    </svg>
  );
}

function FigureGroup() {
  return (
    <>
      {Array.from({ length: FIGURE_COUNT }, (_, i) => (
        <Figure key={i} />
      ))}
    </>
  );
}

// ─── Shared card wrapper ─────────────────────────────────────────────────────
function Card({
  index,
  video,
  bg,
  children,
}: {
  index: number;
  video: string;
  bg: string;
  children: React.ReactNode;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className={styles.card}
      style={{ background: bg }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.15 }}
      onHoverStart={() => {
        setHovered(true);
        videoRef.current?.play().catch(() => {});
      }}
      onHoverEnd={() => {
        setHovered(false);
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }}
    >
      {/* Video overlay — z-5, fades in on hover */}
      <motion.video
        ref={videoRef}
        className={styles.videoOverlay}
        src={video}
        muted
        loop
        playsInline
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      {children}
    </motion.div>
  );
}

// ─── CardGrid ────────────────────────────────────────────────────────────────
export default function CardGrid() {
  return (
    <section className={styles.grid}>

      {/* Card 1 — Recycled Futures */}
      <Card index={0} video="https://d3s90ejqky0l1n.cloudfront.net/iname-art/space.mp4" bg="#0d0d1a">
        <div className={styles.cardContent}>
          <span className={styles.tag} style={{ background: "#8B3FE8" }}>
            Now on view
          </span>
          <div className={styles.cardBottom}>
            <h3 className={styles.title}>Recycled Futures</h3>
            <p
              className={styles.subtitle}
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              Sculpture · Mixed media
            </p>
          </div>
        </div>
      </Card>

      {/* Card 2 — The spiral series */}
      <Card index={1} video="https://d3s90ejqky0l1n.cloudfront.net/iname-art/flower-sky.mp4" bg="#1BBFA0">
        {/* Spiral: wrapper centres it, inner SVG rotates */}
        <div className={styles.spiralWrapper} aria-hidden="true">
          <svg
            className={styles.spiral}
            width="160"
            height="160"
            viewBox="-60 -60 120 120"
            fill="none"
          >
            <path
              d={SPIRAL_PATH}
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className={styles.cardContent}>
          <span
            className={styles.tag}
            style={{ background: "rgba(255,255,255,0.25)" }}
          >
            Signature work
          </span>
          <div className={styles.cardBottom}>
            <h3 className={styles.title}>The spiral series</h3>
          </div>
        </div>
      </Card>

      {/* Card 3 — Where Kigali creates */}
      <Card index={2} video="https://d3s90ejqky0l1n.cloudfront.net/iname-art/surreal-man.mp4" bg="#111111">
        {/* Crowd scrolls across the top */}
        <div className={styles.crowdWrapper} aria-hidden="true">
          <div className={styles.crowdTrack}>
            <FigureGroup />
            <FigureGroup />
          </div>
        </div>
        {/* Content pushed to bottom */}
        <div className={`${styles.cardContent} ${styles.contentEnd}`}>
          <div className={styles.cardBottom}>
            <span className={styles.tag} style={{ background: "#E8402A" }}>
              Community
            </span>
            <h3 className={styles.title}>Where Kigali creates</h3>
            <p
              className={styles.subtitle}
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              Every Friday · Free entry
            </p>
          </div>
        </div>
      </Card>

    </section>
  );
}
