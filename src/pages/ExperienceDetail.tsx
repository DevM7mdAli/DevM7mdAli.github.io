import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  fetchExperienceBySlug,
  fetchProjectsByExperience,
  type Locale,
} from "../lib/supabase";
import { formatDateRange } from "../utils/date";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import PageShell, { PageSpinner } from "../components/PageShell";
import CompanyLogo from "../components/Experience/CompanyLogo";
import ProjectGrid from "../components/projects/ProjectGrid";
import Error404 from "../components/Error";

export default function ExperienceDetail() {
  const { slug = "" } = useParams();
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === "ar" ? "ar" : "en") as Locale;

  const { data: exp, isLoading } = useQuery({
    queryKey: ["experience", slug, locale],
    queryFn: () => fetchExperienceBySlug(slug, locale),
    enabled: !!slug,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["experience-projects", exp?.id, locale],
    queryFn: () => fetchProjectsByExperience(exp!.id, locale),
    enabled: !!exp?.id,
  });

  useDocumentMeta({
    title: exp ? `${exp.role} · ${exp.company_name}` : undefined,
    description: exp?.description ?? undefined,
    canonicalPath: exp ? `/experience/${exp.slug}` : undefined,
    image: exp?.company_logo_url,
  });

  if (isLoading) {
    return (
      <PageShell backTo="/experience" backLabel={t("experience.backToList")}>
        <PageSpinner />
      </PageShell>
    );
  }

  // An unknown slug is a genuine 404, not an empty page.
  if (!exp) return <Error404 />;

  return (
    <PageShell backTo="/experience" backLabel={t("experience.backToList")}>
      <motion.header
        className="flex flex-col gap-5"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-5">
          <CompanyLogo name={exp.company_name} logo_url={exp.company_logo_url} size={64} />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1
                className="text-3xl sm:text-4xl font-bold tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {exp.role}
              </h1>
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
            <p className="text-base" style={{ color: "var(--color-accent)", fontWeight: 500 }}>
              {exp.company_name}
            </p>
          </div>
        </div>

        <div
          className="flex flex-wrap gap-x-5 gap-y-1 pb-6"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.72rem",
            color: "var(--color-muted)",
            letterSpacing: "0.04em",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <span>
            {formatDateRange(exp.start_date, exp.end_date, locale, t("experience.present"))}
          </span>
          {exp.location && <span>{exp.location}</span>}
        </div>
      </motion.header>

      {exp.description && (
        <p className="text-base leading-relaxed max-w-2xl" style={{ color: "var(--color-muted)" }}>
          {exp.description}
        </p>
      )}

      {/* The payoff of the FK: what was actually built during this role. */}
      {projects.length > 0 && (
        <section className="flex flex-col gap-6 pt-4">
          <div className="flex flex-col gap-2">
            <span className="section-label">{t("experience.projectsLabel")}</span>
            <h2
              className="text-2xl font-bold tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {t("experience.projectsHeading", { company: exp.company_name })}
            </h2>
          </div>
          <ProjectGrid projects={projects} />
        </section>
      )}
    </PageShell>
  );
}
