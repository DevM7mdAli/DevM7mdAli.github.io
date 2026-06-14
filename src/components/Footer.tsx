import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaSquareXTwitter } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

type FooterProps = {
  linkedLink: string;
  GitHubLink: string;
  XLink: string;
  Email: string;
};

const NAV_LINKS = [
  { href: "#AboutMe", label: "About" },
  { href: "#Skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export default function Footer({
  linkedLink,
  GitHubLink,
  XLink,
  Email,
}: FooterProps) {
  const { t } = useTranslation();

  const socials = [
    { href: XLink, Icon: FaSquareXTwitter, label: "X" },
    { href: GitHubLink, Icon: FaGithub, label: "GitHub" },
    { href: linkedLink, Icon: FaLinkedin, label: "LinkedIn" },
    { href: Email, Icon: MdEmail, label: "Email" },
  ];

  return (
    <motion.footer
      className="w-full mt-24"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {/* Top divider */}
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)",
        }}
      />

      <div
        className="w-full px-8 lg:px-16 py-10"
        style={{ background: "var(--color-surface)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <img
              src="/DMA.png"
              alt="DMA"
              className="logo-themable size-16 sm:size-24 object-contain"
            />
          </a>

          {/* Nav */}
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-sm transition-colors"
                style={{ color: "var(--color-muted)" }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--color-text)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--color-muted)")
                }
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Socials */}
          <div className="flex items-center gap-4">
            {socials.map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 flex items-center justify-center rounded-full transition-all"
                style={{
                  border: "1px solid var(--color-border)",
                  color: "var(--color-muted)",
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
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="max-w-7xl mx-auto mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <p
            className="text-xs"
            style={{
              color: "var(--color-muted)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>
          <p
            className="text-xs"
            style={{
              color: "var(--color-muted)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Built with love
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
