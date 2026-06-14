import {
  SiNextdotjs,
  SiFlask,
  SiMysql,
  SiSqlite,
  SiDart,
  SiTypescript,
  SiPython,
  SiAngular,
  SiNestjs,
  SiStrapi,
  SiExpress,
  SiFastapi,
  SiPostgresql,
  SiMongodb,
  SiFirebase,
} from "react-icons/si";
import { TbBrandReactNative } from "react-icons/tb";
import { FaReact, FaPhp } from "react-icons/fa";
import { RiFlutterFill } from "react-icons/ri";
import { IoLogoJavascript } from "react-icons/io5";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { IconType } from "react-icons";
import { useState } from "react";

type Skill = { name: string; icon: IconType; color: string };
type Group = { title: string; key: string; skills: Skill[] };

const groups: Group[] = [
  {
    title: "Languages",
    key: "Languages",
    skills: [
      { name: "JavaScript", icon: IoLogoJavascript, color: "#F7DF1E" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "Dart", icon: SiDart, color: "#0175C2" },
      { name: "Python", icon: SiPython, color: "#3776AB" },
      { name: "PHP", icon: FaPhp, color: "#8993BE" },
    ],
  },
  {
    title: "Front End",
    key: "Front End",
    skills: [
      { name: "React JS", icon: FaReact, color: "#61DAFB" },
      { name: "Angular", icon: SiAngular, color: "#DD0031" },
      { name: "React Native", icon: TbBrandReactNative, color: "#61DAFB" },
      { name: "Next.js", icon: SiNextdotjs, color: "#a5b4fc" },
      { name: "Flutter", icon: RiFlutterFill, color: "#54C5F8" },
    ],
  },
  {
    title: "Back End",
    key: "Back End",
    skills: [
      { name: "FastAPI", icon: SiFastapi, color: "#009688" },
      { name: "Express JS", icon: SiExpress, color: "#94a3b8" },
      { name: "NestJS", icon: SiNestjs, color: "#E0234E" },
      { name: "Strapi", icon: SiStrapi, color: "#8B5CF6" },
      { name: "Flask", icon: SiFlask, color: "#94a3b8" },
    ],
  },
  {
    title: "Database",
    key: "DataBase",
    skills: [
      { name: "Firestore", icon: SiFirebase, color: "#FFCA28" },
      { name: "MySQL", icon: SiMysql, color: "#4479A1" },
      { name: "SQLite", icon: SiSqlite, color: "#44A8C2" },
      { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
    ],
  },
];

function SkillItem({ name, icon: Icon, color }: Skill) {
  return (
    <motion.div
      whileHover={{ scale: 1.06, y: -3 }}
      className="flex flex-col items-center gap-2.5 p-4 rounded-xl cursor-default transition-all group"
      style={{
        background: "var(--color-surface-2)",
        border: "1px solid var(--color-border)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary)";
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 18px rgba(99,102,241,0.2)`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
        (e.currentTarget as HTMLElement).style.boxShadow = "";
      }}
    >
      <Icon size={36} color={color} />
      <span
        className="text-xs font-medium text-center"
        style={{ color: "var(--color-muted)" }}
      >
        {name}
      </span>
    </motion.div>
  );
}

export default function ListOfSkills() {
  const { t } = useTranslation();
  const [active, setActive] = useState<string>("Languages");

  const current = groups.find((g) => g.title === active) ?? groups[0];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Tab bar */}
      <div className="flex flex-wrap justify-center gap-2">
        {groups.map((g) => {
          const isActive = g.title === active;
          return (
            <button
              key={g.title}
              onClick={() => setActive(g.title)}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                background: isActive ? "var(--color-primary)" : "var(--color-surface)",
                color: isActive ? "#fff" : "var(--color-muted)",
                border: `1px solid ${isActive ? "var(--color-primary)" : "var(--color-border)"}`,
                boxShadow: isActive ? "0 4px 16px rgba(99,102,241,0.4)" : "none",
              }}
            >
              {t(`skills.groups.${g.key}`)}
            </button>
          );
        })}
      </div>

      {/* Skills panel */}
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-3 sm:grid-cols-5 gap-3 max-w-2xl mx-auto w-full"
      >
        {current.skills.map((skill) => (
          <SkillItem key={skill.name} {...skill} />
        ))}
      </motion.div>
    </div>
  );
}
