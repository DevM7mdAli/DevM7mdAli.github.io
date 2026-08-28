import ProjectGrid from "./ProjectGrid";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { FaChevronDown, FaArrowRight } from "react-icons/fa";
import { fetchProjects, type Locale, type Project } from "../../lib/supabase";

const PAGE_SIZE = 6;
const LOAD_STEP = 3;

export default function ProjectCard() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === "ar" ? "ar" : "en") as Locale;

  // Filter on category id rather than the translated name: two categories can
  // share a localized label, and a name-based filter resets on every language
  // switch because the label itself changes.
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);

  // Reset pagination when filter changes
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [categoryId]);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["projects", locale],
    queryFn: () => fetchProjects(locale),
    staleTime: 1000 * 60 * 5,
  });

  const categories = Array.from(
    new Map(
      projects.filter((p) => p.category).map((p) => [p.category!.id, p.category!]),
    ).values(),
  );
  const filterTabs = [{ id: null as number | null, name: t("projects.all") }, ...categories];

  const allFiltered =
    categoryId === null
      ? projects
      : projects.filter((p) => p.category?.id === categoryId);

  const shown = allFiltered.slice(0, visible);
  const remaining = Math.max(0, allFiltered.length - visible);
  const hasMore = remaining > 0;

  return (
    <motion.section
      id="projects"
      className="w-full flex flex-col gap-10"
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, type: "spring", stiffness: 75 }}
      viewport={{ once: true, margin: "-8%" }}
    >
      {/* Header */}
      <div className="text-center flex flex-col gap-3">
        <span className="section-label block">{t("projects.label")}</span>
        <h2
          className="text-4xl sm:text-5xl font-bold"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {t("projects.title")}
        </h2>
        <p
          className="text-base max-w-md mx-auto mt-1"
          style={{ color: "var(--color-muted)" }}
        >
          {t("projects.subtitle")}
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {filterTabs.map((cat) => {
          const active = categoryId === cat.id;
          return (
            <button
              key={cat.id ?? "all"}
              onClick={() => setCategoryId(cat.id)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
              style={{
                background: active
                  ? "var(--color-primary)"
                  : "var(--color-surface)",
                color: active ? "var(--color-bg)" : "var(--color-muted)",
                border: `1px solid ${active ? "var(--color-primary)" : "var(--color-border)"}`,
              }}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Cards */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div
            className="w-9 h-9 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "var(--color-muted)" }}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          <motion.div
            key={categoryId ?? "all"}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32 }}
          >
            <ProjectGrid projects={shown} staggerFrom={visible - LOAD_STEP} />
          </motion.div>

          {/* Load More */}
          <AnimatePresence>
            {hasMore && (
              <motion.div
                className="flex flex-col items-center gap-3"
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
                  {t("projects.showing", { shown: shown.length, total: allFiltered.length })}
                </p>
                <button
                  onClick={() => setVisible((v) => v + LOAD_STEP)}
                  className="group flex items-center gap-2.5 px-7 py-3 rounded-full text-sm font-semibold transition-all"
                  style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "var(--color-primary)";
                    (e.currentTarget as HTMLElement).style.background =
                      "var(--color-surface-2)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "var(--color-border)";
                    (e.currentTarget as HTMLElement).style.background =
                      "var(--color-surface)";
                  }}
                >
                  {t("projects.loadMore")}
                  <motion.span
                    animate={{ y: [0, 3, 0] }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <FaChevronDown
                      size={12}
                      style={{ color: "var(--color-muted)" }}
                    />
                  </motion.span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {!hasMore && allFiltered.length > 0 && (
            <div className="flex justify-center">
              <Link
                to="/projects"
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
                {t("projects.viewAll")}
                <FaArrowRight size={11} style={{ color: "var(--color-muted)" }} />
              </Link>
            </div>
          )}

          {/* All loaded — hand off to the full index */}
          {!hasMore && allFiltered.length > PAGE_SIZE && (
            <motion.p
              className="text-center text-xs"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: "var(--color-muted)",
                letterSpacing: "0.12em",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {t("projects.allLoaded", { count: allFiltered.length })}
            </motion.p>
          )}
        </div>
      )}
    </motion.section>
  );
}
