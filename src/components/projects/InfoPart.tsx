import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaExternalLinkAlt, FaGithub, FaBriefcase, FaArrowRight } from "react-icons/fa";
import { MdImageNotSupported } from "react-icons/md";
import type { Project } from "../../lib/supabase";
import SkillChips from "./SkillChips";

type InfoPartProps = { project: Project };

type ImgState = "loading" | "loaded" | "error";

/**
 * A project card.
 *
 * The whole card is one press target leading to the project's detail page.
 * That's done with the `.card-press` / `.card-stretch` pattern rather than an
 * <a> around the card, because the card also links to the company and to the
 * live site — and anchors can't nest. The title's stretched pseudo-element
 * covers the card; every other action is raised above it with `.card-action`.
 *
 * The external links are deliberately demoted to icon buttons. The card used
 * to offer four destinations at equal weight with nothing indicating any of
 * them existed; now there's one obvious primary ("View details →") and two
 * small, clearly secondary escapes.
 */
export default function InfoPart({ project }: InfoPartProps) {
  const {
    slug,
    title,
    description,
    image_url,
    github_url,
    live_url,
    associated_work,
  } = project;
  const categoryName = project.category?.name ?? "";
  const [imgState, setImgState] = useState<ImgState>(
    image_url ? "loading" : "error",
  );
  const { t } = useTranslation();

  const iconAction = {
    border: "1px solid var(--color-border)",
    color: "var(--color-muted)",
    background: "var(--color-surface-2)",
  } as const;

  const hoverIn = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.borderColor = "var(--color-primary)";
    e.currentTarget.style.color = "var(--color-text)";
  };
  const hoverOut = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.borderColor = "var(--color-border)";
    e.currentTarget.style.color = "var(--color-muted)";
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="project-card card-press flex flex-col w-72 flex-shrink-0 h-full"
    >
      {/* Cover — 16:9 */}
      <div
        className="relative overflow-hidden aspect-video flex items-center justify-center"
        style={{ background: "var(--color-surface-2)" }}
      >
        {categoryName && (
          <span
            className="absolute top-3 left-3 z-10 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(255,255,255,0.08)",
              color: "var(--color-accent)",
              border: "1px solid var(--color-border)",
              fontFamily: "var(--font-mono)",
              letterSpacing: "calc(0.05em * var(--tracking-scale))",
            }}
          >
            {categoryName}
          </span>
        )}

        {imgState === "loading" && (
          <div
            className="w-7 h-7 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "var(--color-muted)" }}
          />
        )}

        {image_url && (
          <img
            src={image_url}
            alt=""
            className={`card-zoom w-full h-full object-contain ${
              imgState === "loaded" ? "opacity-100" : "opacity-0 absolute"
            }`}
            onLoad={() => setImgState("loaded")}
            onError={() => setImgState("error")}
          />
        )}

        {imgState === "error" && (
          <div className="flex flex-col items-center justify-center gap-2.5 px-4">
            <MdImageNotSupported
              size={40}
              style={{ color: "var(--color-muted)", opacity: 0.3 }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                letterSpacing: "calc(0.1em * var(--tracking-scale))",
                color: "var(--color-muted)",
                opacity: 0.4,
                textAlign: "center",
              }}
            >
              {image_url ? t("projects.imageError") : t("projects.noImage")}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* The card's one semantic link. `.card-stretch` extends its hit area
            over the entire card. */}
        <Link
          to={`/projects/${slug}`}
          className="card-stretch text-base font-semibold leading-snug"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
        >
          {title}
        </Link>

        {/* Where it was built. Personal projects have no associated_work and
            simply omit this — the relationship is optional by design. */}
        {associated_work && (
          <Link
            to={`/experience/${associated_work.slug}`}
            className="card-action flex items-center gap-1.5 text-xs w-fit transition-colors"
            style={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-accent)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-muted)")}
          >
            <FaBriefcase size={9} />
            <span>{associated_work.company_name}</span>
          </Link>
        )}

        <p
          className="text-sm leading-relaxed line-clamp-3 flex-1"
          style={{ color: "var(--color-muted)" }}
        >
          {description}
        </p>

        {/* Icons rather than text pills: five names wrap to three lines and
            bury the description, whereas the icon row is a fixed height no
            matter how many technologies a project uses. */}
        <div className="pt-1">
          <SkillChips skills={project.skills} max={5} size={30} />
        </div>

        {/* Affordance row: the cue on the left says the card is pressable; the
            icons on the right are the secondary escapes. */}
        <div
          className="flex items-center justify-between gap-2 mt-2 pt-3"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <span
            className="card-cue flex items-center gap-1.5 text-xs font-semibold"
            style={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}
          >
            {t("projects.viewDetails")}
            <FaArrowRight className="card-cue-arrow" size={10} />
          </span>

          <div className="flex items-center gap-1.5">
            {live_url && (
              <a
                href={live_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("projects.openLive", { title })}
                title={t("projects.view")}
                className="card-action flex items-center justify-center w-8 h-8 rounded-lg transition-all"
                style={iconAction}
                onMouseEnter={hoverIn}
                onMouseLeave={hoverOut}
              >
                <FaExternalLinkAlt size={11} />
              </a>
            )}
            {github_url && (
              <a
                href={github_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("projects.openRepo", { title })}
                title={t("projects.sourceCode")}
                className="card-action flex items-center justify-center w-8 h-8 rounded-lg transition-all"
                style={iconAction}
                onMouseEnter={hoverIn}
                onMouseLeave={hoverOut}
              >
                <FaGithub size={13} />
              </a>
            )}
            {!live_url && !github_url && (
              <span
                className="text-xs px-2.5 py-1 rounded-lg"
                style={{
                  color: "var(--color-muted)",
                  border: "1px solid var(--color-border)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {t("projects.private")}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
