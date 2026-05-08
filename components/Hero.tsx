"use client";

import { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useTransform,
  useScroll,
  useSpring,
} from "framer-motion";

// ─── Particle canvas ──────────────────────────────────────────────────────────

const COLORS = ["#1BBFA0", "#8B3FE8", "#E8402A", "#F5A623"] as const;
const COUNT = 60;

type Particle = {
  x: number; y: number;
  vx: number; vy: number;
  r: number; color: string; opacity: number;
};

function makeParticles(w: number, h: number): Particle[] {
  return Array.from({ length: COUNT }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: 1 + Math.random() * 2,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    opacity: 0.06 + Math.random() * 0.12,
  }));
}

// ─── Background artwork tile canvas ──────────────────────────────────────────
// Same baroque/renaissance images as CanvasSection, drawn tiny + very faint
// with mix-blend-mode: soft-light so they feel embedded in the bg photo.

const ARTWORK_URLS = [
  "https://images.unsplash.com/flagged/photo-1572392640988-ba48d1a74457?w=800&q=80",
  "https://images.unsplash.com/photo-1599894019794-50339c9ad89c?w=800&q=80",
  "https://images.unsplash.com/photo-1602422701241-7ba4f6fc1712?w=800&q=80",
  "https://images.unsplash.com/photo-1556005693-00fff02f134c?w=800&q=80",
  "https://images.unsplash.com/photo-1581593439309-14b03e56b40d?w=800&q=80",
  "https://images.unsplash.com/photo-1694123598708-312a31dcfbc9?w=800&q=80",
];

const BG_TILE_COUNT = 12;
const BG_TILE_MIN   = 35;
const BG_TILE_MAX   = 80;
const BG_TILE_SPEED = 0.12;

type BgTile = {
  img: HTMLImageElement;
  sx: number; sy: number; sw: number; sh: number;
  size: number;
  x: number; y: number;
  vx: number; vy: number;
  rotation: number; rotSpeed: number;
  opacity: number;
};

function makeBgTiles(images: HTMLImageElement[], w: number, h: number): BgTile[] {
  if (!images.length) return [];
  return Array.from({ length: BG_TILE_COUNT }, () => {
    const img = images[Math.floor(Math.random() * images.length)];
    const sw = img.naturalWidth  * (0.25 + Math.random() * 0.35);
    const sh = img.naturalHeight * (0.25 + Math.random() * 0.35);
    return {
      img,
      sx: Math.random() * (img.naturalWidth  - sw),
      sy: Math.random() * (img.naturalHeight - sh),
      sw, sh,
      size:     BG_TILE_MIN + Math.random() * (BG_TILE_MAX - BG_TILE_MIN),
      x:        Math.random() * w,
      y:        Math.random() * h,
      vx:       (Math.random() - 0.5) * BG_TILE_SPEED,
      vy:       (Math.random() - 0.5) * BG_TILE_SPEED,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.004,
      opacity:  0.10 + Math.random() * 0.12,
    };
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  // Particle canvas
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const particlesRef  = useRef<Particle[]>([]);

  // Background artwork tile canvas
  const bgCanvasRef  = useRef<HTMLCanvasElement>(null);
  const bgImagesRef  = useRef<HTMLImageElement[]>([]);
  const bgTilesRef   = useRef<BgTile[]>([]);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Title exit on scroll
  const titleOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const titleY       = useTransform(scrollYProgress, [0, 0.5], [0, -40]);

  // Scroll parallax per layer
  const bgScrollY  = useTransform(scrollYProgress, [0, 1], [0,  30]);
  const midScrollY = useTransform(scrollYProgress, [0, 1], [0,  90]);
  const fgScrollY  = useTransform(scrollYProgress, [0, 1], [0, 160]);

  // Shared spring-smoothed mouse (normalised −1 → 1)
  const rawX   = useMotionValue(0);
  const rawY   = useMotionValue(0);
  const smoothX = useSpring(rawX, { stiffness: 80, damping: 20 });
  const smoothY = useSpring(rawY, { stiffness: 80, damping: 20 });

  // Per-layer mouse offsets (0.02 : 0.06 : 0.12 ratio)
  const bgMouseX  = useTransform(smoothX, [-1, 1], [ -2,  2]);
  const bgMouseY  = useTransform(smoothY, [-1, 1], [ -2,  2]);
  const midMouseX = useTransform(smoothX, [-1, 1], [ -6,  6]);
  const midMouseY = useTransform(smoothY, [-1, 1], [ -6,  6]);
  const fgRotateY = useTransform(smoothX, [-1, 1], [-1.5, 1.5]);
  const fgRotateX = useTransform(smoothY, [-1, 1], [ 1.5, -1.5]);
  const fgMouseX  = useTransform(smoothX, [-1, 1], [-12, 12]);
  const fgMouseY  = useTransform(smoothY, [-1, 1], [-12, 12]);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const r = heroRef.current?.getBoundingClientRect();
      if (!r) return;
      rawX.set((e.clientX - r.left  - r.width  / 2) / (r.width  / 2));
      rawY.set((e.clientY - r.top   - r.height / 2) / (r.height / 2));
    },
    [rawX, rawY]
  );

  const onMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  // Load baroque painting images for the bg tile canvas
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      ARTWORK_URLS.map(src =>
        new Promise<HTMLImageElement>(resolve => {
          const img = new window.Image();
          img.crossOrigin = "anonymous";
          img.onload  = () => resolve(img);
          img.onerror = () => resolve(img);
          img.src = src;
        })
      )
    ).then(imgs => {
      if (cancelled) return;
      bgImagesRef.current = imgs.filter(i => i.complete && i.naturalWidth > 0);
      const canvas = bgCanvasRef.current;
      if (canvas) bgTilesRef.current = makeBgTiles(bgImagesRef.current, canvas.width, canvas.height);
    });
    return () => { cancelled = true; };
  }, []);

  // Background artwork tile canvas — slow drift, very low opacity, soft-light blend
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      if (bgImagesRef.current.length) {
        bgTilesRef.current = makeBgTiles(bgImagesRef.current, canvas.width, canvas.height);
      }
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf: number;
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const t of bgTilesRef.current) {
        t.x        += t.vx;
        t.y        += t.vy;
        t.rotation += t.rotSpeed;

        const pad = t.size;
        if      (t.x < -pad)                 t.x = canvas.width  + pad;
        else if (t.x > canvas.width  + pad)  t.x = -pad;
        if      (t.y < -pad)                 t.y = canvas.height + pad;
        else if (t.y > canvas.height + pad)  t.y = -pad;

        ctx.save();
        ctx.translate(t.x, t.y);
        ctx.rotate(t.rotation);
        ctx.globalAlpha = t.opacity;
        ctx.drawImage(t.img, t.sx, t.sy, t.sw, t.sh, -t.size / 2, -t.size / 2, t.size, t.size);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      particlesRef.current = makeParticles(canvas.width, canvas.height);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf: number;
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < p.r)                      { p.x = p.r;                   p.vx *= -1; }
        else if (p.x > canvas.width  - p.r) { p.x = canvas.width  - p.r;  p.vx *= -1; }
        if (p.y < p.r)                      { p.y = p.r;                   p.vy *= -1; }
        else if (p.y > canvas.height - p.r) { p.y = canvas.height - p.r;  p.vy *= -1; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle   = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative h-screen bg-white overflow-hidden"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >

      {/* ── Layer 1: Background — z-0 ────────────────────────────────────────
            Oversized by 40px on each side so mouse + scroll shift never
            reveal a white edge gap.                                          */}
      <motion.div
        className="absolute -top-10 -right-10 -bottom-10 -left-10 z-0"
        style={{ y: bgScrollY }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ x: bgMouseX, y: bgMouseY }}
        >
          <Image
            src="https://d3s90ejqky0l1n.cloudfront.net/iname-art/inema-bg.avif"
            alt=""
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
          />
          {/* Artwork tile canvas — tiny fragments, soft-light blend, barely visible */}
          <canvas
            ref={bgCanvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ mixBlendMode: "soft-light" }}
          />
        </motion.div>
      </motion.div>

      {/* ── Layer 1.5: Particle canvas — z-[1] ───────────────────────────── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />

      {/* ── Layer 2: Middle (trees + clouds) — z-[2] ─────────────────────── */}
      <motion.div
        className="absolute inset-0 z-[2]"
        style={{ y: midScrollY }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ x: midMouseX, y: midMouseY }}
        >
          {/* Banana tree 1 — bottom-left, slightly off-screen */}
          <div className="absolute bottom-0 -left-16 h-[70vh] pointer-events-none select-none">
            <Image
              src="https://d3s90ejqky0l1n.cloudfront.net/iname-art/banana-tree-1.png"
              alt=""
              width={0}
              height={0}
              sizes="35vw"
              className="h-full w-auto"
            />
          </div>

          {/* Banana tree 2 — bottom-right, partially behind portrait */}
          <div className="absolute bottom-0 right-[15%] h-[60vh] pointer-events-none select-none">
            <Image
              src="https://d3s90ejqky0l1n.cloudfront.net/iname-art/banana-tree-2.png"
              alt=""
              width={0}
              height={0}
              sizes="30vw"
              className="h-full w-auto"
            />
          </div>

          {/* Cloud 1 — top-left, 15% from top · 18s drift */}
          <motion.div
            className="absolute pointer-events-none select-none"
            style={{ top: "-4%", left: "-5%" }}
            animate={{ x: [0, 14, 0] }}
            transition={{ duration: 18, ease: "easeInOut", repeat: Infinity }}
          >
            <Image
              src="https://d3s90ejqky0l1n.cloudfront.net/iname-art/cloud-1.png"
              alt=""
              width={0}
              height={0}
              sizes="30vw"
              className="h-80 w-auto"
            />
          </motion.div>

          {/* Cloud 2 — top-center-right, 8% from top · 24s drift */}
          <motion.div
            className="absolute pointer-events-none select-none"
            style={{ top: "-8%", left: "52%" }}
            animate={{ x: [0, -10, 0] }}
            transition={{ duration: 24, ease: "easeInOut", repeat: Infinity }}
          >
            <Image
              src="https://d3s90ejqky0l1n.cloudfront.net/iname-art/cloud-2.png"
              alt=""
              width={0}
              height={0}
              sizes="30vw"
              className="h-72 w-auto"
            />
          </motion.div>

          {/* Cloud 3 — mid-right, 25% from top · 30s drift */}
          <motion.div
            className="absolute pointer-events-none select-none"
            style={{ top: "8%", right: "-4%" }}
            animate={{ x: [0, 18, 0] }}
            transition={{ duration: 30, ease: "easeInOut", repeat: Infinity }}
          >
            <Image
              src="https://d3s90ejqky0l1n.cloudfront.net/iname-art/cloud-3.png"
              alt=""
              width={0}
              height={0}
              sizes="25vw"
              className="h-64 w-auto"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── Text — z-10 ───────────────────────────────────────────────────── */}
      <div className="absolute inset-0 flex items-center md:justify-end z-10 pointer-events-none">
        <motion.div
          className="pl-6 pr-6 md:pl-0 md:pr-16 max-w-xl pointer-events-auto"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          <h1
            className="font-playfair text-[#111111] mb-7 text-[40px] md:text-[64px]"
            style={{ lineHeight: 0.97, fontWeight: 400, textShadow: "0 2px 20px rgba(255,255,255,0.8)" }}
          >
            Art that{" "}
            <em style={{ color: "#1BBFA0", fontStyle: "italic" }}>moves</em>{" "}
            you.
          </h1>

          <p
            className="font-inter uppercase text-[#bbbbbb] mb-5"
            style={{ fontSize: 11, fontWeight: 300, letterSpacing: "0.14em", textShadow: "0 1px 8px rgba(255,255,255,0.9)" }}
          >
            Kigali, Rwanda · Est. 2009
          </p>

          <a
            href="#"
            className="font-inter uppercase text-[#111111]"
            style={{
              fontSize: 11,
              fontWeight: 400,
              letterSpacing: "0.13em",
              textDecoration: "none",
              background: "rgba(255,255,255,0.6)",
              borderRadius: 20,
              padding: "6px 14px",
              display: "inline-block",
            }}
          >
            Explore the collection ↗
          </a>
        </motion.div>
      </div>

      {/* ── Layer 3: Portrait (foreground) — z-[5] ────────────────────────── */}
      <motion.div
        className="hidden md:block absolute left-0 -bottom-3 z-[5] h-[95vh]"
        style={{ y: fgScrollY }}
      >
        <motion.div
          className="h-full"
          style={{
            rotateX: fgRotateX,
            rotateY: fgRotateY,
            x: fgMouseX,
            y: fgMouseY,
            transformPerspective: 800,
          }}
        >
          <div className="h-full">
            <Image
              src="https://d3s90ejqky0l1n.cloudfront.net/iname-art/blue-shirt-2.avif"
              alt="Inema Arts Centre"
              width={0}
              height={0}
              sizes="50vw"
              className="h-full w-auto"
              style={{ mixBlendMode: "multiply", display: "block" }}
              priority
            />
          </div>
        </motion.div>
      </motion.div>

    </section>
  );
}
