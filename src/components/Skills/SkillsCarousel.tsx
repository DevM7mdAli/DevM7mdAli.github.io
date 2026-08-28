import { useTranslation } from "react-i18next";
import type { Skill, SkillRow } from "../../lib/supabase";
import { staticGroupLabelKeys } from "../../data/skills";
import { useSkills } from "../../hooks/useSkills";
import SkillIcon from "./SkillIcon";

function Badge({ skill }: { skill: Skill }) {
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
      <SkillIcon skill={skill} size={42} />
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
        {skill.name}
      </span>
    </div>
  );
}

function CarouselRow({ row, label }: { row: SkillRow; label: string }) {
  const doubled = [...row.skills, ...row.skills];
  const trackClass =
    row.group.direction === "left" ? "carousel-track" : "carousel-track-r";

  return (
    <div className="flex flex-col gap-3">
      <div className="px-8 lg:px-16">
        <span className="section-label">{label}</span>
      </div>
      {/* dir="ltr" forces physical LTR layout so the animation works in RTL locales */}
      <div className="carousel-wrap" dir="ltr">
        <div
          className={trackClass}
          style={{ animationDuration: `${row.group.speed_s}s`, gap: "1rem" }}
        >
          {doubled.map((s, i) => (
            <Badge key={`${s.id}-${i}`} skill={s} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SkillsCarousel() {
  const { t } = useTranslation();
  const { rows, isFallback } = useSkills();

  return (
    <div className="full-bleed flex flex-col gap-6 py-6 select-none">
      {rows.map((row) => {
        // The bundled list stores English group names and defers to i18n.
        // Rows from the database arrive already localized by the query, so
        // renaming a group in /manage takes effect rather than being
        // overridden by a translation key.
        const fallbackKey = staticGroupLabelKeys[row.group.slug];
        const label =
          isFallback && fallbackKey ? t(fallbackKey) : row.group.name;

        return <CarouselRow key={row.group.slug} row={row} label={label} />;
      })}
    </div>
  );
}
