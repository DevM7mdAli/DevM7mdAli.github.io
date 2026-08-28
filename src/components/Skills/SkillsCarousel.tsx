import type { Skill } from "../../lib/supabase";
import { useSkillRows, type LabelledSkillRow } from "../../hooks/useSkills";
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
          fontFamily: "var(--font-body)",
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

function CarouselRow({ row }: { row: LabelledSkillRow }) {
  const doubled = [...row.skills, ...row.skills];
  const trackClass =
    row.group.direction === "left" ? "carousel-track" : "carousel-track-r";

  return (
    <div className="flex flex-col gap-3">
      <div className="px-8 lg:px-16">
        <span className="section-label">{row.label}</span>
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
  // Same rows the stats strip counts — label resolution lives in one place so
  // the two can't disagree about what a row is called.
  const rows = useSkillRows();

  return (
    <div className="full-bleed flex flex-col gap-6 py-6 select-none">
      {rows.map((row) => (
        <CarouselRow key={row.group.slug} row={row} />
      ))}
    </div>
  );
}
