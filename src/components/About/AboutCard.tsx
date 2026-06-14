import { useEffect, useRef, useState } from "react";
import { FaGithub, FaLinkedin, FaDownload, FaChevronDown } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaSquareXTwitter } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { useTranslation } from "react-i18next";
import { useInView } from "framer-motion";

type AboutCardProps = {
  about: string;
  resumeLink: string;
  linkedLink: string;
  GitHubLink: string;
  XLink: string;
  Email: string;
};

const letterVariants = {
  hidden: { opacity: 0, filter: "blur(8px)", y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { delay: i * 0.045, duration: 0.4, ease: "easeOut" },
  }),
};

export default function AboutCard({
  about,
  resumeLink,
  linkedLink,
  GitHubLink,
  XLink,
  Email,
}: AboutCardProps) {
  const viewRef = useRef<HTMLDivElement>(null);
  const inView = useInView(viewRef, { margin: "-10% 0px" });
  const images = ["/1.png", "/2.png", "/3.png", "/4.png", "/5.png"];
  const [image, setImage] = useState(images[0]);
  const { t, i18n } = useTranslation();
  const titles = t("about.titleCycle", { returnObjects: true }) as string[];
  const sequence = titles.flatMap((s, i) => [s, i === 0 ? 2500 : 2000]);

  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => {
      setImage(images[Math.floor(Math.random() * images.length)]);
    }, 3500);
    return () => clearInterval(interval);
  }, [inView]);

  const nameStr = "Mohammed Alajmi";

  const socials = [
    { href: XLink, Icon: FaSquareXTwitter, label: "X / Twitter" },
    { href: GitHubLink, Icon: FaGithub, label: "GitHub" },
    { href: linkedLink, Icon: FaLinkedin, label: "LinkedIn" },
    { href: Email, Icon: MdEmail, label: "Email" },
  ];

  return (
    <section
      id="AboutMe"
      className="relative w-full min-h-screen flex flex-col justify-center items-center overflow-hidden"
    >
      {/* Background grid */}
      <div className="absolute inset-0 hero-grid pointer-events-none" />

      {/* Ambient glow orbs */}
      <div
        className="absolute top-1/4 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "glowPulse 4s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "glowPulse 5s ease-in-out infinite 1s",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 lg:px-16 py-28 flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
        {/* ── Left: Text ─────────────────────────────────── */}
        <div className="flex flex-col gap-7 max-w-2xl w-full">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="section-label">Portfolio — 2025</span>
          </motion.div>

          {/* Name with letter-blur reveal */}
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            initial="hidden"
            animate="visible"
          >
            {nameStr.split("").map((char, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={letterVariants}
                className="inline-block"
                style={{ marginRight: char === " " ? "0.35em" : undefined }}
              >
                {char === " " ? " " : char}
              </motion.span>
            ))}
          </motion.h1>

          {/* Role cycling */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="text-2xl sm:text-3xl font-semibold"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "var(--color-primary)" }}
          >
            <TypeAnimation
              key={i18n.language}
              sequence={sequence}
              wrapper="span"
              cursor={true}
              repeat={Infinity}
            />
          </motion.div>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="text-base sm:text-lg leading-relaxed max-w-xl"
            style={{ color: "var(--color-muted)" }}
          >
            {t(about)}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pt-1"
          >
            <a
              href={resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-semibold tracking-wide"
            >
              <FaDownload size={14} />
              {t("about.download")}
            </a>

            <div className="flex items-center gap-3">
              {socials.map(({ href, Icon, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.18, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 flex items-center justify-center rounded-full transition-all"
                  style={{
                    border: "1px solid var(--color-border)",
                    color: "var(--color-muted)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary)";
                    (e.currentTarget as HTMLElement).style.color = "var(--color-primary)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                    (e.currentTarget as HTMLElement).style.color = "var(--color-muted)";
                  }}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Right: Animated portrait ────────────────────── */}
        <motion.div
          ref={viewRef}
          className="relative flex-shrink-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.55, duration: 0.9, type: "spring", stiffness: 70 }}
        >
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
            {/* Spinning orbit rings */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: "1.5px dashed rgba(99,102,241,0.35)",
                animation: "spin 14s linear infinite",
              }}
            />
            <div
              className="absolute inset-5 rounded-full"
              style={{
                border: "1px solid rgba(34,211,238,0.2)",
                animation: "spin 10s linear infinite reverse",
              }}
            />

            {/* Portrait */}
            <div
              className="absolute inset-10 rounded-full overflow-hidden glow-primary"
              style={{ background: "var(--color-surface-2)" }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={image}
                  src={image}
                  alt="Mohammed Alajmi"
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.55 }}
                />
              </AnimatePresence>
            </div>

            {/* Floating tag: Senior Dev */}
            <motion.div
              className="glass absolute -bottom-3 -left-5 px-4 py-2 rounded-xl text-sm"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span style={{ color: "var(--color-accent)" }}>{"</>"}</span>
              <span className="ml-2 text-app font-medium">Senior Dev</span>
            </motion.div>

            {/* Floating tag: Full Stack */}
            <motion.div
              className="glass absolute -top-3 -right-5 px-4 py-2 rounded-xl text-sm"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            >
              <span style={{ color: "var(--color-gold)" }}>★</span>
              <span className="ml-2 text-app font-medium">Full Stack</span>
            </motion.div>

            {/* Floating tag: Open Source */}
            <motion.div
              className="glass absolute top-1/2 -right-16 px-3 py-1.5 rounded-xl text-xs hidden lg:flex items-center gap-1.5"
              style={{ fontFamily: "'JetBrains Mono', monospace", transform: "translateY(-50%)" }}
              animate={{ x: [0, 6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              <span className="text-app">Available</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.6 }}
      >
        <span className="section-label">scroll</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ color: "var(--color-muted)" }}
        >
          <FaChevronDown size={14} />
        </motion.div>
      </motion.div>
    </section>
  );
}
