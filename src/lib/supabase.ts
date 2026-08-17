import { createClient, User } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || "";
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* ── Shared types ──────────────────────────────────────── */

export type Locale = "en" | "ar";

export type ProjectCategory = {
  id: string;
  slug: string;
  name: string;
  name_en?: string;
  name_ar?: string;
  created_at?: string;
};

export type Tag = {
  id: string;
  slug: string;
  name: string;
  name_en?: string;
  name_ar?: string;
  created_at?: string;
};

export type AssociatedWork = {
  id?: string;
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
  title_en?: string;
  title_ar?: string;
  description: string;
  description_en?: string;
  description_ar?: string;
  category_id?: string | null;
  associated_experience_id?: string | null;
  category: ProjectCategory | null;
  tags: Array<{ tag: Tag; tag_id?: string }>;
  associated_work: AssociatedWork | null;
  created_at?: string;
};

export type Experience = {
  id: string;
  company_name: string;
  company_logo_url: string | null;
  role: string;
  role_en?: string;
  role_ar?: string;
  description: string | null;
  description_en?: string | null;
  description_ar?: string | null;
  location: string | null;
  location_en?: string | null;
  location_ar?: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  created_at?: string;
};

export type ProfileSettings = {
  id?: string;
  resume_url: string;
  linkedin_url: string;
  github_url: string;
  x_url: string;
  email: string;
  about_en?: string | null;
  about_ar?: string | null;
};

/* ── Public Query Helpers ───────────────────────────────── */

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
        id,
        slug,
        name:name_${locale}
      ),
      tags:project_tags (
        tag:tags (
          id,
          slug,
          name:name_${locale}
        )
      ),
      associated_work:experiences (
        id,
        company_name,
        role:role_${locale},
        is_current
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchProjects error:", error);
    return [];
  }
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

  if (error) {
    console.error("fetchExperiences error:", error);
    return [];
  }
  return (data ?? []) as unknown as Experience[];
}

export async function fetchProfileSettings(): Promise<ProfileSettings | null> {
  const { data, error } = await supabase
    .from("profile_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("fetchProfileSettings error:", error);
    return null;
  }
  return data as ProfileSettings | null;
}

/* ── Admin Auth Helpers ─────────────────────────────────── */

export async function signInAdmin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOutAdmin() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentAdminUser(): Promise<User | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user ?? null;
}

/* ── Admin CRUD: Projects ───────────────────────────────── */

export async function fetchAdminProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      category:project_categories ( * ),
      tags:project_tags ( tag:tags ( * ) )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchAdminProjects error:", error);
    throw new Error(error.message);
  }
  
  return (data ?? []).map((p: any) => ({
    ...p,
    title: p.title_en || p.title_ar || p.title || "",
    description: p.description_en || p.description_ar || p.description || "",
    category: p.category
      ? {
          ...p.category,
          name: p.category.name_en || p.category.name_ar || p.category.name || p.category.slug || "",
        }
      : null,
    tags: (p.tags ?? []).map((t: any) => ({
      ...t,
      tag: t.tag
        ? {
            ...t.tag,
            name: t.tag.name_en || t.tag.name_ar || t.tag.name || t.tag.slug || "",
          }
        : null,
    })),
  })) as Project[];
}

export type CreateProjectPayload = {
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  image_url?: string | null;
  github_url?: string | null;
  live_url?: string | null;
  category_id?: string | null;
  tag_ids?: string[];
};

export async function createProject(payload: CreateProjectPayload) {
  const { tag_ids = [], ...projectData } = payload;

  const { data: project, error } = await supabase
    .from("projects")
    .insert([projectData])
    .select()
    .single();

  if (error) throw new Error(error.message);

  if (tag_ids.length > 0) {
    const tagRows = tag_ids.map((tag_id) => ({
      project_id: project.id,
      tag_id,
    }));
    const { error: tagErr } = await supabase.from("project_tags").insert(tagRows);
    if (tagErr) console.error("Error inserting project tags:", tagErr);
  }

  return project;
}

export async function updateProject(id: string, payload: CreateProjectPayload) {
  const { tag_ids, ...projectData } = payload;

  const { error } = await supabase
    .from("projects")
    .update(projectData)
    .eq("id", id);

  if (error) throw new Error(error.message);

  if (tag_ids !== undefined) {
    await supabase.from("project_tags").delete().eq("project_id", id);
    if (tag_ids.length > 0) {
      const tagRows = tag_ids.map((tag_id) => ({
        project_id: id,
        tag_id,
      }));
      await supabase.from("project_tags").insert(tagRows);
    }
  }
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* ── Admin CRUD: Categories & Tags ──────────────────────── */

export async function fetchCategories(): Promise<ProjectCategory[]> {
  const { data, error } = await supabase
    .from("project_categories")
    .select("*");
  if (error) {
    console.error("fetchCategories error:", error);
    return [];
  }
  return (data ?? []).map((cat: any) => ({
    ...cat,
    name: cat.name_en || cat.name_ar || cat.name || cat.slug || "",
  }));
}

export async function createCategory(name_en: string, name_ar: string) {
  const slug = name_en.toLowerCase().trim().replace(/\s+/g, "-");
  
  const payload: any = { slug, name_en, name_ar, name: name_en };
  const { data, error } = await supabase
    .from("project_categories")
    .insert([payload])
    .select()
    .single();

  if (error) {
    const fallbackPayload = { slug, name_en, name_ar };
    const { data: retryData, error: retryErr } = await supabase
      .from("project_categories")
      .insert([fallbackPayload])
      .select()
      .single();
    if (retryErr) throw retryErr;
    return retryData;
  }
  return data;
}

export async function updateCategory(id: string, name_en: string, name_ar: string) {
  const slug = name_en.toLowerCase().trim().replace(/\s+/g, "-");
  const payload: any = { slug, name_en, name_ar, name: name_en };
  const { error } = await supabase
    .from("project_categories")
    .update(payload)
    .eq("id", id);
  if (error) {
    const fallbackPayload = { slug, name_en, name_ar };
    const { error: retryErr } = await supabase
      .from("project_categories")
      .update(fallbackPayload)
      .eq("id", id);
    if (retryErr) throw retryErr;
  }
}

export async function deleteCategory(id: string) {
  const { error } = await supabase.from("project_categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function fetchTags(): Promise<Tag[]> {
  const { data, error } = await supabase
    .from("tags")
    .select("*");
  if (error) {
    console.error("fetchTags error:", error);
    return [];
  }
  return (data ?? []).map((tag: any) => ({
    ...tag,
    name: tag.name_en || tag.name_ar || tag.name || tag.slug || "",
  }));
}

export async function createTag(name_en: string, name_ar: string) {
  const slug = name_en.toLowerCase().trim().replace(/\s+/g, "-");
  
  const payload: any = { slug, name_en, name_ar, name: name_en };
  const { data, error } = await supabase
    .from("tags")
    .insert([payload])
    .select()
    .single();

  if (error) {
    const fallbackPayload = { slug, name_en, name_ar };
    const { data: retryData, error: retryErr } = await supabase
      .from("tags")
      .insert([fallbackPayload])
      .select()
      .single();
    if (retryErr) throw retryErr;
    return retryData;
  }
  return data;
}

export async function updateTag(id: string, name_en: string, name_ar: string) {
  const slug = name_en.toLowerCase().trim().replace(/\s+/g, "-");
  const payload: any = { slug, name_en, name_ar, name: name_en };
  const { error } = await supabase
    .from("tags")
    .update(payload)
    .eq("id", id);
  if (error) {
    const fallbackPayload = { slug, name_en, name_ar };
    const { error: retryErr } = await supabase
      .from("tags")
      .update(fallbackPayload)
      .eq("id", id);
    if (retryErr) throw retryErr;
  }
}

export async function deleteTag(id: string) {
  const { error } = await supabase.from("tags").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* ── Admin CRUD: Experiences ────────────────────────────── */

export async function fetchAdminExperiences(): Promise<Experience[]> {
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) throw new Error(error.message);
  
  return (data ?? []).map((exp: any) => ({
    ...exp,
    role: exp.role_en || exp.role_ar || exp.role || "",
    description: exp.description_en || exp.description_ar || exp.description || "",
    location: exp.location_en || exp.location_ar || exp.location || "",
  })) as Experience[];
}

export type ExperiencePayload = {
  company_name: string;
  company_logo_url?: string | null;
  role_en: string;
  role_ar: string;
  description_en?: string | null;
  description_ar?: string | null;
  location_en?: string | null;
  location_ar?: string | null;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
};

export async function createExperience(payload: ExperiencePayload) {
  const { data, error } = await supabase
    .from("experiences")
    .insert([payload])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateExperience(id: string, payload: ExperiencePayload) {
  const { error } = await supabase
    .from("experiences")
    .update(payload)
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteExperience(id: string) {
  const { error } = await supabase.from("experiences").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* ── Admin CRUD: Profile Settings ───────────────────────── */

export async function updateProfileSettings(payload: ProfileSettings) {
  const { data: existing } = await supabase.from("profile_settings").select("id").limit(1);
  
  if (existing && existing.length > 0) {
    const { error } = await supabase
      .from("profile_settings")
      .update({
        ...payload,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing[0].id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("profile_settings").insert([payload]);
    if (error) throw error;
  }
}

/* ── Storage Upload Helper ───────────────────────────────── */

export async function uploadAssetFile(file: File, folder: string = "assets"): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from("portfolio-assets")
    .upload(fileName, file, { upsert: true });

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}. Make sure 'portfolio-assets' bucket exists and is public.`);
  }

  const { data } = supabase.storage.from("portfolio-assets").getPublicUrl(fileName);
  return data.publicUrl;
}
