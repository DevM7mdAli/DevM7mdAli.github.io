import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import AdminHeader from "../../components/admin/AdminHeader";
import ProjectsManager from "../../components/admin/ProjectsManager";
import ExperiencesManager from "../../components/admin/ExperiencesManager";
import CategoriesManager from "../../components/admin/CategoriesManager";
import SkillsManager from "../../components/admin/SkillsManager";
import ProfileManager from "../../components/admin/ProfileManager";
import { FaFolderOpen, FaBriefcase, FaUserCog, FaSpinner, FaFolder, FaLayerGroup } from "react-icons/fa";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const { user, loading, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"projects" | "experiences" | "skills" | "categories" | "profile">("projects");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/manage/login", { replace: true });
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div
        className="admin-ui min-h-screen w-full flex items-center justify-center"
        style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
      >
        <FaSpinner size={24} className="animate-spin" style={{ color: "var(--color-muted)" }} />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const navTabs = [
    { id: "projects", label: t("manage.tabs.projects"), Icon: FaFolderOpen },
    { id: "experiences", label: t("manage.tabs.experiences"), Icon: FaBriefcase },
    { id: "skills", label: t("manage.tabs.skills"), Icon: FaLayerGroup },
    { id: "categories", label: t("manage.tabs.categories"), Icon: FaFolder },
    { id: "profile", label: t("manage.tabs.profile"), Icon: FaUserCog },
  ] as const;

  return (
    <div
      className="admin-ui min-h-screen w-full flex flex-col"
      style={{ background: "var(--color-bg)", color: "var(--color-text)", fontFamily: "var(--font-body)" }}
    >
      <AdminHeader userEmail={user?.email} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-10 py-8 flex flex-col gap-7">
        {/* A tab bar, not a segmented pill control. The filled-pill version
            read as a row of buttons rather than as navigation, and put a
            high-contrast block on screen that outweighed the content under it.
            An underline indicator is what the pattern actually is. */}
        <div
          role="tablist"
          className="flex items-center gap-6 overflow-x-auto"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          {navTabs.map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(id)}
                className="admin-tab flex items-center gap-2 pb-3 pt-1 text-sm whitespace-nowrap"
                style={{
                  color: active ? "var(--color-text)" : "var(--color-muted)",
                  fontWeight: active ? 600 : 500,
                  borderBottom: `2px solid ${active ? "var(--color-primary)" : "transparent"}`,
                  marginBottom: "-1px",
                }}
              >
                <Icon size={14} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        <div>
          {activeTab === "projects" && <ProjectsManager />}
          {activeTab === "experiences" && <ExperiencesManager />}
          {activeTab === "skills" && <SkillsManager />}
          {activeTab === "categories" && <CategoriesManager />}
          {activeTab === "profile" && <ProfileManager />}
        </div>
      </main>
    </div>
  );
}
