import { Link } from "react-router-dom";
import { FaGlobe, FaSignOutAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useUIStore } from "../../stores/uiStore";
import { signOutAdmin } from "../../lib/supabase";

export default function AdminHeader({ userEmail }: { userEmail?: string | null }) {
  const { theme, toggleTheme, lang, setLang } = useUIStore();
  const { t, i18n } = useTranslation();

  const handleLogout = async () => {
    try {
      await signOutAdmin();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleLangToggle = () => {
    const next = lang === "en" ? "ar" : "en";
    setLang(next);
    i18n.changeLanguage(next);
    document.dir = next === "ar" ? "rtl" : "ltr";
  };

  return (
    <header
      className="w-full sticky top-0 z-30 border-b px-6 py-4 backdrop-blur-xl transition-all"
      style={{
        background: "var(--nav-scrolled-bg)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img src="/DMA.png" alt="DMA Logo" className="w-9 h-9 object-contain logo-themable" />
          </Link>
          <div
            className="h-5 w-px hidden sm:block"
            style={{ background: "var(--color-border)" }}
          />
          <div>
            <h1
              className="font-bold text-base tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
            >
              {t("manage.title")}
            </h1>
            <span
              className="text-xs block font-mono"
              style={{ color: "var(--color-muted)", fontSize: "0.7rem" }}
            >
              {userEmail || "Authenticated User"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-muted)",
              background: "var(--color-surface)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary)";
              (e.currentTarget as HTMLElement).style.color = "var(--color-text)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
              (e.currentTarget as HTMLElement).style.color = "var(--color-muted)";
            }}
          >
            <FaGlobe size={12} />
            <span className="hidden sm:inline">{t("manage.viewSite")}</span>
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full border flex items-center justify-center text-xs transition-all"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-muted)",
              background: "var(--color-surface)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
            }}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {/* Language Switcher */}
          <button
            onClick={handleLangToggle}
            className="px-3.5 py-1.5 rounded-full border text-xs font-bold font-mono transition-all"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-muted)",
              background: "var(--color-surface)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
            }}
            aria-label="Switch Language"
          >
            {lang === "en" ? "AR 🇸🇦" : "EN 🇬🇧"}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text)",
              background: "var(--color-surface-2)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
            }}
          >
            <FaSignOutAlt size={12} />
            <span>{t("manage.logout")}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
