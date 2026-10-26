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
  // ── Repetition count ──────────────────────────────────────────────────────
  // The animation scrolls exactly ONE set-width per cycle: from translateX(0)
  // to translateX(-100%/reps). For the loop to be seamless and gap-free the
  // total track must be wider than the viewport at every point in the cycle.
  //
  // Required: reps × setWidth  ≥  2 × viewportWidth
  //   → reps ≥ ⌈2 × viewportWidth / setWidth⌉
  //
  // We target 2560 px (ultrawide) as the worst-case viewport, add 1 extra rep
  // as a safety buffer, and enforce a minimum of 3 so the loop is visible even
  // on tiny screens. This means a few more DOM nodes than the old "doubled"
  // approach but badge elements are negligible in cost.
  const BADGE_W = 128; // 112 px card + 16 px gap
  const TARGET_W = 2 * 2560; // fill even an ultrawide at 2×
  const setWidth = Math.max(1, row.skills.length * BADGE_W);
  const reps = Math.max(3, Math.ceil(TARGET_W / setWidth) + 1);

  // Flatten N repetitions
  const items = Array.from({ length: reps }, () => row.skills).flat();

  // The keyframe end-point is exactly one set-width so the seam is invisible.
  // Passed as a CSS custom property so the single @keyframes definition works
  // for every row regardless of its repetition count.
  const scrollEnd = `${-(100 / reps).toFixed(6)}%`;

  // Right-direction rows use the scaleX(-1) mirror trick: the shell is flipped
  // so the scrollLeft animation produces a rightward visual scroll without the
  // gap bug (translateX(-50%) fails when setWidth < viewportWidth).
  // Each badge child is counter-mirrored so its content stays readable.
  const isRight = row.group.direction !== "left";
  const shellClass = isRight
    ? "carousel-shell carousel-shell-r"
    : "carousel-shell";

  return (
    <div className="flex flex-col gap-3">
      <div className="px-8 lg:px-16">
        <span className="section-label">{row.label}</span>
      </div>
      {/* dir="ltr" forces physical LTR layout so the animation works in RTL locales */}
      <div className={shellClass} dir="ltr">
        <div className="carousel-wrap">
          <div
            className="carousel-track"
            style={
              {
                animationDuration: `${row.group.speed_s}s`,
                gap: "1rem",
                "--scroll-end": scrollEnd,
              } as React.CSSProperties
            }
          >
            {items.map((s, i) => (
              <Badge key={`${s.id}-${i}`} skill={s} />
            ))}
          </div>
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
