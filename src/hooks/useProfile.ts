import { useQuery } from "@tanstack/react-query";
import { fetchProfileSettings } from "../lib/supabase";
import me from "../data/me.json";

export interface ProfileData {
  resumeLink: string;
  linkedLink: string;
  GitHubLink: string;
  XLink: string;
  Email: string;
  about_en?: string | null;
  about_ar?: string | null;
}

export function useProfile(): ProfileData {
  const { data: dbProfile } = useQuery({
    queryKey: ["profileSettings"],
    queryFn: fetchProfileSettings,
    staleTime: 1000 * 60 * 5,
  });

  return {
    resumeLink: dbProfile?.resume_url || me.resumeLink,
    linkedLink: dbProfile?.linkedin_url || me.linkedLink,
    GitHubLink: dbProfile?.github_url || me.GitHubLink,
    XLink: dbProfile?.x_url || me.XLink,
    Email: dbProfile?.email || me.Email,
    about_en: dbProfile?.about_en,
    about_ar: dbProfile?.about_ar,
  };
}
