import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";
import { fetchExperiences, type Locale, type Experience } from "../../lib/supabase";

const PAGE_SIZE = 3;

function formatDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
    year: "numeric",
    month: "short",
  });
}

function CompanyLogo({ name, logo_url }: { name: string; logo_url: string | null }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (logo_url) {
    return (
      <img
        src={logo_url}
        alt={name}
        className="w-12 h-12 rounded-xl object-contain flex-shrink-0"
        style={{ background: "var(--color-surface-2)", padding: "6px" }}
        onError={(e) => {
          const img = e.currentTarget as HTMLImageElement;
          img.style.display = "none";
          const fallback = img.nextElementSibling as HTMLElement | null;
          if (fallback) fallback.style.display = "flex";
        }}
      />
    );
  }

  return (
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm"
      style={{
        background: "var(--color-surface-2)",
        border: "1px solid var(--color-border)",
        color: "var(--color-accent)",
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {initials}
    </div>
  );
}

function ExperienceCard({ exp, index, locale }: { exp: Experience; index: number; locale: string }) {
  const { t } = useTranslation();

  return (
    <motion.div
      className="relative flex gap-5 sm:gap-8"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.45, delay: index * 0.07, type: "spring", stiffness: 90 }}
    >
      {/* Timeline column */}
      <div className="flex flex-col items-center flex-shrink-0" style={{ width: "48px" }}>
        <CompanyLogo name={exp.company_name} logo_url={exp.company_logo_url} />
        <div
          className="flex-1 w-px mt-3"
          style={{ background: "var(--color-border)", minHeight: "32px" }}
        />
      </div>

      {/* Card */}
      <div
        className="flex-1 pb-10 rounded-2xl p-5 mb-2"
        style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
      >
        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className="text-base font-semibold"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {exp.role}
              </h3>
              {exp.is_current && (
                <span
                  className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    color: "var(--color-text)",
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: "0.06em",
                  }}
                >
                  {t("experience.current")}
                </span>
              )}
            </div>
            <p className="text-sm mt-0.5" style={{ color: "var(--color-accent)", fontWeight: 500 }}>
              {exp.company_name}
            </p>
          </div>

          <div
            className="text-right flex flex-col gap-0.5"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.7rem",
              color: "var(--color-muted)",
              letterSpacing: "0.04em",
            }}
          >
            <span>
              {formatDate(exp.start_date, locale)} —{" "}
              {exp.end_date ? formatDate(exp.end_date, locale) : t("experience.present")}
            </span>
            {exp.location && <span>{exp.location}</span>}
          </div>
        </div>

        {exp.description && (
          <p className="text-sm leading-relaxed mt-3" style={{ color: "var(--color-muted)" }}>
            {exp.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function ExperienceSection() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === "ar" ? "ar" : "en") as Locale;
  const [visible, setVisible] = useState(PAGE_SIZE);

  const { data: experiences = [], isLoading } = useQuery<Experience[]>({
    queryKey: ["experiences", locale],
    queryFn: () => fetchExperiences(locale),
    staleTime: 1000 * 60 * 5,
  });

  const shown = experiences.slice(0, visible);
  const hasMore = visible < experiences.length;

  return (
    <motion.section
      id="experience"
      className="w-full flex flex-col gap-10"
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, type: "spring", stiffness: 75 }}
      viewport={{ once: true, margin: "-8%" }}
    >
      {/* Header */}
      <div className="text-center flex flex-col gap-3">
        <span className="section-label block">{t("experience.label")}</span>
        <h2
          className="text-4xl sm:text-5xl font-bold"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {t("experience.title")}
        </h2>
        <p className="text-base max-w-md mx-auto mt-1" style={{ color: "var(--color-muted)" }}>
          {t("experience.subtitle")}
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div
            className="w-9 h-9 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "var(--color-muted)" }}
          />
        </div>
      ) : experiences.length === 0 ? (
        <p
          className="text-center text-sm"
          style={{
            color: "var(--color-muted)",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.08em",
          }}
        >
          — {t("experience.empty")} —
        </p>
      ) : (
        <div className="flex flex-col gap-4 max-w-3xl mx-auto w-full">
          {/* Timeline entries */}
          <AnimatePresence mode="popLayout">
            {shown.map((exp, i) => (
              <ExperienceCard key={exp.id} exp={exp} index={i} locale={locale} />
            ))}
          </AnimatePresence>

          {/* Load More */}
          <AnimatePresence>
            {hasMore && (
              <motion.div
                className="flex flex-col items-center gap-3 pt-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25 }}
              >
                <p
                  className="text-xs"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "var(--color-muted)",
                    letterSpacing: "0.08em",
                  }}
                >
                  {shown.length} / {experiences.length}
                </p>
                <button
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="flex items-center gap-2.5 px-7 py-3 rounded-full text-sm font-semibold transition-all"
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
                  {t("experience.loadMore")}
                  <motion.span
                    animate={{ y: [0, 3, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <FaChevronDown size={12} style={{ color: "var(--color-muted)" }} />
                  </motion.span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* All loaded */}
          {!hasMore && experiences.length > PAGE_SIZE && (
            <motion.p
              className="text-center text-xs pt-2"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: "var(--color-muted)",
                letterSpacing: "0.12em",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              — ALL {experiences.length} ENTRIES LOADED —
            </motion.p>
          )}
        </div>
      )}
    </motion.section>
  );
}
