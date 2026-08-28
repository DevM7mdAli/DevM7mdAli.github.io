import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  fetchAdminSkills,
  fetchAdminSkillGroups,
  createSkill,
  updateSkill,
  deleteSkill,
  uploadAssetFile,
  type Skill,
  type SkillPayload,
} from "../../lib/supabase";
import { iconRegistry, iconRegistryKeys } from "../../lib/iconRegistry";
import SkillIcon from "../Skills/SkillIcon";
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaTimes, FaUpload, FaEyeSlash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const BLANK: SkillPayload = {
  name: "",
  group_id: null,
  icon_key: null,
  icon_url: null,
  color: "#94a3b8",
  sort_order: 0,
  is_visible: true,
};

export default function SkillsManager() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [form, setForm] = useState<SkillPayload>(BLANK);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState("");

  const { data: skills = [], isLoading } = useQuery({
    queryKey: ["admin-skills"],
    queryFn: fetchAdminSkills,
  });
  const { data: groups = [] } = useQuery({
    queryKey: ["admin-skill-groups"],
    queryFn: fetchAdminSkillGroups,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-skills"] });
    queryClient.invalidateQueries({ queryKey: ["skills"] });
  };

  const createMutation = useMutation({
    mutationFn: createSkill,
    onSuccess: () => {
      invalidate();
      closeModal();
    },
    onError: (err: Error) => setFormError(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: SkillPayload }) =>
      updateSkill(id, payload),
    onSuccess: () => {
      invalidate();
      closeModal();
    },
    onError: (err: Error) => setFormError(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => {
      invalidate();
      setDeleteConfirmId(null);
    },
  });

  const openModal = (skill?: Skill) => {
    setFormError("");
    if (skill) {
      setEditing(skill);
      setForm({
        name: skill.name,
        group_id: skill.group_id,
        icon_key: skill.icon_key,
        icon_url: skill.icon_url,
        color: skill.color,
        sort_order: skill.sort_order,
        is_visible: skill.is_visible,
      });
    } else {
      setEditing(null);
      setForm({ ...BLANK, group_id: groups[0]?.id ?? null });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
    setFormError("");
  };

  const set = <K extends keyof SkillPayload>(key: K, value: SkillPayload[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      setFormError("");
      const url = await uploadAssetFile(file, "skills");
      setForm((f) => ({ ...f, icon_url: url }));
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) {
      setFormError(t("manage.skills.errNameRequired"));
      return;
    }
    const iconKey = form.icon_key?.trim() || null;
    if (!iconKey && !form.icon_url) {
      setFormError(t("manage.skills.errIconRequired"));
      return;
    }
    if (iconKey && !(iconKey in iconRegistry) && !form.icon_url) {
      setFormError(t("manage.skills.errUnknownKey", { key: iconKey }));
      return;
    }

    const payload: SkillPayload = { ...form, name, icon_key: iconKey };
    if (editing) updateMutation.mutate({ id: editing.id, payload });
    else createMutation.mutate(payload);
  };

  // Preview mirrors exactly what the carousel will resolve.
  const preview: Skill = {
    id: "preview",
    name: form.name || "??",
    group_id: form.group_id,
    icon_key: form.icon_key,
    icon_url: form.icon_url,
    color: form.color,
    sort_order: form.sort_order,
    is_visible: form.is_visible,
  };

  const grouped = groups.map((g) => ({
    group: g,
    items: skills
      .filter((s) => s.group_id === g.id)
      .sort((a, b) => a.sort_order - b.sort_order),
  }));
  const ungrouped = skills.filter((s) => s.group_id == null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>
            {t("manage.skills.title")}
          </h2>
          <p className="text-xs" style={{ color: "var(--color-muted)" }}>
            {t("manage.skills.subtitle")}
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn-primary flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs"
        >
          <FaPlus size={12} />
          <span>{t("manage.skills.addNew")}</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <FaSpinner size={24} className="animate-spin" style={{ color: "var(--color-muted)" }} />
        </div>
      ) : skills.length === 0 ? (
        <div
          className="rounded-2xl border p-12 text-center flex flex-col items-center gap-3"
          style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          <p className="text-sm" style={{ color: "var(--color-muted)" }}>
            {t("manage.skills.empty")}
          </p>
          <button onClick={() => openModal()} className="text-xs font-semibold hover:underline">
            {t("manage.skills.createFirst")}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {[...grouped, { group: null, items: ungrouped }].map(({ group, items }) => {
            if (items.length === 0) return null;
            return (
              <div key={group?.id ?? "ungrouped"} className="flex flex-col gap-3">
                <div className="flex items-baseline gap-3">
                  <span className="section-label">
                    {group ? group.name : t("manage.skills.ungrouped")}
                  </span>
                  {group && (
                    <span
                      className="text-[11px]"
                      style={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}
                    >
                      {group.direction} · {group.speed_s}s
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {items.map((skill) => (
                    <div
                      key={skill.id}
                      className="rounded-xl border p-3 flex items-center gap-3"
                      style={{
                        background: "var(--color-surface)",
                        borderColor: "var(--color-border)",
                        opacity: skill.is_visible ? 1 : 0.5,
                      }}
                    >
                      <SkillIcon skill={skill} size={26} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold truncate">{skill.name}</span>
                          {!skill.is_visible && (
                            <FaEyeSlash size={10} style={{ color: "var(--color-muted)" }} />
                          )}
                        </div>
                        <span
                          className="text-[10px] truncate block"
                          style={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}
                        >
                          {skill.icon_key && skill.icon_key in iconRegistry
                            ? skill.icon_key
                            : skill.icon_url
                              ? t("manage.skills.uploadedIcon")
                              : t("manage.skills.missingIcon")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openModal(skill)}
                          className="p-1.5 rounded-lg border"
                          style={{
                            borderColor: "var(--color-border)",
                            background: "var(--color-surface-2)",
                            color: "var(--color-text)",
                          }}
                          title={t("manage.projects.edit")}
                        >
                          <FaEdit size={10} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(skill.id)}
                          className="p-1.5 rounded-lg border"
                          style={{
                            borderColor: "rgba(239, 68, 68, 0.2)",
                            background: "rgba(239, 68, 68, 0.08)",
                            color: "#f87171",
                          }}
                          title={t("manage.projects.delete")}
                        >
                          <FaTrash size={10} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="w-full max-w-lg rounded-2xl border shadow-2xl my-8"
              style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
            >
              <div
                className="flex items-center justify-between p-5 border-b"
                style={{ borderColor: "var(--color-border)" }}
              >
                <h3 className="font-bold" style={{ fontFamily: "var(--font-display)" }}>
                  {editing ? t("manage.skills.editTitle") : t("manage.skills.createTitle")}
                </h3>
                <button onClick={closeModal} style={{ color: "var(--color-muted)" }}>
                  <FaTimes size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
                {formError && (
                  <div
                    className="p-3 rounded-xl text-xs leading-relaxed"
                    style={{
                      background: "rgba(239, 68, 68, 0.1)",
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                      color: "#f87171",
                    }}
                  >
                    {formError}
                  </div>
                )}

                {/* Live preview — resolves exactly as the carousel does */}
                <div
                  className="flex items-center gap-4 p-4 rounded-xl border"
                  style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}
                >
                  <SkillIcon skill={preview} size={38} />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold">{form.name || "—"}</span>
                    <span
                      className="text-[10px]"
                      style={{ color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}
                    >
                      {form.icon_key && form.icon_key in iconRegistry
                        ? t("manage.skills.sourceRegistry")
                        : form.icon_url
                          ? t("manage.skills.sourceUpload")
                          : t("manage.skills.sourceNone")}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: "var(--color-muted)" }}>
                      {t("manage.skills.name")} *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="e.g. TypeScript"
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: "var(--color-muted)" }}>
                      {t("manage.skills.group")}
                    </label>
                    <select
                      value={form.group_id ?? ""}
                      onChange={(e) => set("group_id", e.target.value ? Number(e.target.value) : null)}
                      className="form-input"
                    >
                      <option value="">{t("manage.skills.ungrouped")}</option>
                      {groups.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Icon: registry key first, upload as the no-deploy fallback */}
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: "var(--color-muted)" }}>
                    {t("manage.skills.iconKey")}
                  </label>
                  <input
                    type="text"
                    list="skill-icon-keys"
                    value={form.icon_key ?? ""}
                    onChange={(e) => set("icon_key", e.target.value || null)}
                    placeholder="SiTypescript"
                    className="form-input"
                    dir="ltr"
                  />
                  <datalist id="skill-icon-keys">
                    {iconRegistryKeys.map((k) => (
                      <option key={k} value={k} />
                    ))}
                  </datalist>
                  <p className="text-[11px] mt-1" style={{ color: "var(--color-muted)" }}>
                    {t("manage.skills.iconKeyHint")}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: "var(--color-muted)" }}>
                    {t("manage.skills.iconUpload")}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={form.icon_url ?? ""}
                      onChange={(e) => set("icon_url", e.target.value || null)}
                      placeholder="https://…/icon.svg"
                      className="form-input flex-1"
                      dir="ltr"
                    />
                    <label
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border cursor-pointer whitespace-nowrap"
                      style={{
                        background: "var(--color-surface-2)",
                        borderColor: "var(--color-border)",
                        color: "var(--color-text)",
                      }}
                    >
                      {uploading ? <FaSpinner size={12} className="animate-spin" /> : <FaUpload size={12} />}
                      <span>{t("manage.skills.uploadSvg")}</span>
                      <input
                        type="file"
                        accept="image/svg+xml,image/png"
                        onChange={handleIconUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-[11px] mt-1" style={{ color: "var(--color-muted)" }}>
                    {t("manage.skills.iconUploadHint")}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: "var(--color-muted)" }}>
                      {t("manage.skills.color")}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={form.color}
                        onChange={(e) => set("color", e.target.value)}
                        className="w-10 h-10 rounded-lg border cursor-pointer bg-transparent"
                        style={{ borderColor: "var(--color-border)" }}
                      />
                      <input
                        type="text"
                        value={form.color}
                        onChange={(e) => set("color", e.target.value)}
                        className="form-input flex-1"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: "var(--color-muted)" }}>
                      {t("manage.skills.sortOrder")}
                    </label>
                    <input
                      type="number"
                      value={form.sort_order}
                      onChange={(e) => set("sort_order", Number(e.target.value) || 0)}
                      className="form-input"
                    />
                  </div>

                  <div className="flex items-end pb-2">
                    <label
                      className="flex items-center gap-2 cursor-pointer text-xs"
                      style={{ color: "var(--color-muted)" }}
                    >
                      <input
                        type="checkbox"
                        checked={form.is_visible}
                        onChange={(e) => set("is_visible", e.target.checked)}
                        className="rounded"
                      />
                      <span>{t("manage.skills.visible")}</span>
                    </label>
                  </div>
                </div>

                <div
                  className="flex items-center justify-end gap-3 border-t pt-4 mt-2"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {t("manage.projects.cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold"
                  >
                    {(createMutation.isPending || updateMutation.isPending) && (
                      <FaSpinner size={12} className="animate-spin" />
                    )}
                    <span>{editing ? t("manage.skills.update") : t("manage.skills.save")}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl p-6 flex flex-col gap-4 border shadow-2xl"
              style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
            >
              <h3 className="font-bold text-lg text-rose-400">{t("manage.skills.deleteTitle")}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--color-muted)" }}>
                {t("manage.skills.deleteMessage")}
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold"
                  style={{ color: "var(--color-muted)" }}
                >
                  {t("manage.projects.cancel")}
                </button>
                <button
                  onClick={() => deleteMutation.mutate(deleteConfirmId)}
                  disabled={deleteMutation.isPending}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold"
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
