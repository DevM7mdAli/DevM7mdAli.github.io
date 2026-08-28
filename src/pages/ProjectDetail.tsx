import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaExternalLinkAlt, FaGithub, FaBriefcase, FaChevronRight } from "react-icons/fa";
import { MdImageNotSupported } from "react-icons/md";
import { fetchProjectBySlug, type Locale } from "../lib/supabase";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import PageShell, { PageSpinner } from "../components/PageShell";
import Error404 from "../components/Error";
import SkillChips from "../components/projects/SkillChips";

export default function ProjectDetail() {
  const { slug = "" } = useParams();
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === "ar" ? "ar" : "en") as Locale;
  const isRtl = i18n.language === "ar";
  const [imgFailed, setImgFailed] = useState(false);

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", slug, locale],
    queryFn: () => fetchProjectBySlug(slug, locale),
    enabled: !!slug,
  });

  useDocumentMeta({
    title: project?.title,
    description: project?.description,
    canonicalPath: project ? `/projects/${project.slug}` : undefined,
    image: project?.image_url,
  });

  if (isLoading) {
    return (
      <PageShell backTo="/projects" backLabel={t("projects.backToList")}>
        <PageSpinner />
      </PageShell>
    );
  }

  if (!project) return <Error404 />;

  return (
    <PageShell backTo="/projects" backLabel={t("projects.backToList")}>
      <motion.div
        className="flex flex-col gap-8"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <header className="flex flex-col gap-4">
          {project.category && (
            <span className="section-label">{project.category.name}</span>
          )}
          <h1
            className="text-4xl sm:text-5xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {project.title}
          </h1>

          {/* Back-link into the role this was built during. Absent for
              personal projects, which is the normal case. */}
          {project.associated_work && (
            <Link
              to={`/experience/${project.associated_work.slug}`}
              className="flex items-center gap-2 text-sm w-fit transition-colors"
              style={{ color: "var(--color-muted)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-accent)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-muted)")}
            >
              <FaBriefcase size={11} />
              <span>
                {t("projects.builtAt", {
                  role: project.associated_work.role,
                  company: project.associated_work.company_name,
                })}
              </span>
              <FaChevronRight size={9} style={{ transform: isRtl ? "scaleX(-1)" : undefined }} />
            </Link>
          )}
        </header>

        {/* Cover */}
        <div
          className="relative overflow-hidden rounded-2xl aspect-video flex items-center justify-center"
          style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}
        >
          {project.image_url && !imgFailed ? (
            <img
              src={project.image_url}
              alt={project.title}
              className="w-full h-full object-contain"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="flex flex-col items-center gap-2.5">
              <MdImageNotSupported size={40} style={{ color: "var(--color-muted)", opacity: 0.3 }} />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  letterSpacing: "calc(0.1em * var(--tracking-scale))",
                  color: "var(--color-muted)",
                  opacity: 0.4,
                }}
              >
                {project.image_url ? t("projects.imageError") : t("projects.noImage")}
              </span>
            </div>
          )}
        </div>

        <p className="text-base leading-relaxed max-w-2xl" style={{ color: "var(--color-muted)" }}>
          {project.description}
        </p>

        {/* The detail page has the room, so nothing is collapsed here — this
            is where someone lands after the card's "+N" told them there was
            more to see. */}
        {project.skills.length > 0 && (
          <section className="flex flex-col gap-3">
            <span className="section-label">{t("projects.builtWith")}</span>
            <SkillChips skills={project.skills} variant="full" />
          </section>
        )}

        <div className="flex flex-wrap gap-3">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
            >
              {t("projects.view")}
              <FaExternalLinkAlt size={11} />
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                border: "1px solid var(--color-border)",
                color: "var(--color-muted)",
                background: "var(--color-surface-2)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary)";
                (e.currentTarget as HTMLElement).style.color = "var(--color-text)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                (e.currentTarget as HTMLElement).style.color = "var(--color-muted)";
              }}
            >
              <FaGithub size={15} />
              <span>{t("projects.sourceCode")}</span>
            </a>
          )}
          {!project.live_url && !project.github_url && (
            <span
              className="text-xs px-4 py-2.5 rounded-xl"
              style={{
                color: "var(--color-muted)",
                border: "1px solid var(--color-border)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {t("projects.private")}
            </span>
          )}
        </div>
      </motion.div>
    </PageShell>
  );
}
