import { useTranslation } from "react-i18next";
import type { Skill } from "../../lib/supabase";
import SkillIcon from "../Skills/SkillIcon";

type Props = {
  skills: Skill[];
  /** `compact` = icon-only circles with a +N overflow, for cards.
   *  `full`    = icon + name pills, everything shown, for detail pages. */
  variant?: "compact" | "full";
  /** compact only — how many icons before the overflow circle. */
  max?: number;
  size?: number;
};

/**
 * The technologies used on a project.
 *
 * Cards show icons only, because a row of five text pills wraps to three lines
 * and buries the description. The overflow circle keeps the row a fixed height
 * regardless of how many technologies a project has, and names stay reachable
 * on hover via `title`. Detail pages have the room, so they show every skill
 * with its name spelled out.
 */
export default function SkillChips({
  skills,
  variant = "compact",
  max = 5,
  size = 30,
}: Props) {
  const { t } = useTranslation();
  if (skills.length === 0) return null;

  if (variant === "full") {
    return (
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill.id}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full"
            style={{
              background: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
            }}
          >
            <SkillIcon skill={skill} size={16} />
            <span className="text-xs font-medium">{skill.name}</span>
          </span>
        ))}
      </div>
    );
  }

  const shown = skills.slice(0, max);
  const hidden = skills.slice(max);

  const circle = {
    width: size,
    height: size,
    borderRadius: "50%",
    background: "var(--color-surface-2)",
    border: "1px solid var(--color-border)",
    flexShrink: 0,
  } as const;

  return (
    <div className="flex items-center gap-1.5" aria-label={skills.map((s) => s.name).join(", ")}>
      {shown.map((skill) => (
        <span
          key={skill.id}
          className="flex items-center justify-center"
          style={circle}
          title={skill.name}
        >
          <SkillIcon skill={skill} size={Math.round(size * 0.52)} />
        </span>
      ))}

      {hidden.length > 0 && (
        <span
          className="flex items-center justify-center"
          style={{ ...circle, color: "var(--color-muted)" }}
          title={hidden.map((s) => s.name).join(", ")}
          aria-label={t("projects.moreSkills", { count: hidden.length })}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: size * 0.33,
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            +{hidden.length}
          </span>
        </span>
      )}
    </div>
  );
}
