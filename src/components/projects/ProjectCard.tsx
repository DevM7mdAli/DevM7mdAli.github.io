import InfoPart from "./InfoPart";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { FaChevronDown } from "react-icons/fa";
import { fetchProjects, type Locale, type Project } from "../../lib/supabase";

const PAGE_SIZE = 6;
const LOAD_STEP = 3;

export default function ProjectCard() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === "ar" ? "ar" : "en") as Locale;

  const [selectedTag, setSelectedTag] = useState<string>(t("projects.all"));
  const [visible, setVisible] = useState(PAGE_SIZE);

  // Reset filter label when language changes
  useEffect(() => {
    setSelectedTag(t("projects.all"));
  }, [i18n.language]);

  // Reset pagination when filter changes
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [selectedTag]);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["projects", locale],
    queryFn: () => fetchProjects(locale),
    staleTime: 1000 * 60 * 5,
  });

  const ALL_LABEL = t("projects.all");

  const tags: string[] = [
    ALL_LABEL,
    ...Array.from(
      new Set(
        projects
          .map((p) => p.category?.name ?? "")
          .filter(Boolean),
      ),
    ),
  ];

  const allFiltered =
    selectedTag === ALL_LABEL
      ? projects
      : projects.filter((p) => p.category?.name === selectedTag);

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
        {tags.map((tag) => {
          const active = selectedTag === tag;
          return (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
              style={{
                background: active
                  ? "var(--color-primary)"
                  : "var(--color-surface)",
                color: active ? "var(--color-bg)" : "var(--color-muted)",
                border: `1px solid ${active ? "var(--color-primary)" : "var(--color-border)"}`,
              }}
            >
              {tag}
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
            key={selectedTag}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32 }}
            className="flex flex-row flex-wrap justify-center gap-6"
          >
            <AnimatePresence mode="popLayout">
              {shown.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{
                    duration: 0.3,
                    delay:
                      i >= visible - LOAD_STEP
                        ? (i - (visible - LOAD_STEP)) * 0.08
                        : 0,
                  }}
                >
                  <InfoPart
                    title={project.title}
                    description={project.description}
                    image_url={project.image_url}
                    github_url={project.github_url}
                    live_url={project.live_url}
                    categoryName={project.category?.name ?? ""}
                    tags={project.tags.map((t) => t.tag.name)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
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
                  Showing {shown.length} of {allFiltered.length}
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

          {/* All loaded */}
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
              — ALL {allFiltered.length} PROJECTS LOADED —
            </motion.p>
          )}
        </div>
      )}
    </motion.section>
  );
}
