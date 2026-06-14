import InfoPart from "./InfoPart";
import { useEffect, useState } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { motion } from "framer-motion";
import app from "../../firebase";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

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

export default function ProjectCard() {
  const { t, i18n } = useTranslation();
  const [selectedTag, setSelectedTag] = useState<string>(t("projects.all"));

  useEffect(() => {
    setSelectedTag(t("projects.all"));
  }, [i18n.language]);

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

  const filtered = dataProject.filter(
    (p) =>
      selectedTag === t("projects.all") ||
      (i18n.language === "en" ? p.tag === selectedTag : p.arTag === selectedTag),
  );

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
        <p className="text-base max-w-md mx-auto mt-1" style={{ color: "var(--color-muted)" }}>
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
                background: active ? "var(--color-primary)" : "var(--color-surface)",
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
        <motion.div
          key={selectedTag}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32 }}
          className="flex flex-row flex-wrap justify-center gap-6"
        >
          {filtered.map((project, i) => (
            <InfoPart
              key={i}
              img={project.img}
              tag={i18n.language === "en" ? project.tag : project.arTag}
              name={i18n.language === "en" ? project.name : project.arName}
              stacks={i18n.language === "en" ? project.stacks : project.arStack}
              info={i18n.language === "en" ? project.about : project.arAbout}
              object={project.object}
              link={project.link}
            />
          ))}
        </motion.div>
      )}
    </motion.section>
  );
}
