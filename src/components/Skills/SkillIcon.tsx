import { resolveIcon } from "../../lib/iconRegistry";
import type { Skill } from "../../lib/supabase";

type Props = { skill: Skill; size?: number };

/**
 * Renders a skill icon by whichever route is available.
 *
 *   icon_key in the registry  → the bundled component (instant, no network)
 *   icon_url                  → the uploaded SVG, drawn as a CSS mask
 *   neither                   → a lettered placeholder
 *
 * Uploaded SVGs go through `mask-image` rather than `<img>` for two reasons.
 * A raw Simple Icons file is solid black and would be invisible on the dark
 * theme, whereas a mask takes its colour from `background-color` — so the
 * stored brand colour behaves identically on both paths. And an SVG used as a
 * mask cannot execute script, which makes an uploaded file inert by
 * construction.
 */
export default function SkillIcon({ skill, size = 42 }: Props) {
  const Icon = resolveIcon(skill.icon_key);

  if (Icon) {
    return <Icon size={size} color={skill.color} aria-hidden="true" />;
  }

  if (skill.icon_url) {
    return (
      <span
        aria-hidden="true"
        className="skill-icon-remote"
        style={{
          width: size,
          height: size,
          // CSS.escape isn't needed — these are Supabase-generated URLs.
          ["--icon" as string]: `url("${skill.icon_url}")`,
          ["--brand" as string]: skill.color,
        }}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "8px",
        border: "1px solid var(--color-border)",
        color: skill.color,
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: size * 0.42,
      }}
    >
      {skill.name.slice(0, 2).toUpperCase()}
    </span>
  );
}
