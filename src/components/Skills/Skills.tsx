import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import SkillsCarousel from "./SkillsCarousel";
import ListOfSkills from "./ListOfSkills";

export default function Skills() {
  const { t } = useTranslation();

  return (
    <motion.section
      id="Skills"
      className="w-full flex flex-col gap-14"
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, type: "spring", stiffness: 75 }}
      viewport={{ once: true, margin: "-8%" }}
    >
      <div className="text-center flex flex-col gap-3">
        <span className="section-label block">{t("skills.title")}</span>
        <h2
          className="text-4xl sm:text-5xl font-bold"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {t("skills.title")}
        </h2>
        <p
          className="text-base max-w-md mx-auto mt-1"
          style={{ color: "var(--color-muted)" }}
        >
          Technologies I work with daily — across the full stack.
        </p>
      </div>

      {/* Infinite marquee */}
      <SkillsCarousel />

      {/* Grouped skill cards */}
      <ListOfSkills />
    </motion.section>
  );
}
