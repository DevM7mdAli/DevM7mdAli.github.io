import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { fetchProjects, type Locale, type Project } from "../lib/supabase";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import PageShell, { PageSpinner } from "../components/PageShell";
import ProjectGrid from "../components/projects/ProjectGrid";

export default function ProjectIndex() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === "ar" ? "ar" : "en") as Locale;

  // Filter on category id, not the translated name: two categories can share
  // a localized label, and filtering by string resets on every language switch.
  const [categoryId, setCategoryId] = useState<number | null>(null);

  useDocumentMeta({
    title: t("projects.pageTitle"),
    description: t("projects.subtitle"),
    canonicalPath: "/projects",
  });

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["projects", locale],
    queryFn: () => fetchProjects(locale),
    staleTime: 1000 * 60 * 5,
  });

  const categories = Array.from(
    new Map(
      projects
        .filter((p) => p.category)
        .map((p) => [p.category!.id, p.category!]),
    ).values(),
  );

  const filtered =
    categoryId === null
      ? projects
      : projects.filter((p) => p.category?.id === categoryId);

  return (
    <PageShell backTo="/" backLabel={t("common.backHome")}>
      <div className="flex flex-col gap-3">
        <span className="section-label">{t("projects.label")}</span>
        <h1
          className="text-4xl sm:text-5xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {t("projects.pageTitle")}
        </h1>
        <p className="text-base max-w-xl" style={{ color: "var(--color-muted)" }}>
          {t("projects.subtitle")}
        </p>
      </div>

      {isLoading ? (
        <PageSpinner />
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {[{ id: null, name: t("projects.all") }, ...categories].map((cat) => {
              const active = categoryId === cat.id;
              return (
                <button
                  key={cat.id ?? "all"}
                  onClick={() => setCategoryId(cat.id as number | null)}
                  className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                  style={{
                    background: active ? "var(--color-primary)" : "var(--color-surface)",
                    color: active ? "var(--color-bg)" : "var(--color-muted)",
                    border: `1px solid ${active ? "var(--color-primary)" : "var(--color-border)"}`,
                  }}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          <ProjectGrid projects={filtered} />
        </>
      )}
    </PageShell>
  );
}
