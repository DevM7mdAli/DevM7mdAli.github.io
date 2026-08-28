import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  fetchProfileSettings,
  updateProfileSettings,
  uploadAssetFile,
  type ProfileSettings,
} from "../../lib/supabase";
import me from "../../data/me.json";
import {
  FaSave,
  FaDownload,
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaSpinner,
  FaUpload,
  FaCheck,
  FaUserEdit,
} from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

export default function ProfileManager() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [uploadingResume, setUploadingResume] = useState(false);
  const [aboutTab, setAboutTab] = useState<"en" | "ar">("en");

  // Form Fields
  const [resumeLink, setResumeLink] = useState(me.resumeLink);
  const [linkedLink, setLinkedLink] = useState(me.linkedLink);
  const [githubLink, setGithubLink] = useState(me.GitHubLink);
  const [xLink, setXLink] = useState(me.XLink);
  const [email, setEmail] = useState(me.Email);
  const [aboutEn, setAboutEn] = useState("");
  const [aboutAr, setAboutAr] = useState("");

  const { data: dbProfile, isLoading } = useQuery({
    queryKey: ["profileSettings"],
    queryFn: fetchProfileSettings,
  });

  useEffect(() => {
    if (dbProfile) {
      if (dbProfile.resume_url) setResumeLink(dbProfile.resume_url);
      if (dbProfile.linkedin_url) setLinkedLink(dbProfile.linkedin_url);
      if (dbProfile.github_url) setGithubLink(dbProfile.github_url);
      if (dbProfile.x_url) setXLink(dbProfile.x_url);
      if (dbProfile.email) setEmail(dbProfile.email);
      if (dbProfile.about_en) setAboutEn(dbProfile.about_en);
      if (dbProfile.about_ar) setAboutAr(dbProfile.about_ar);
    }
  }, [dbProfile]);

  const saveMutation = useMutation({
    mutationFn: updateProfileSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profileSettings"] });
      setSuccessMsg("Profile settings updated successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
    },
    onError: (err: Error) => {
      setErrorMsg(`Failed to save: ${err.message}`);
      setTimeout(() => setErrorMsg(""), 4000);
    },
  });

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingResume(true);
      const url = await uploadAssetFile(file, "resumes");
      setResumeLink(url);
    } catch (err: any) {
      alert(`Resume upload failed: ${err.message}`);
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    const payload: ProfileSettings = {
      resume_url: resumeLink.trim(),
      linkedin_url: linkedLink.trim(),
      github_url: githubLink.trim(),
      x_url: xLink.trim(),
      email: email.trim(),
      about_en: aboutEn.trim() || null,
      about_ar: aboutAr.trim() || null,
    };

    saveMutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FaSpinner size={24} className="animate-spin" style={{ color: "var(--color-muted)" }} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h2 className="font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>
          {t("manage.profile.title")}
        </h2>
        <p className="text-xs" style={{ color: "var(--color-muted)" }}>
          {t("manage.profile.subtitle")}
        </p>
      </div>

      {successMsg && (
        <div
          className="p-3.5 rounded-lg text-xs flex items-center gap-2 font-medium"
          style={{
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            color: "#10b981",
          }}
        >
          <FaCheck size={12} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div
          className="p-3.5 rounded-lg text-xs font-medium"
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            color: "#f87171",
          }}
        >
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Bio / About Me Section */}
        <div
          className="p-5 rounded-lg border flex flex-col gap-4"
          style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <FaUserEdit size={14} style={{ color: "var(--color-muted)" }} />
              <h3 className="font-bold text-xs uppercase tracking-wider font-mono" style={{ color: "var(--color-text)" }}>
                {t("manage.profile.bioHeading")}
              </h3>
            </div>

            <div className="flex items-center gap-1 p-1 rounded-lg border" style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}>
              <button
                type="button"
                onClick={() => setAboutTab("en")}
                className="px-3 py-1 text-[11px] font-bold rounded-lg transition-all"
                style={{
                  background: aboutTab === "en" ? "var(--color-primary)" : "transparent",
                  color: aboutTab === "en" ? "var(--color-bg)" : "var(--color-muted)",
                }}
              >
                {t("manage.lang.en")}
              </button>
              <button
                type="button"
                onClick={() => setAboutTab("ar")}
                className="px-3 py-1 text-[11px] font-bold rounded-lg transition-all"
                style={{
                  background: aboutTab === "ar" ? "var(--color-primary)" : "transparent",
                  color: aboutTab === "ar" ? "var(--color-bg)" : "var(--color-muted)",
                }}
              >
                {t("manage.lang.ar")}
              </button>
            </div>
          </div>

          {aboutTab === "en" ? (
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: "var(--color-muted)" }}>
                {t("manage.profile.bioEn")}
              </label>
              <textarea
                rows={4}
                value={aboutEn}
                onChange={(e) => setAboutEn(e.target.value)}
                placeholder="Over 6+ years of experience building modern web applications..."
                className="form-input leading-relaxed"
              />
            </div>
          ) : (
            <div dir="rtl">
              <label className="text-xs font-medium mb-1 block text-right" style={{ color: "var(--color-muted)" }}>
                {t("manage.profile.bioAr")}
              </label>
              <textarea
                rows={4}
                value={aboutAr}
                onChange={(e) => setAboutAr(e.target.value)}
                placeholder="أكثر من ٦ سنوات من الخبرة في بناء تطبيقات الويب الحديثة..."
                className="form-input leading-relaxed text-right"
              />
            </div>
          )}
        </div>

        {/* Resume Link & Upload */}
        <div
          className="p-5 rounded-lg border flex flex-col gap-3"
          style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          <div className="flex items-center gap-2">
            <FaDownload size={14} style={{ color: "var(--color-muted)" }} />
            <h3 className="font-bold text-xs uppercase tracking-wider font-mono" style={{ color: "var(--color-text)" }}>
              {t("manage.profile.cvHeading")}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="url"
              value={resumeLink}
              onChange={(e) => setResumeLink(e.target.value)}
              placeholder={t("manage.profile.resumePlaceholder")}
              className="form-input flex-1"
            />
            <label className="cursor-pointer flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-semibold border transition-all" style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)", color: "var(--color-text)" }}>
              {uploadingResume ? (
                <FaSpinner size={12} className="animate-spin" />
              ) : (
                <FaUpload size={12} />
              )}
              <span>{t("manage.profile.uploadPdf")}</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                disabled={uploadingResume}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Social Links */}
        <div
          className="p-5 rounded-lg border flex flex-col gap-4"
          style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          <h3 className="font-bold text-xs uppercase tracking-wider font-mono" style={{ color: "var(--color-text)" }}>
            {t("manage.profile.socialHeading")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium mb-1 flex items-center gap-2" style={{ color: "var(--color-muted)" }}>
                <FaLinkedin size={12} /> {t("manage.profile.linkedin")}
              </label>
              <input
                type="url"
                value={linkedLink}
                onChange={(e) => setLinkedLink(e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label className="text-xs font-medium mb-1 flex items-center gap-2" style={{ color: "var(--color-muted)" }}>
                <FaGithub size={12} /> {t("manage.profile.github")}
              </label>
              <input
                type="url"
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label className="text-xs font-medium mb-1 flex items-center gap-2" style={{ color: "var(--color-muted)" }}>
                <FaSquareXTwitter size={12} /> {t("manage.profile.x")}
              </label>
              <input
                type="url"
                value={xLink}
                onChange={(e) => setXLink(e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label className="text-xs font-medium mb-1 flex items-center gap-2" style={{ color: "var(--color-muted)" }}>
                <FaEnvelope size={12} /> {t("manage.profile.email")}
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mailto:name@domain.com"
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saveMutation.isPending}
          className="btn-primary self-start flex items-center gap-2 px-7 py-3 rounded-lg text-xs font-semibold shadow-sm"
        >
          {saveMutation.isPending ? (
            <FaSpinner size={13} className="animate-spin" />
          ) : (
            <FaSave size={13} />
          )}
          <span>{t("manage.profile.saveBtn")}</span>
        </button>
      </form>
    </div>
  );
}
