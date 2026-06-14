import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import SkillsCarousel from "./SkillsCarousel";

export default function Skills() {
  const { t } = useTranslation();

  const STATS = [
    { value: "8+", labelKey: "skills.stat.languages" },
    { value: "10+", labelKey: "skills.stat.frameworks" },
    { value: "5+", labelKey: "skills.stat.databases" },
    { value: "∞", labelKey: "skills.stat.curiosity" },
  ];

  return (
    <motion.section
      id="Skills"
      className="w-full flex flex-col gap-12"
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, type: "spring", stiffness: 75 }}
      viewport={{ once: true, margin: "-8%" }}
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col gap-3">
            <span className="section-label">{t("skills.label")}</span>
            <h2
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-none tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {t("skills.title1")}
              <br />
              <span style={{ color: "var(--color-muted)" }}>{t("skills.title2")}</span>
            </h2>
          </div>

          <motion.p
            className="text-sm max-w-xs leading-relaxed pb-1"
            style={{ color: "var(--color-muted)" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            {t("skills.desc")}
          </motion.p>
        </div>

        {/* ── Stats strip ──────────────────────────────────── */}
        <div
          style={{
            borderTop: "1px solid var(--color-border)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {STATS.map(({ value, labelKey }, i) => (
              <motion.div
                key={labelKey}
                className="flex flex-col gap-1 py-5 px-6"
                style={{
                  borderRight:
                    i < STATS.length - 1
                      ? "1px solid var(--color-border)"
                      : "none",
                }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i, duration: 0.4 }}
                viewport={{ once: true }}
              >
                <span
                  className="text-3xl sm:text-4xl font-bold leading-none"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {value}
                </span>
                <span
                  className="text-xs tracking-widest uppercase"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "var(--color-muted)",
                  }}
                >
                  {t(labelKey)}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3-row full-bleed infinite carousel ─────────────── */}
      <SkillsCarousel />
    </motion.section>
  );
}
