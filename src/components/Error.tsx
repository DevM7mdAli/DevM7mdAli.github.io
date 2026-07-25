import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Error404() {
  const { t } = useTranslation();
  const location = useLocation();
  const path = location.pathname + location.search + location.hash;

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24 text-center"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <div className="absolute inset-0 hero-grid pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 70 }}
        className="relative flex w-full max-w-lg flex-col items-center gap-6"
      >
        <span className="section-label">{t("error.eyebrow")}</span>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, type: "spring", stiffness: 60 }}
          className="glow-primary select-none leading-none"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(5rem, 18vw, 9rem)",
            fontWeight: 700,
            color: "var(--color-primary)",
          }}
        >
          404
        </motion.h1>

        <div>
          <h2
            className="text-2xl sm:text-3xl font-semibold"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {t("error.title")}
          </h2>
          <p className="mt-2 text-sm sm:text-base" style={{ color: "var(--color-muted)" }}>
            {t("error.subtitle")}
          </p>
        </div>

        <motion.div
          dir="ltr"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-full rounded-xl px-5 py-4 text-left"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.78rem",
          }}
        >
          <p style={{ color: "var(--color-muted)" }} className="break-all">
            <span style={{ color: "var(--color-accent)" }}>$</span> curl{" "}
            {typeof window !== "undefined" ? window.location.origin : ""}
            {path}
          </p>
          <p className="mt-1.5" style={{ color: "#ef4444" }}>
            {t("error.notFound")}
          </p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold transition-all"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary)";
              (e.currentTarget as HTMLElement).style.background = "var(--color-surface-2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
              (e.currentTarget as HTMLElement).style.background = "var(--color-surface)";
            }}
          >
            {t("error.cta")}
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
