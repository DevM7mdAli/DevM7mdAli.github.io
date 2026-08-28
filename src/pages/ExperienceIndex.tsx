import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaChevronRight } from "react-icons/fa";
import { fetchExperiences, type Experience, type Locale } from "../lib/supabase";
import { formatDateRange } from "../utils/date";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import PageShell, { PageSpinner } from "../components/PageShell";
import CompanyLogo from "../components/Experience/CompanyLogo";

export default function ExperienceIndex() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === "ar" ? "ar" : "en") as Locale;
  const isRtl = i18n.language === "ar";

  useDocumentMeta({
    title: t("experience.pageTitle"),
    description: t("experience.subtitle"),
    canonicalPath: "/experience",
  });

  const { data: experiences = [], isLoading } = useQuery<Experience[]>({
    queryKey: ["experiences", locale],
    queryFn: () => fetchExperiences(locale),
    staleTime: 1000 * 60 * 5,
  });

  return (
    <PageShell backTo="/" backLabel={t("common.backHome")}>
      <div className="flex flex-col gap-3">
        <span className="section-label">{t("experience.label")}</span>
        <h1
          className="text-4xl sm:text-5xl font-bold tracking-tight"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {t("experience.pageTitle")}
        </h1>
        <p className="text-base max-w-xl" style={{ color: "var(--color-muted)" }}>
          {t("experience.subtitle")}
        </p>
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : experiences.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--color-muted)" }}>
          {t("experience.empty")}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <Link
                to={`/experience/${exp.slug}`}
                className="flex items-center gap-5 rounded-2xl p-5 transition-all"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                }}
              >
                <CompanyLogo name={exp.company_name} logo_url={exp.company_logo_url} />

                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2
                      className="text-base font-semibold"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {exp.role}
                    </h2>
                    {exp.is_current && (
                      <span
                        className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid var(--color-border)",
                          color: "var(--color-text)",
                          fontFamily: "'JetBrains Mono', monospace",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {t("experience.current")}
                      </span>
                    )}
                  </div>
                  <p className="text-sm" style={{ color: "var(--color-accent)", fontWeight: 500 }}>
                    {exp.company_name}
                  </p>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.7rem",
                      color: "var(--color-muted)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {formatDateRange(exp.start_date, exp.end_date, locale, t("experience.present"))}
                    {exp.location ? ` · ${exp.location}` : ""}
                  </span>
                </div>

                <FaChevronRight
                  size={12}
                  style={{
                    color: "var(--color-muted)",
                    flexShrink: 0,
                    transform: isRtl ? "scaleX(-1)" : undefined,
                  }}
                />
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </PageShell>
  );
}
