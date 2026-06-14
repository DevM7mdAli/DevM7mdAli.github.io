import { useTranslation } from "react-i18next";
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
  SiTailwindcss,
  SiGit,
  SiDocker,
  SiHtml5,
  SiCss3,
  SiVite,
} from "react-icons/si";
import { TbBrandReactNative } from "react-icons/tb";
import { FaReact, FaPhp } from "react-icons/fa";
import { RiFlutterFill } from "react-icons/ri";
import { IoLogoJavascript } from "react-icons/io5";
import type { IconType } from "react-icons";

type Skill = { name: string; icon: IconType; color: string };

/* ── Row 1: Languages & Markup ─────────────────────────── */
const rowLanguages: Skill[] = [
  { name: "JavaScript", icon: IoLogoJavascript, color: "#F7DF1E" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  { name: "Python", icon: SiPython, color: "#3776AB" },
  { name: "PHP", icon: FaPhp, color: "#8993BE" },
  { name: "Dart", icon: SiDart, color: "#0175C2" },
  { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
  { name: "CSS3", icon: SiCss3, color: "#1572B6" },
  { name: "Vite", icon: SiVite, color: "#646CFF" },
];

/* ── Row 2: Frameworks & Mobile ────────────────────────── */
const rowFrameworks: Skill[] = [
  { name: "React JS", icon: FaReact, color: "#61DAFB" },
  { name: "Angular", icon: SiAngular, color: "#DD0031" },
  { name: "Next.js", icon: SiNextdotjs, color: "#a5b4fc" },
  { name: "Flutter", icon: RiFlutterFill, color: "#54C5F8" },
  { name: "React Native", icon: TbBrandReactNative, color: "#61DAFB" },
  { name: "NestJS", icon: SiNestjs, color: "#E0234E" },
  { name: "Express JS", icon: SiExpress, color: "#94a3b8" },
  { name: "FastAPI", icon: SiFastapi, color: "#009688" },
  { name: "Strapi", icon: SiStrapi, color: "#8B5CF6" },
  { name: "Flask", icon: SiFlask, color: "#94a3b8" },
];

/* ── Row 3: Tools & Databases ──────────────────────────── */
const rowData: Skill[] = [
  { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
  { name: "MySQL", icon: SiMysql, color: "#4479A1" },
  { name: "SQLite", icon: SiSqlite, color: "#44A8C2" },
  { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
  { name: "Firestore", icon: SiFirebase, color: "#FFCA28" },
  { name: "Docker", icon: SiDocker, color: "#2496ED" },
  { name: "Git", icon: SiGit, color: "#F05032" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
];

type RowProps = {
  skills: Skill[];
  direction: "left" | "right";
  speed: number;
  label: string;
};

function CarouselRow({ skills, direction, speed, label }: RowProps) {
  const doubled = [...skills, ...skills];
  const trackClass = direction === "left" ? "carousel-track" : "carousel-track-r";

  return (
    <div className="flex flex-col gap-3">
      <div className="px-8 lg:px-16">
        <span className="section-label">{label}</span>
      </div>
      {/* dir="ltr" forces physical LTR layout so the animation works in RTL locales */}
      <div className="carousel-wrap" dir="ltr">
        <div
          className={trackClass}
          style={{ animationDuration: `${speed}s`, gap: "1rem" }}
        >
          {doubled.map((s, i) => (
            <Badge key={i} {...s} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Badge({ name, icon: Icon, color }: Skill) {
  return (
    <div
      style={{
        width: "112px",
        height: "112px",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "12px",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--color-primary)";
        el.style.transform = "translateY(-4px)";
        el.style.boxShadow = "0 8px 24px var(--color-glow)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--color-border)";
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >
      <Icon size={42} color={color} />
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.68rem",
          fontWeight: 500,
          color: "var(--color-muted)",
          textAlign: "center",
          letterSpacing: "0.02em",
          maxWidth: "96px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {name}
      </span>
    </div>
  );
}

export default function SkillsCarousel() {
  const { t } = useTranslation();

  return (
    <div className="full-bleed flex flex-col gap-6 py-6 select-none">
      <CarouselRow skills={rowLanguages} direction="left" speed={42} label={t("skills.row.languages")} />
      <CarouselRow skills={rowFrameworks} direction="right" speed={65} label={t("skills.row.frameworks")} />
      <CarouselRow skills={rowData} direction="left" speed={28} label={t("skills.row.data")} />
    </div>
  );
}
