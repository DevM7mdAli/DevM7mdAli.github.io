import { useEffect, useState } from "react";
import app from "../../firebase";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdImageNotSupported } from "react-icons/md";

type InfoPartProps = {
  tag: string;
  img: string;
  name: string;
  info: string;
  object?: boolean;
  link: string;
  stacks: string[];
};

type ImgState = "loading" | "loaded" | "error";

export default function InfoPart({
  tag,
  img,
  name,
  info,
  object,
  link,
  stacks,
}: InfoPartProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [imgState, setImgState] = useState<ImgState>("loading");
  const { t } = useTranslation();

  useEffect(() => {
    let cancelled = false;
    setImgState("loading");
    setImageUrl("");

    const storage = getStorage(app);
    getDownloadURL(ref(storage, img))
      .then((url) => {
        if (!cancelled) {
          setImageUrl(url);
          setImgState("loaded");
        }
      })
      .catch(() => {
        if (!cancelled) setImgState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [img]);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="project-card flex flex-col w-72 flex-shrink-0"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* Image area */}
      <div
        className="relative overflow-hidden"
        style={{ height: "180px", background: "var(--color-surface-2)" }}
      >
        {/* Tag badge */}
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
          {tag}
        </span>

        {/* Loading */}
        {imgState === "loading" && (
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="w-7 h-7 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "var(--color-muted)" }}
            />
          </div>
        )}

        {/* Loaded */}
        {imgState === "loaded" && (
          <img
            src={imageUrl}
            alt={name}
            className={`w-full h-full transition-transform duration-500 hover:scale-105 ${
              object ? "object-contain p-4" : "object-cover"
            }`}
          />
        )}

        {/* Error */}
        {imgState === "error" && (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2.5">
            <MdImageNotSupported
              size={36}
              style={{ color: "var(--color-muted)", opacity: 0.4 }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.1em",
                color: "var(--color-muted)",
                opacity: 0.5,
              }}
            >
              IMAGE UNAVAILABLE
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
          {name}
        </h3>
        <p
          className="text-sm leading-relaxed line-clamp-3 flex-1"
          style={{ color: "var(--color-muted)" }}
        >
          {info}
        </p>

        {/* Stack pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {stacks.map((s, i) => (
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
              {s}
            </span>
          ))}
        </div>

        {/* CTA */}
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
        >
          {t("projects.view")}
          <FaExternalLinkAlt size={11} />
        </a>
      </div>
    </motion.div>
  );
}
