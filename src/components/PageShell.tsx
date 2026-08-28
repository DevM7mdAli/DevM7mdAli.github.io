import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaArrowLeft } from "react-icons/fa";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { useProfile } from "../hooks/useProfile";

type Props = {
  children: ReactNode;
  /** Optional breadcrumb shown above the content. */
  backTo?: string;
  backLabel?: string;
};

/** Chrome shared by every standalone route: nav, container, footer. */
export default function PageShell({ children, backTo, backLabel }: Props) {
  const profile = useProfile();
  const { i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        fontFamily: "'Inter', sans-serif",
        background: "var(--color-bg)",
        color: "var(--color-text)",
      }}
    >
      <NavBar />

      <main className="flex-1 w-full px-6 sm:px-10 lg:px-16 max-w-5xl mx-auto pt-28 pb-24 flex flex-col gap-10">
        {backTo && (
          <Link
            to={backTo}
            className="flex items-center gap-2 text-xs font-semibold tracking-wide self-start transition-colors"
            style={{ color: "var(--color-muted)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-text)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--color-muted)")}
          >
            <FaArrowLeft size={11} style={{ transform: isRtl ? "scaleX(-1)" : undefined }} />
            <span>{backLabel}</span>
          </Link>
        )}
        {children}
      </main>

      <Footer
        linkedLink={profile.linkedLink}
        GitHubLink={profile.GitHubLink}
        XLink={profile.XLink}
        Email={profile.Email}
      />
    </div>
  );
}

export function PageSpinner() {
  return (
    <div className="flex justify-center py-24">
      <div
        className="w-9 h-9 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: "var(--color-muted)" }}
      />
    </div>
  );
}
