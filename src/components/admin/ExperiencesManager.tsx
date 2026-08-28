import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  fetchAdminExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  uploadAssetFile,
  slugify,
  type Experience,
  type ExperiencePayload,
} from "../../lib/supabase";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaUpload,
  FaSpinner,
  FaTimes,
  FaBriefcase,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

/* `date` columns need a full ISO date; <input type="month"> gives YYYY-MM.
   Existing rows are all stored on the 1st, so that's the convention. */
const toMonthInput = (iso: string | null | undefined) => (iso ? iso.slice(0, 7) : "");
const toIsoDate = (month: string) => (month ? `${month}-01` : "");

export default function ExperiencesManager() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [activeTab, setActiveTab] = useState<"en" | "ar">("en");
  const [companyName, setCompanyName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [roleEn, setRoleEn] = useState("");
  const [roleAr, setRoleAr] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descAr, setDescAr] = useState("");
  const [locationEn, setLocationEn] = useState("");
  const [locationAr, setLocationAr] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [formError, setFormError] = useState("");

  const { data: experiences = [], isLoading } = useQuery({
    queryKey: ["admin-experiences"],
    queryFn: fetchAdminExperiences,
  });

  const createMutation = useMutation({
    mutationFn: createExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-experiences"] });
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      closeModal();
    },
    onError: (err: Error) => setFormError(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ExperiencePayload }) =>
      updateExperience(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-experiences"] });
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      closeModal();
    },
    onError: (err: Error) => setFormError(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-experiences"] });
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      setDeleteConfirmId(null);
    },
  });

  const openModal = (exp?: Experience) => {
    setFormError("");
    if (exp) {
      setEditingExperience(exp);
      setCompanyName(exp.company_name);
      setLogoUrl(exp.company_logo_url || "");
      setRoleEn(exp.role_en || exp.role || "");
      setRoleAr(exp.role_ar || exp.role || "");
      setDescEn(exp.description_en || exp.description || "");
      setDescAr(exp.description_ar || exp.description || "");
      setLocationEn(exp.location_en || exp.location || "");
      setLocationAr(exp.location_ar || exp.location || "");
      setStartDate(toMonthInput(exp.start_date));
      setEndDate(toMonthInput(exp.end_date));
      setIsCurrent(exp.is_current || false);
      setSlug(exp.slug || "");
      setSlugTouched(true);
    } else {
      setEditingExperience(null);
      setCompanyName("");
      setLogoUrl("");
      setRoleEn("");
      setRoleAr("");
      setDescEn("");
      setDescAr("");
      setLocationEn("");
      setLocationAr("");
      setStartDate("");
      setEndDate("");
      setIsCurrent(false);
      setSlug("");
      setSlugTouched(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExperience(null);
    setFormError("");
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingLogo(true);
      const url = await uploadAssetFile(file, "companies");
      setLogoUrl(url);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      setFormError("Company name is required.");
      return;
    }
    if (!roleEn.trim() && !roleAr.trim()) {
      setFormError("Role / Job title is required in at least one language.");
      return;
    }
    if (!startDate.trim()) {
      setFormError("Start date is required.");
      return;
    }

    const finalSlug =
      (slugTouched ? slugify(slug) : "") ||
      slugify(`${companyName} ${roleEn || roleAr}`);
    if (!finalSlug) {
      setFormError("Could not build a URL slug. Add a company name or set one manually.");
      return;
    }

    const payload: ExperiencePayload = {
      slug: finalSlug,
      company_name: companyName.trim(),
      company_logo_url: logoUrl.trim() || null,
      role_en: roleEn.trim() || roleAr.trim(),
      role_ar: roleAr.trim() || roleEn.trim(),
      description_en: descEn.trim() || descAr.trim() || null,
      description_ar: descAr.trim() || descEn.trim() || null,
      location_en: locationEn.trim() || locationAr.trim() || null,
      location_ar: locationAr.trim() || locationEn.trim() || null,
      start_date: toIsoDate(startDate.trim()),
      end_date: isCurrent ? null : toIsoDate(endDate.trim()) || null,
      is_current: isCurrent,
    };

    if (editingExperience) {
      updateMutation.mutate({ id: editingExperience.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>
            {t("manage.experience.title")}
          </h2>
          <p className="text-xs" style={{ color: "var(--color-muted)" }}>
            {t("manage.experience.subtitle")}
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="btn-primary flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-xs transition-all"
        >
          <FaPlus size={12} />
          <span>{t("manage.experience.addNew")}</span>
        </button>
      </div>

      {/* Experience List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <FaSpinner size={24} className="animate-spin" style={{ color: "var(--color-muted)" }} />
        </div>
      ) : experiences.length === 0 ? (
        <div
          className="rounded-lg p-12 text-center border flex flex-col items-center justify-center gap-3"
          style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
        >
          <FaBriefcase size={28} style={{ color: "var(--color-muted)" }} />
          <p className="text-sm" style={{ color: "var(--color-muted)" }}>
            {t("manage.experience.noExperience")}
          </p>
          <button
            onClick={() => openModal()}
            className="text-xs font-semibold hover:underline"
            style={{ color: "var(--color-text)" }}
          >
            {t("manage.experience.createFirst")}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="p-5 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
              style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-lg border flex items-center justify-center overflow-hidden flex-shrink-0"
                  style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}
                >
                  {exp.company_logo_url ? (
                    <img src={exp.company_logo_url} alt={exp.company_name} className="w-full h-full object-cover" />
                  ) : (
                    <FaBriefcase size={16} style={{ color: "var(--color-muted)" }} />
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-base" style={{ fontFamily: "var(--font-display)" }}>
                      {exp.role}
                    </h3>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border"
                      style={{
                        background: "var(--color-surface-2)",
                        borderColor: "var(--color-border)",
                        color: "var(--color-text)",
                      }}
                    >
                      @{exp.company_name}
                    </span>
                    {exp.is_current && (
                      <span
                        className="px-2 py-0.5 rounded-md text-[9px] font-bold font-mono border"
                        style={{
                          background: "rgba(16, 185, 129, 0.1)",
                          borderColor: "rgba(16, 185, 129, 0.2)",
                          color: "#10b981",
                        }}
                      >
                        CURRENT
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono" style={{ color: "var(--color-muted)" }}>
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt size={11} />
                      {exp.start_date} — {exp.is_current ? "Present" : exp.end_date || "N/A"}
                    </span>
                    {exp.location && (
                      <span className="flex items-center gap-1">
                        <FaMapMarkerAlt size={11} />
                        {exp.location}
                      </span>
                    )}
                  </div>

                  {exp.description && (
                    <p className="text-xs line-clamp-2 leading-relaxed mt-1" style={{ color: "var(--color-muted)" }}>
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => openModal(exp)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                  style={{
                    borderColor: "var(--color-border)",
                    background: "var(--color-surface-2)",
                    color: "var(--color-text)",
                  }}
                >
                  <FaEdit size={12} />
                  <span>{t("manage.projects.edit")}</span>
                </button>
                <button
                  onClick={() => setDeleteConfirmId(exp.id)}
                  className="p-2 rounded-lg text-xs border transition-all"
                  style={{
                    borderColor: "rgba(239, 68, 68, 0.2)",
                    background: "rgba(239, 68, 68, 0.08)",
                    color: "#f87171",
                  }}
                  title="Delete Experience"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-lg p-6 my-8 flex flex-col gap-5 border shadow-sm max-h-[90vh] overflow-y-auto"
              style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
            >
              <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "var(--color-border)" }}>
                <h3 className="font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>
                  {editingExperience ? t("manage.experience.editTitle") : t("manage.experience.createTitle")}
                </h3>
                <button onClick={closeModal} className="p-2 rounded-lg text-xs" style={{ color: "var(--color-muted)" }}>
                  <FaTimes size={16} />
                </button>
              </div>

              {formError && (
                <div
                  className="p-3.5 rounded-lg text-xs"
                  style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#f87171" }}
                >
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: "var(--color-muted)" }}>
                      {t("manage.experience.companyName")} *
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Acme Corp"
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: "var(--color-muted)" }}>
                      {t("manage.experience.slug")}
                    </label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => {
                        setSlug(e.target.value);
                        setSlugTouched(true);
                      }}
                      placeholder={
                        slugify(`${companyName} ${roleEn || roleAr}`) || "acme-corp-engineer"
                      }
                      className="form-input"
                      dir="ltr"
                    />
                    <p className="text-[11px] mt-1" style={{ color: "var(--color-muted)" }}>
                      {t("manage.experience.slugHint")}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: "var(--color-muted)" }}>
                      {t("manage.experience.companyLogo")}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        placeholder="https://... or upload logo"
                        className="form-input flex-1"
                      />
                      <label className="cursor-pointer flex items-center gap-2 px-3 py-3 rounded-lg text-xs font-semibold border transition-all" style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)", color: "var(--color-text)" }}>
                        {uploadingLogo ? (
                          <FaSpinner size={12} className="animate-spin" />
                        ) : (
                          <FaUpload size={12} />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          disabled={uploadingLogo}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: "var(--color-muted)" }}>
                      {t("manage.experience.startDate")} *
                    </label>
                    <input
                      type="month"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: "var(--color-muted)" }}>
                      {t("manage.experience.endDate")}
                    </label>
                    <input
                      type="month"
                      disabled={isCurrent}
                      value={isCurrent ? "" : endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="form-input"
                    />
                    <label className="flex items-center gap-2 mt-2 cursor-pointer text-xs" style={{ color: "var(--color-muted)" }}>
                      <input
                        type="checkbox"
                        checked={isCurrent}
                        onChange={(e) => setIsCurrent(e.target.checked)}
                        className="rounded"
                      />
                      <span>{t("manage.experience.currentlyWorkHere")}</span>
                    </label>
                  </div>
                </div>

                {/* Language Tabs */}
                <div className="flex items-center gap-2 p-1 rounded-lg border" style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}>
                  <button
                    type="button"
                    onClick={() => setActiveTab("en")}
                    className="flex-1 py-2 text-xs font-bold rounded-lg transition-all"
                    style={{
                      background: activeTab === "en" ? "var(--color-primary)" : "transparent",
                      color: activeTab === "en" ? "var(--color-bg)" : "var(--color-muted)",
                    }}
                  >
                    {t("manage.lang.en")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("ar")}
                    className="flex-1 py-2 text-xs font-bold rounded-lg transition-all"
                    style={{
                      background: activeTab === "ar" ? "var(--color-primary)" : "transparent",
                      color: activeTab === "ar" ? "var(--color-bg)" : "var(--color-muted)",
                    }}
                  >
                    {t("manage.lang.ar")}
                  </button>
                </div>

                {activeTab === "en" ? (
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="text-xs font-medium mb-1 block" style={{ color: "var(--color-muted)" }}>
                        {t("manage.experience.roleEn")} *
                      </label>
                      <input
                        type="text"
                        value={roleEn}
                        onChange={(e) => setRoleEn(e.target.value)}
                        placeholder="e.g. Senior Software Engineer"
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block" style={{ color: "var(--color-muted)" }}>
                        {t("manage.experience.locationEn")}
                      </label>
                      <input
                        type="text"
                        value={locationEn}
                        onChange={(e) => setLocationEn(e.target.value)}
                        placeholder="e.g. Riyadh, Saudi Arabia / Remote"
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block" style={{ color: "var(--color-muted)" }}>
                        {t("manage.experience.descEn")}
                      </label>
                      <textarea
                        rows={3}
                        value={descEn}
                        onChange={(e) => setDescEn(e.target.value)}
                        placeholder="Key responsibilities and achievements..."
                        className="form-input"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4" dir="rtl">
                    <div>
                      <label className="text-xs font-medium mb-1 block text-right" style={{ color: "var(--color-muted)" }}>
                        {t("manage.experience.roleAr")} *
                      </label>
                      <input
                        type="text"
                        value={roleAr}
                        onChange={(e) => setRoleAr(e.target.value)}
                        placeholder="مثال: مهندس برمجيات أول"
                        className="form-input text-right"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block text-right" style={{ color: "var(--color-muted)" }}>
                        {t("manage.experience.locationAr")}
                      </label>
                      <input
                        type="text"
                        value={locationAr}
                        onChange={(e) => setLocationAr(e.target.value)}
                        placeholder="مثال: الرياض، المملكة العربية السعودية"
                        className="form-input text-right"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block text-right" style={{ color: "var(--color-muted)" }}>
                        {t("manage.experience.descAr")}
                      </label>
                      <textarea
                        rows={3}
                        value={descAr}
                        onChange={(e) => setDescAr(e.target.value)}
                        placeholder="أبرز المهام والإنجازات..."
                        className="form-input text-right"
                      />
                    </div>
                  </div>
                )}

                {/* Submit Actions */}
                <div className="flex items-center justify-end gap-3 border-t pt-4 mt-2" style={{ borderColor: "var(--color-border)" }}>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2.5 rounded-lg text-xs font-semibold"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {t("manage.projects.cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold"
                  >
                    {(createMutation.isPending || updateMutation.isPending) && (
                      <FaSpinner size={12} className="animate-spin" />
                    )}
                    <span>{editingExperience ? t("manage.experience.update") : t("manage.experience.save")}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-lg p-6 flex flex-col gap-4 border shadow-sm"
              style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
            >
              <h3 className="font-bold text-lg text-rose-400">
                {t("manage.experience.deleteTitle")}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--color-muted)" }}>
                {t("manage.experience.deleteMessage")}
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold"
                  style={{ color: "var(--color-muted)" }}
                >
                  {t("manage.projects.cancel")}
                </button>
                <button
                  onClick={() => deleteMutation.mutate(deleteConfirmId)}
                  disabled={deleteMutation.isPending}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold"
                  style={{ background: "#dc2626", color: "#ffffff" }}
                >
                  {deleteMutation.isPending && <FaSpinner size={12} className="animate-spin" />}
                  <span>{t("manage.projects.delete")}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
