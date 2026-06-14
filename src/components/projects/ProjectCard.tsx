import InfoPart from "./InfoPart";
import { useEffect, useState } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import app from "../../firebase";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { FaChevronDown } from "react-icons/fa";

type Project = {
  img: string;
  tag: string;
  arTag: string;
  name: string;
  arName: string;
  stacks: string[];
  arStack: string[];
  about: string;
  arAbout: string;
  object?: boolean;
  link: string;
};

const PAGE_SIZE = 6;
const LOAD_STEP = 3;

export default function ProjectCard() {
  const { t, i18n } = useTranslation();
  const [selectedTag, setSelectedTag] = useState<string>(t("projects.all"));
  const [visible, setVisible] = useState(PAGE_SIZE);

  // Reset pagination when filter or language changes
  useEffect(() => {
    setSelectedTag(t("projects.all"));
  }, [i18n.language]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [selectedTag]);

  const { data: dataProject = [], isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const db = getFirestore(app);
      const snap = await getDocs(collection(db, "Projects"));
      const projects: Project[] = [];
      snap.forEach((d) => projects.push(d.data() as Project));
      return projects;
    },
  });

  const tags: string[] = [
    t("projects.all"),
    ...Array.from(
      new Set(
        dataProject.map((p) => (i18n.language === "en" ? p.tag : p.arTag)),
      ),
    ),
  ];

  const allFiltered = dataProject.filter(
    (p) =>
      selectedTag === t("projects.all") ||
      (i18n.language === "en" ? p.tag === selectedTag : p.arTag === selectedTag),
  );

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
        <span className="section-label block">{t("projects.title")}</span>
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
          Selected work from the past few years.
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
                  key={`${project.name}-${i}`}
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3, delay: i >= visible - LOAD_STEP ? (i - (visible - LOAD_STEP)) * 0.08 : 0 }}
                >
                  <InfoPart
                    img={project.img}
                    tag={
                      i18n.language === "en" ? project.tag : project.arTag
                    }
                    name={
                      i18n.language === "en" ? project.name : project.arName
                    }
                    stacks={
                      i18n.language === "en"
                        ? project.stacks
                        : project.arStack
                    }
                    info={
                      i18n.language === "en" ? project.about : project.arAbout
                    }
                    object={project.object}
                    link={project.link}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Pagination — Load More */}
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
                  Load more
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

          {/* All loaded state */}
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
