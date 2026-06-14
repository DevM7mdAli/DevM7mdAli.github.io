import { Collapse, IconButton } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useUIStore } from "../stores/uiStore";

export default function NavBar() {
  const [openNav, setOpenNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, i18n } = useTranslation();
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const lang = useUIStore((s) => s.lang);
  const setLang = useUIStore((s) => s.setLang);

  const MTCollapse = Collapse as any;
  const MTIconButton = IconButton as any;

  useEffect(() => {
    const onResize = () => window.innerWidth >= 960 && setOpenNav(false);
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const navLinks = [
    { href: "#AboutMe", label: t("nav.about") },
    { href: "#Skills", label: t("nav.skills") },
    { href: "#projects", label: t("nav.projects") },
    { href: "#contact", label: t("nav.contact") },
  ];

  const controls = (
    <div className="flex items-center gap-3">
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="w-9 h-9 flex items-center justify-center rounded-full border border-app transition-all hover:border-[var(--color-primary)] text-base"
        style={{ borderColor: "var(--color-border)" }}
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </button>
      <button
        aria-label="Switch language"
        className="text-xs font-mono font-bold border px-3 py-1.5 rounded-full transition-all"
        style={{
          borderColor: "var(--color-border)",
          color: "var(--color-muted)",
        }}
        onClick={() => {
          const next = lang === "en" ? "ar" : "en";
          setLang(next);
          i18n.changeLanguage(next);
          document.dir = next === "ar" ? "rtl" : "ltr";
        }}
      >
        {lang === "en" ? "AR" : "EN"}
      </button>
    </div>
  );

  const navList = (
    <ul className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
      {navLinks.map(({ href, label }) => (
        <li key={href}>
          <a href={href} className="nav-link" onClick={() => setOpenNav(false)}>
            {label}
          </a>
        </li>
      ))}
      <li
        className="lg:ml-4 pt-2 lg:pt-0 border-t lg:border-0"
        style={{ borderColor: "var(--color-border)" }}
      >
        {controls}
      </li>
    </ul>
  );

  return (
    <div
      className="sticky top-0 w-full z-30 transition-all duration-300"
      style={
        scrolled
          ? {
              background: "rgba(10, 10, 10, 0.88)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
            }
          : { background: "transparent" }
      }
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-3 lg:py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <img
              src="/DMA.png"
              alt="DMA"
              className="logo-themable size-12 sm:size-16 object-contain"
            />
          </a>

          <div className="hidden lg:flex items-center">{navList}</div>

          <div className="lg:hidden flex items-center gap-3">
            {controls}
            <MTIconButton
              variant="text"
              ripple={false}
              onClick={() => setOpenNav(!openNav)}
              className="text-app rounded-lg"
              style={{ color: "var(--color-text)" }}
            >
              {openNav ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </MTIconButton>
          </div>
        </div>

        <MTCollapse open={openNav}>
          <div className="glass mt-3 rounded-xl p-4">{navList}</div>
        </MTCollapse>
      </div>
    </div>
  );
}
