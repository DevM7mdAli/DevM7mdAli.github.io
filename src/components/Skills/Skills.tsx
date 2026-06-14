import { motion } from "framer-motion";
import SkillsCarousel from "./SkillsCarousel";

const STATS = [
  { value: "8+", label: "Languages" },
  { value: "10+", label: "Frameworks" },
  { value: "5+", label: "Databases" },
  { value: "∞", label: "Curiosity" },
];

export default function Skills() {
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
            <span className="section-label">My Arsenal</span>
            <h2
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-none tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              My Skills Have
              <br />
              <span style={{ color: "var(--color-muted)" }}>No Limit.</span>
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
            From pixel-perfect interfaces to battle-tested APIs — I engineer
            across the entire stack with zero compromise.
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
            {STATS.map(({ value, label }, i) => (
              <motion.div
                key={label}
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
                  {label}
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
