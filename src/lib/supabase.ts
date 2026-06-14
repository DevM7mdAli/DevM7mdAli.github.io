import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* ── Shared types ──────────────────────────────────────── */

export type Locale = "en" | "ar";

export type ProjectCategory = {
  slug: string;
  name: string;
};

export type Tag = {
  slug: string;
  name: string;
};

export type AssociatedWork = {
  company_name: string;
  role: string;
  is_current: boolean;
};

export type Project = {
  id: string;
  image_url: string | null;
  github_url: string | null;
  live_url: string | null;
  title: string;
  description: string;
  category: ProjectCategory | null;
  tags: Array<{ tag: Tag }>;
  associated_work: AssociatedWork | null;
};

export type Experience = {
  id: string;
  company_name: string;
  company_logo_url: string | null;
  role: string;
  description: string | null;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
};

/* ── Query helpers ─────────────────────────────────────── */

export async function fetchProjects(locale: Locale): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      id,
      image_url,
      github_url,
      live_url,
      title:title_${locale},
      description:description_${locale},
      category:project_categories (
        slug,
        name:name_${locale}
      ),
      tags:project_tags (
        tag:tags (
          slug,
          name:name_${locale}
        )
      ),
      associated_work:experiences (
        company_name,
        role:role_${locale},
        is_current
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as Project[];
}

export async function fetchExperiences(locale: Locale): Promise<Experience[]> {
  const { data, error } = await supabase
    .from("experiences")
    .select(
      `
      id,
      company_name,
      company_logo_url,
      role:role_${locale},
      description:description_${locale},
      location:location_${locale},
      start_date,
      end_date,
      is_current
    `,
    )
    .order("start_date", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as Experience[];
}
