import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import { MdImageNotSupported } from "react-icons/md";

type InfoPartProps = {
  title: string;
  description: string;
  image_url: string | null;
  github_url: string | null;
  live_url: string | null;
  categoryName: string;
  tags: string[];
};

type ImgState = "loading" | "loaded" | "error";

export default function InfoPart({
  title,
  description,
  image_url,
  github_url,
  live_url,
  categoryName,
  tags,
}: InfoPartProps) {
  const [imgState, setImgState] = useState<ImgState>(
    image_url ? "loading" : "error",
  );
  const { t } = useTranslation();

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="project-card flex flex-col w-72 flex-shrink-0 h-full"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* Image area — 16:9 aspect ratio (professional standard) */}
      <div
        className="relative overflow-hidden aspect-video flex items-center justify-center"
        style={{ background: "var(--color-surface-2)" }}
      >
        {/* Category badge */}
        {categoryName && (
          <span
            className="absolute top-3 left-3 z-10 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(255,255,255,0.08)",
              color: "var(--color-accent)",
              border: "1px solid var(--color-border)",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.05em",
            }}
          >
            {categoryName}
          </span>
        )}

        {/* Loading spinner */}
        {imgState === "loading" && (
          <div
            className="w-7 h-7 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "var(--color-muted)" }}
          />
        )}

        {/* Image — object-contain preserves aspect, no cropping */}
        {image_url && (
          <img
            src={image_url}
            alt={title}
            className={`w-full h-full object-contain transition-all duration-500 ${
              imgState === "loaded"
                ? "opacity-100"
                : "opacity-0 absolute"
            }`}
            onLoad={() => setImgState("loaded")}
            onError={() => setImgState("error")}
          />
        )}

        {/* Error state — network or file not found */}
        {imgState === "error" && (
          <div className="flex flex-col items-center justify-center gap-2.5 px-4">
            <MdImageNotSupported
              size={40}
              style={{ color: "var(--color-muted)", opacity: 0.3 }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.1em",
                color: "var(--color-muted)",
                opacity: 0.4,
                textAlign: "center",
              }}
            >
              {image_url ? "LOAD FAILED" : "NO IMAGE"}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3
          className="text-base font-semibold leading-snug"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {title}
        </h3>

        <p
          className="text-sm leading-relaxed line-clamp-3 flex-1"
          style={{ color: "var(--color-muted)" }}
        >
          {description}
        </p>

        {/* Tag pills */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: "var(--color-surface-2)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-muted)",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* CTAs */}
        <div className="flex gap-2 mt-2">
          {live_url && (
            <a
              href={live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
            >
              {t("projects.view")}
              <FaExternalLinkAlt size={11} />
            </a>
          )}
          {github_url && (
            <a
              href={github_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex items-center justify-center px-3 py-2.5 rounded-xl text-sm transition-all"
              style={{
                border: "1px solid var(--color-border)",
                color: "var(--color-muted)",
                background: "var(--color-surface-2)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "var(--color-primary)";
                (e.currentTarget as HTMLElement).style.color =
                  "var(--color-text)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "var(--color-border)";
                (e.currentTarget as HTMLElement).style.color =
                  "var(--color-muted)";
              }}
            >
              <FaGithub size={16} />
            </a>
          )}
          {!live_url && !github_url && (
            <span
              className="text-xs px-4 py-2.5 rounded-xl"
              style={{
                color: "var(--color-muted)",
                border: "1px solid var(--color-border)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              Private
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
