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
        className="min-h-screen w-full flex items-center justify-center"
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
      className="min-h-screen w-full flex flex-col"
      style={{ background: "var(--color-bg)", color: "var(--color-text)", fontFamily: "'Inter', sans-serif" }}
    >
      <AdminHeader userEmail={user?.email} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-10 py-8 flex flex-col gap-8">
        {/* Navigation Tabs */}
        <div
          className="flex items-center gap-1.5 p-1.5 rounded-2xl border overflow-x-auto"
          style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          {navTabs.map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className="flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all"
                style={{
                  background: active ? "var(--color-primary)" : "transparent",
                  color: active ? "var(--color-bg)" : "var(--color-muted)",
                }}
                onMouseEnter={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.color = "var(--color-text)";
                }}
                onMouseLeave={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.color = "var(--color-muted)";
                }}
              >
                <Icon size={13} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab View Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "projects" && <ProjectsManager />}
          {activeTab === "experiences" && <ExperiencesManager />}
          {activeTab === "skills" && <SkillsManager />}
          {activeTab === "categories" && <CategoriesManager />}
          {activeTab === "profile" && <ProfileManager />}
        </motion.div>
      </main>
    </div>
  );
}
