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
} from "react-icons/si";
import { TbBrandReactNative } from "react-icons/tb";
import { FaReact, FaPhp } from "react-icons/fa";
import { RiFlutterFill } from "react-icons/ri";
import { IoLogoJavascript } from "react-icons/io5";
import type { IconType } from "react-icons";

type Skill = {
  name: string;
  icon: IconType;
  color: string;
};

const row1: Skill[] = [
  { name: "JavaScript", icon: IoLogoJavascript, color: "#F7DF1E" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  { name: "React JS", icon: FaReact, color: "#61DAFB" },
  { name: "Angular", icon: SiAngular, color: "#DD0031" },
  { name: "Next.js", icon: SiNextdotjs, color: "#a5b4fc" },
  { name: "Flutter", icon: RiFlutterFill, color: "#54C5F8" },
  { name: "React Native", icon: TbBrandReactNative, color: "#61DAFB" },
  { name: "Python", icon: SiPython, color: "#3776AB" },
  { name: "PHP", icon: FaPhp, color: "#8993BE" },
  { name: "Dart", icon: SiDart, color: "#0175C2" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
  { name: "Git", icon: SiGit, color: "#F05032" },
];

const row2: Skill[] = [
  { name: "FastAPI", icon: SiFastapi, color: "#009688" },
  { name: "Express JS", icon: SiExpress, color: "#94a3b8" },
  { name: "NestJS", icon: SiNestjs, color: "#E0234E" },
  { name: "Strapi", icon: SiStrapi, color: "#8B5CF6" },
  { name: "Flask", icon: SiFlask, color: "#94a3b8" },
  { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
  { name: "MySQL", icon: SiMysql, color: "#4479A1" },
  { name: "SQLite", icon: SiSqlite, color: "#44A8C2" },
  { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },
  { name: "Docker", icon: SiDocker, color: "#2496ED" },
];

function Badge({ name, icon: Icon, color }: Skill) {
  return (
    <div className="skill-badge">
      <Icon size={20} color={color} />
      <span>{name}</span>
    </div>
  );
}

export default function SkillsCarousel() {
  const doubled1 = [...row1, ...row1];
  const doubled2 = [...row2, ...row2];

  return (
    <div className="w-full flex flex-col gap-3 py-2 select-none">
      <div className="carousel-wrap">
        <div className="carousel-track">
          {doubled1.map((s, i) => (
            <Badge key={i} {...s} />
          ))}
        </div>
      </div>

      <div className="carousel-wrap">
        <div className="carousel-track-r">
          {doubled2.map((s, i) => (
            <Badge key={i} {...s} />
          ))}
        </div>
      </div>
    </div>
  );
}
