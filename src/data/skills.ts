import type { SkillRow } from "../lib/supabase";

/**
 * The stack list as it ships in the bundle.
 *
 * This is the `initialData` for the skills query, not dead weight: the
 * carousel sits high on the page, so swapping instant static content for a
 * spinner would be a real regression. The section paints immediately from
 * here and reconciles silently once Supabase answers — and still renders
 * correctly if Supabase is unreachable.
 *
 * Same pattern `useProfile` already uses with `me.json`.
 *
 * Kept in step with the seed block in supabase/migrations/0005_skills.sql.
 */

let seq = 0;
const skill = (
  name: string,
  icon_key: string,
  color: string,
  group_id: number,
): SkillRow["skills"][number] => ({
  id: `static-${seq++}`,
  name,
  group_id,
  icon_key,
  icon_url: null,
  color,
  sort_order: seq,
  is_visible: true,
});

export const staticSkillRows: SkillRow[] = [
  {
    group: {
      id: 1,
      slug: "languages",
      name: "Languages & Markup",
      sort_order: 0,
      direction: "left",
      speed_s: 42,
    },
    skills: [
      skill("JavaScript", "IoLogoJavascript", "#F7DF1E", 1),
      skill("TypeScript", "SiTypescript", "#3178C6", 1),
      skill("Python", "SiPython", "#3776AB", 1),
      skill("PHP", "FaPhp", "#8993BE", 1),
      skill("Dart", "SiDart", "#0175C2", 1),
      skill("HTML5", "SiHtml5", "#E34F26", 1),
      skill("CSS3", "SiCss", "#1572B6", 1),
      skill("Vite", "SiVite", "#646CFF", 1),
    ],
  },
  {
    group: {
      id: 2,
      slug: "frameworks",
      name: "Frameworks & Mobile",
      sort_order: 1,
      direction: "right",
      speed_s: 65,
    },
    skills: [
      skill("React JS", "FaReact", "#61DAFB", 2),
      skill("Angular", "SiAngular", "#DD0031", 2),
      skill("Next.js", "SiNextdotjs", "#a5b4fc", 2),
      skill("Flutter", "RiFlutterFill", "#54C5F8", 2),
      skill("React Native", "TbBrandReactNative", "#61DAFB", 2),
      skill("NestJS", "SiNestjs", "#E0234E", 2),
      skill("Express JS", "SiExpress", "#94a3b8", 2),
      skill("FastAPI", "SiFastapi", "#009688", 2),
      skill("Strapi", "SiStrapi", "#8B5CF6", 2),
      skill("Flask", "SiFlask", "#94a3b8", 2),
    ],
  },
  {
    group: {
      id: 3,
      slug: "data",
      name: "Tools & Databases",
      sort_order: 2,
      direction: "left",
      speed_s: 28,
    },
    skills: [
      skill("PostgreSQL", "SiPostgresql", "#4169E1", 3),
      skill("MySQL", "SiMysql", "#4479A1", 3),
      skill("SQLite", "SiSqlite", "#44A8C2", 3),
      skill("MongoDB", "SiMongodb", "#47A248", 3),
      skill("Firestore", "SiFirebase", "#FFCA28", 3),
      skill("Docker", "SiDocker", "#2496ED", 3),
      skill("Git", "SiGit", "#F05032", 3),
      skill("Tailwind CSS", "SiTailwindcss", "#06B6D4", 3),
    ],
  },
];

/** i18n keys for the seeded group slugs, so static rows stay translated. */
export const staticGroupLabelKeys: Record<string, string> = {
  languages: "skills.row.languages",
  frameworks: "skills.row.frameworks",
  data: "skills.row.data",
};
