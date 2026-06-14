import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 960) setOpenNav(false); };
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    if (!openNav) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenNav(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openNav]);

  const navLinks = [
    { href: "#AboutMe", label: t("nav.about") },
    { href: "#Skills", label: t("nav.skills") },
    { href: "#experience", label: t("nav.experience") },
    { href: "#projects", label: t("nav.projects") },
    { href: "#contact", label: t("nav.contact") },
  ];

  const handleLangToggle = () => {
    const next = lang === "en" ? "ar" : "en";
    setLang(next);
    i18n.changeLanguage(next);
    document.dir = next === "ar" ? "rtl" : "ltr";
  };

  const controls = (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="w-9 h-9 flex items-center justify-center rounded-full transition-all text-base"
        style={{
          border: "1px solid var(--color-border)",
          color: "var(--color-muted)",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)"; }}
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </button>
      <button
        aria-label="Switch language"
        className="text-xs font-bold px-3 py-1.5 rounded-full transition-all"
        style={{
          border: "1px solid var(--color-border)",
          color: "var(--color-muted)",
          fontFamily: "'JetBrains Mono', monospace",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)"; }}
        onClick={handleLangToggle}
      >
        {lang === "en" ? "AR" : "EN"}
      </button>
    </div>
  );

  return (
    <div
      className="sticky top-0 w-full z-30 transition-all duration-300"
      style={
        scrolled
          ? {
              background: "var(--nav-scrolled-bg)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderBottom: "1px solid var(--nav-scrolled-border)",
            }
          : { background: "transparent" }
      }
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-3 lg:py-4 relative" ref={menuRef}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center flex-shrink-0">
            <img
              src="/DMA.png"
              alt="DMA"
              className="logo-themable size-12 sm:size-14 object-contain"
            />
          </a>

          {/* Desktop nav links */}
          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <a href={href} className="nav-link">{label}</a>
              </li>
            ))}
          </ul>

          {/* Controls + hamburger */}
          <div className="flex items-center gap-2">
            {controls}
            {/* Hamburger — mobile only */}
            <button
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full transition-all"
              style={{ border: "1px solid var(--color-border)" }}
              onClick={() => setOpenNav((v) => !v)}
              aria-label="Toggle menu"
            >
              <motion.div
                animate={openNav ? "open" : "closed"}
                className="w-5 h-4 flex flex-col justify-between"
              >
                <motion.span
                  className="block h-px w-full rounded"
                  style={{ background: "var(--color-text)" }}
                  variants={{ open: { rotate: 45, y: 7 }, closed: { rotate: 0, y: 0 } }}
                  transition={{ duration: 0.22 }}
                />
                <motion.span
                  className="block h-px w-full rounded"
                  style={{ background: "var(--color-text)" }}
                  variants={{ open: { opacity: 0 }, closed: { opacity: 1 } }}
                  transition={{ duration: 0.15 }}
                />
                <motion.span
                  className="block h-px w-full rounded"
                  style={{ background: "var(--color-text)" }}
                  variants={{ open: { rotate: -45, y: -7 }, closed: { rotate: 0, y: 0 } }}
                  transition={{ duration: 0.22 }}
                />
              </motion.div>
            </button>
          </div>
        </div>

        {/* Mobile dropdown — absolute popover, no content push */}
        <AnimatePresence>
          {openNav && (
            <motion.div
              className="lg:hidden absolute left-4 right-4 top-full mt-2 rounded-2xl p-5 z-50"
              style={{
                background: theme === "dark" ? "rgba(14,14,14,0.96)" : "rgba(255,255,255,0.96)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid var(--color-border)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
              }}
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <ul className="flex flex-col gap-1">
                {navLinks.map(({ href, label }) => (
                  <li key={href}>
                    <a
                      href={href}
                      className="block px-3 py-3 rounded-xl text-sm font-medium transition-all"
                      style={{ color: "var(--color-muted)" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "var(--color-surface-2)";
                        (e.currentTarget as HTMLElement).style.color = "var(--color-text)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                        (e.currentTarget as HTMLElement).style.color = "var(--color-muted)";
                      }}
                      onClick={() => setOpenNav(false)}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
