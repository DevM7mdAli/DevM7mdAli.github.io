import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { fetchSkillRows, type Locale, type SkillRow } from "../lib/supabase";
import { staticSkillRows } from "../data/skills";

export type UseSkillsResult = {
  rows: SkillRow[];
  /** True while showing the bundled list — either still loading, or Supabase failed. */
  isFallback: boolean;
};

/**
 * Skills for the carousel, with the bundled list as placeholder data.
 *
 * The carousel is the second section on the page, so it must paint
 * immediately rather than flashing a spinner. Same DB-with-static-fallback
 * shape as `useProfile`.
 */
export function useSkills(): UseSkillsResult {
  const { i18n } = useTranslation();
  const locale = (i18n.language === "ar" ? "ar" : "en") as Locale;

  const { data, isPlaceholderData } = useQuery({
    queryKey: ["skills", locale],
    queryFn: () => fetchSkillRows(locale),
    placeholderData: staticSkillRows,
    staleTime: 1000 * 60 * 5,
  });

  // fetchSkillRows returns [] rather than throwing, so an empty result means
  // "nothing seeded yet, or the request failed" — keep the bundled list.
  const rows = data && data.length > 0 ? data : staticSkillRows;
  const isFallback = isPlaceholderData || !data || data.length === 0;

  return { rows, isFallback };
}

/** Totals for the stats strip, derived so they can't drift from the carousel. */
export function useSkillStats() {
  const { rows } = useSkills();
  const bySlug = (slug: string) =>
    rows.find((r) => r.group.slug === slug)?.skills.length ?? 0;

  return {
    languages: bySlug("languages"),
    frameworks: bySlug("frameworks"),
    databases: bySlug("data"),
    total: rows.reduce((n, r) => n + r.skills.length, 0),
  };
}
