import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { fetchSkillRows, type Locale, type SkillRow } from "../lib/supabase";
import { staticSkillRows, staticGroupLabelKeys } from "../data/skills";

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

export type LabelledSkillRow = SkillRow & { label: string };

/**
 * Carousel rows with their display label resolved.
 *
 * Both the carousel and the stats strip render these, so a row's count and the
 * words next to it always come from the same object. The strip previously
 * derived its numbers from the data but kept fixed labels, which is how it came
 * to claim "8 Languages" for a row containing HTML, CSS and Vite.
 *
 * The bundled fallback stores English group names and defers to i18n; rows from
 * the database arrive already localized, so renaming a group in /manage takes
 * effect rather than being overridden by a translation key.
 */
export function useSkillRows(): LabelledSkillRow[] {
  const { rows, isFallback } = useSkills();
  const { t } = useTranslation();

  return rows.map((row) => {
    const key = staticGroupLabelKeys[row.group.slug];
    return { ...row, label: isFallback && key ? t(key) : row.group.name };
  });
}
