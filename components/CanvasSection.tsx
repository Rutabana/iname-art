"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import styles from "./CanvasSection.module.css";

export default function CanvasSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.section
      className={styles.grid}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >

      {/* Left box — video card */}
      <motion.div
        className={styles.left}
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
        <motion.video
          ref={videoRef}
          className={styles.videoOverlay}
          src="https://d3s90ejqky0l1n.cloudfront.net/balcony.mp4"
          muted
          loop
          playsInline
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />
        <div className={styles.leftContent}>
          <span className={styles.tag} style={{ background: "#1BBFA0" }}>
            Studio
          </span>
          <p className={styles.label}>Fragments in motion</p>
        </div>
      </motion.div>

      {/* Right box — quote + CTA */}
      <div className={styles.right}>

        {/* CSS floating shapes behind the text */}
        <div className={styles.shapes} aria-hidden="true">
          <div className={`${styles.shape} ${styles.s1}`} />
          <div className={`${styles.shape} ${styles.s2}`} />
          <div className={`${styles.shape} ${styles.s3}`} />
          <div className={`${styles.shape} ${styles.s4}`} />
          <div className={`${styles.shape} ${styles.s5}`} />
          <div className={`${styles.shape} ${styles.s6}`} />
          <div className={`${styles.shape} ${styles.s7}`} />
          <div className={`${styles.shape} ${styles.s8}`} />
        </div>

        <div className={styles.content}>
          <motion.p
            className={styles.quote}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          >
            Art belongs to{" "}
            <em className={styles.quoteAccent}>everyone.</em>
          </motion.p>

          <motion.div
            className={styles.ctaGroup}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          >
            <p className={styles.ctaLabel}>Applications open</p>
            <a href="#" className={styles.ctaButton}>
              Apply now ↗
            </a>
          </motion.div>
        </div>

      </div>
    </motion.section>
  );
}
