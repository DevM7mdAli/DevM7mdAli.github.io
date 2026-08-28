import { createClient, User } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || "";
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** Bucket that new uploads go to. `project-images` is the legacy bucket —
 *  its URLs still resolve, but nothing writes there any more. */
export const ASSET_BUCKET = "portfolio-assets";

/* ── Shared types ──────────────────────────────────────── */

export type Locale = "en" | "ar";

/** Categories and tags use `bigint` identity keys, not UUIDs. */
export type ProjectCategory = {
  id: number;
  slug: string;
  name: string;
  name_en?: string;
  name_ar?: string;
  created_at?: string;
};

export type Tag = {
  id: number;
  slug: string;
  name: string;
  name_en?: string;
  name_ar?: string;
  created_at?: string;
};

/** The experience a project was built during, as embedded on a project. */
export type AssociatedWork = {
  id: string;
  slug: string;
  company_name: string;
  role: string;
  is_current: boolean;
};

export type Project = {
  id: string;
  slug: string;
  image_url: string | null;
  github_url: string | null;
  live_url: string | null;
  title: string;
  title_en?: string;
  title_ar?: string;
  description: string;
  description_en?: string;
  description_ar?: string;
  category_id?: number | null;
  /** Nullable FK — personal projects leave this null. */
  experience_id?: string | null;
  category: ProjectCategory | null;
  tags: Array<{ tag: Tag; tag_id?: number }>;
  associated_work: AssociatedWork | null;
  created_at?: string;
};

export type Experience = {
  id: string;
  slug: string;
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

export type SkillGroup = {
  id: number;
  slug: string;
  name: string;
  name_en?: string;
  name_ar?: string;
  sort_order: number;
  direction: "left" | "right";
  speed_s: number;
};

export type Skill = {
  id: string;
  name: string;
  group_id: number | null;
  /** Key into `iconRegistry` — the bundled fast path. */
  icon_key: string | null;
  /** Uploaded SVG in `portfolio-assets` — the no-deploy fallback. */
  icon_url: string | null;
  color: string;
  sort_order: number;
  is_visible: boolean;
};

/** A carousel row: one group plus the skills in it. */
export type SkillRow = { group: SkillGroup; skills: Skill[] };

/* ── Selects ────────────────────────────────────────────── */

const projectSelect = (locale: Locale) => `
  id,
  slug,
  image_url,
  github_url,
  live_url,
  category_id,
  experience_id,
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
    slug,
    company_name,
    role:role_${locale},
    is_current
  )
`;

const experienceSelect = (locale: Locale) => `
  id,
  slug,
  company_name,
  company_logo_url,
  start_date,
  end_date,
  is_current,
  role:role_${locale},
  description:description_${locale},
  location:location_${locale}
`;

/* ── Public queries ─────────────────────────────────────── */

export async function fetchProjects(locale: Locale): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select(projectSelect(locale))
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchProjects error:", error);
    return [];
  }
  return (data ?? []) as unknown as Project[];
}

/** Detail-page fetch. Returns null for an unknown slug so the route can 404. */
export async function fetchProjectBySlug(
  slug: string,
  locale: Locale,
): Promise<Project | null> {
  const { data, error } = await supabase
    .from("projects")
    .select(projectSelect(locale))
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("fetchProjectBySlug error:", error);
    return null;
  }
  return (data as unknown as Project) ?? null;
}

export async function fetchExperiences(locale: Locale): Promise<Experience[]> {
  const { data, error } = await supabase
    .from("experiences")
    .select(experienceSelect(locale))
    .order("start_date", { ascending: false });

  if (error) {
    console.error("fetchExperiences error:", error);
    return [];
  }
  return (data ?? []) as unknown as Experience[];
}

export async function fetchExperienceBySlug(
  slug: string,
  locale: Locale,
): Promise<Experience | null> {
  const { data, error } = await supabase
    .from("experiences")
    .select(experienceSelect(locale))
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("fetchExperienceBySlug error:", error);
    return null;
  }
  return (data as unknown as Experience) ?? null;
}

/** The projects built during one experience — the payoff of the FK. */
export async function fetchProjectsByExperience(
  experienceId: string,
  locale: Locale,
): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select(projectSelect(locale))
    .eq("experience_id", experienceId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchProjectsByExperience error:", error);
    return [];
  }
  return (data ?? []) as unknown as Project[];
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

/* ── Public queries: skills ─────────────────────────────── */

/**
 * Carousel rows, ordered. Returns [] on any failure so the caller can fall
 * back to the bundled static list rather than rendering an empty section.
 */
export async function fetchSkillRows(locale: Locale): Promise<SkillRow[]> {
  const [groupsRes, skillsRes] = await Promise.all([
    supabase
      .from("skill_groups")
      .select(`id, slug, sort_order, direction, speed_s, name:name_${locale}`)
      .order("sort_order", { ascending: true }),
    supabase
      .from("skills")
      .select("id, name, group_id, icon_key, icon_url, color, sort_order, is_visible")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true }),
  ]);

  if (groupsRes.error || skillsRes.error) {
    console.error("fetchSkillRows error:", groupsRes.error ?? skillsRes.error);
    return [];
  }

  const groups = (groupsRes.data ?? []) as unknown as SkillGroup[];
  const skills = (skillsRes.data ?? []) as unknown as Skill[];

  return groups
    .map((group) => ({
      group,
      skills: skills.filter((s) => s.group_id === group.id),
    }))
    .filter((row) => row.skills.length > 0);
}

/* ── Admin auth ─────────────────────────────────────────── */

export async function signInAdmin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOutAdmin() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentAdminUser(): Promise<User | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user ?? null;
}

/* ── Admin CRUD: projects ───────────────────────────────── */

export async function fetchAdminProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      category:project_categories ( * ),
      tags:project_tags ( tag:tags ( * ) ),
      associated_work:experiences ( id, slug, company_name, role_en, role_ar, is_current )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchAdminProjects error:", error);
    throw new Error(error.message);
  }

  return (data ?? []).map((p: any) => ({
    ...p,
    title: p.title_en || p.title_ar || "",
    description: p.description_en || p.description_ar || "",
    category: p.category
      ? { ...p.category, name: p.category.name_en || p.category.name_ar || p.category.slug || "" }
      : null,
    tags: (p.tags ?? []).map((t: any) => ({
      ...t,
      tag: t.tag
        ? { ...t.tag, name: t.tag.name_en || t.tag.name_ar || t.tag.slug || "" }
        : null,
    })),
    associated_work: p.associated_work
      ? {
          ...p.associated_work,
          role: p.associated_work.role_en || p.associated_work.role_ar || "",
        }
      : null,
  })) as Project[];
}

export type CreateProjectPayload = {
  slug: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  image_url?: string | null;
  github_url?: string | null;
  live_url?: string | null;
  category_id?: number | null;
  /** null = a personal project, not tied to any job. */
  experience_id?: string | null;
  tag_ids?: number[];
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
    const { error: tagErr } = await supabase
      .from("project_tags")
      .insert(tag_ids.map((tag_id) => ({ project_id: project.id, tag_id })));
    if (tagErr) throw new Error(`Project saved, but tags failed: ${tagErr.message}`);
  }

  return project;
}

export async function updateProject(id: string, payload: CreateProjectPayload) {
  const { tag_ids, ...projectData } = payload;

  const { error } = await supabase.from("projects").update(projectData).eq("id", id);
  if (error) throw new Error(error.message);

  if (tag_ids !== undefined) {
    const { error: delErr } = await supabase
      .from("project_tags")
      .delete()
      .eq("project_id", id);
    if (delErr) throw new Error(`Could not replace tags: ${delErr.message}`);

    if (tag_ids.length > 0) {
      const { error: tagErr } = await supabase
        .from("project_tags")
        .insert(tag_ids.map((tag_id) => ({ project_id: id, tag_id })));
      if (tagErr) throw new Error(`Project saved, but tags failed: ${tagErr.message}`);
    }
  }
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* ── Admin CRUD: categories & tags ──────────────────────── */

export async function fetchCategories(): Promise<ProjectCategory[]> {
  const { data, error } = await supabase.from("project_categories").select("*");
  if (error) {
    console.error("fetchCategories error:", error);
    return [];
  }
  return (data ?? []).map((cat: any) => ({
    ...cat,
    name: cat.name_en || cat.name_ar || cat.slug || "",
  }));
}

export async function createCategory(name_en: string, name_ar: string) {
  const { data, error } = await supabase
    .from("project_categories")
    .insert([{ slug: slugify(name_en), name_en, name_ar }])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateCategory(id: number, name_en: string, name_ar: string) {
  const { error } = await supabase
    .from("project_categories")
    .update({ slug: slugify(name_en), name_en, name_ar })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteCategory(id: number) {
  const { error } = await supabase.from("project_categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function fetchTags(): Promise<Tag[]> {
  const { data, error } = await supabase.from("tags").select("*");
  if (error) {
    console.error("fetchTags error:", error);
    return [];
  }
  return (data ?? []).map((tag: any) => ({
    ...tag,
    name: tag.name_en || tag.name_ar || tag.slug || "",
  }));
}

export async function createTag(name_en: string, name_ar: string) {
  const { data, error } = await supabase
    .from("tags")
    .insert([{ slug: slugify(name_en), name_en, name_ar }])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateTag(id: number, name_en: string, name_ar: string) {
  const { error } = await supabase
    .from("tags")
    .update({ slug: slugify(name_en), name_en, name_ar })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteTag(id: number) {
  const { error } = await supabase.from("tags").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* ── Admin CRUD: experiences ────────────────────────────── */

export async function fetchAdminExperiences(): Promise<Experience[]> {
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((exp: any) => ({
    ...exp,
    role: exp.role_en || exp.role_ar || "",
    description: exp.description_en || exp.description_ar || "",
    location: exp.location_en || exp.location_ar || "",
  })) as Experience[];
}

export type ExperiencePayload = {
  slug: string;
  company_name: string;
  company_logo_url?: string | null;
  role_en: string;
  role_ar: string;
  description_en?: string | null;
  description_ar?: string | null;
  location_en?: string | null;
  location_ar?: string | null;
  /** ISO `YYYY-MM-DD` — these are `date` columns. */
  start_date: string;
  /** null for a current role. `is_current` carries that meaning. */
  end_date: string | null;
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
  const { error } = await supabase.from("experiences").update(payload).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteExperience(id: string) {
  const { error } = await supabase.from("experiences").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* ── Admin CRUD: skills ─────────────────────────────────── */

export async function fetchAdminSkillGroups(): Promise<SkillGroup[]> {
  const { data, error } = await supabase
    .from("skill_groups")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((g: any) => ({
    ...g,
    name: g.name_en || g.name_ar || g.slug || "",
  })) as SkillGroup[];
}

export async function fetchAdminSkills(): Promise<Skill[]> {
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Skill[];
}

export type SkillPayload = {
  name: string;
  group_id: number | null;
  icon_key: string | null;
  icon_url: string | null;
  color: string;
  sort_order: number;
  is_visible: boolean;
};

export async function createSkill(payload: SkillPayload) {
  const { data, error } = await supabase.from("skills").insert([payload]).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateSkill(id: string, payload: SkillPayload) {
  const { error } = await supabase.from("skills").update(payload).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteSkill(id: string) {
  const { error } = await supabase.from("skills").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* ── Admin CRUD: profile settings ───────────────────────── */

export async function updateProfileSettings(payload: ProfileSettings) {
  const { data: existing, error: readErr } = await supabase
    .from("profile_settings")
    .select("id")
    .limit(1);
  if (readErr) throw new Error(readErr.message);

  if (existing && existing.length > 0) {
    const { error } = await supabase
      .from("profile_settings")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", existing[0].id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("profile_settings").insert([payload]);
    if (error) throw new Error(error.message);
  }
}

/* ── Helpers ────────────────────────────────────────────── */

/** Mirrors `public.slugify()` in migration 0004 — keep the two in step. */
export function slugify(src: string): string {
  return src
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ── Storage ────────────────────────────────────────────── */

/**
 * Turns a Supabase Storage error into something that names the actual fix.
 *
 * The three failures below are genuinely different problems and used to be
 * collapsed into one message that always blamed a missing bucket — which is
 * how "Bucket not found" ended up describing a permissions gap.
 */
function describeUploadError(err: { message?: string; name?: string } | null): string {
  const raw = err?.message ?? "Unknown error";
  const msg = raw.toLowerCase();

  if (msg.includes("bucket not found") || msg.includes("nosuchbucket")) {
    return (
      `Storage rejected the upload with "Bucket not found". The '${ASSET_BUCKET}' bucket ` +
      `usually does exist — this is normally a missing SELECT policy on storage.buckets, ` +
      `which hides the bucket from your role. Run supabase/migrations/0002_storage.sql.`
    );
  }
  if (msg.includes("row-level security") || msg.includes("violates") || msg.includes("unauthorized")) {
    return (
      `Storage denied the write. You are signed in, but there is no INSERT/UPDATE policy ` +
      `on storage.objects for '${ASSET_BUCKET}'. Run supabase/migrations/0002_storage.sql.`
    );
  }
  if (msg.includes("payload too large") || msg.includes("exceeded the maximum")) {
    return "That file is over the 5 MB limit for this bucket. Compress it and try again.";
  }
  if (msg.includes("mime") || msg.includes("content type")) {
    return "That file type isn't allowed. Use PNG, JPEG, WebP, GIF, SVG, or PDF.";
  }
  return `Upload failed: ${raw}`;
}

export async function uploadAssetFile(file: File, folder = "assets"): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;

  const { error } = await supabase.storage
    .from(ASSET_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type || undefined });

  if (error) throw new Error(describeUploadError(error));

  const { data } = supabase.storage.from(ASSET_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
