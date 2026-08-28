import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  fetchTags,
  createTag,
  updateTag,
  deleteTag,
  type Tag,
} from "../../lib/supabase";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaSpinner,
  FaTimes,
  FaTag,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function TagsManager() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Form State
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [formError, setFormError] = useState("");

  const { data: tags = [], isLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
  });

  const createMutation = useMutation({
    mutationFn: ({ en, ar }: { en: string; ar: string }) => createTag(en, ar),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      closeModal();
    },
    onError: (err: Error) => setFormError(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, en, ar }: { id: number; en: string; ar: string }) =>
      updateTag(id, en, ar),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      closeModal();
    },
    onError: (err: Error) => setFormError(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      setDeleteConfirmId(null);
    },
  });

  const openModal = (tag?: Tag) => {
    setFormError("");
    if (tag) {
      setEditingTag(tag);
      setNameEn(tag.name_en || tag.name || "");
      setNameAr(tag.name_ar || tag.name || "");
    } else {
      setEditingTag(null);
      setNameEn("");
      setNameAr("");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTag(null);
    setFormError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn.trim() && !nameAr.trim()) {
      setFormError("Tag name is required in at least one language.");
      return;
    }

    const en = nameEn.trim() || nameAr.trim();
    const ar = nameAr.trim() || nameEn.trim();

    if (editingTag) {
      updateMutation.mutate({ id: editingTag.id, en, ar });
    } else {
      createMutation.mutate({ en, ar });
    }
  };

  const filteredTags = tags.filter((tagItem) => {
    const query = search.toLowerCase();
    const displayName = tagItem.name_en || tagItem.name_ar || tagItem.name || tagItem.slug || "";
    return displayName.toLowerCase().includes(query) || tagItem.slug.toLowerCase().includes(query);
  });

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <FaSearch size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--color-muted)" }} />
          <input
            type="text"
            placeholder={t("manage.tags.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-10"
          />
        </div>

        <button
          onClick={() => openModal()}
          className="btn-primary flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs transition-all"
        >
          <FaPlus size={12} />
          <span>{t("manage.tags.addNew")}</span>
        </button>
      </div>

      {/* Tags List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <FaSpinner size={24} className="animate-spin" style={{ color: "var(--color-muted)" }} />
        </div>
      ) : filteredTags.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center border flex flex-col items-center justify-center gap-3"
          style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
        >
          <FaTag size={28} style={{ color: "var(--color-muted)" }} />
          <p className="text-sm" style={{ color: "var(--color-muted)" }}>
            {t("manage.tags.noTags")}
          </p>
          <button
            onClick={() => openModal()}
            className="text-xs font-semibold hover:underline"
            style={{ color: "var(--color-text)" }}
          >
            {t("manage.tags.createFirst")}
          </button>
        </div>
      ) : (
        <div
          className="rounded-2xl border overflow-hidden shadow-sm"
          style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          <table className="w-full text-left text-xs">
            <thead className="border-b font-mono" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-2)", color: "var(--color-muted)" }}>
              <tr>
                <th className="p-4 font-semibold">{t("manage.tags.nameEn")}</th>
                <th className="p-4 font-semibold">{t("manage.tags.nameAr")}</th>
                <th className="p-4 font-semibold">Slug</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--color-border)" }}>
              {filteredTags.map((tagItem) => (
                <tr key={tagItem.id} className="transition-colors hover:bg-black/5 dark:hover:bg-white/5">
                  <td className="p-4 font-semibold" style={{ color: "var(--color-text)" }}>
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono border"
                      style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
                    >
                      <FaTag size={10} style={{ color: "var(--color-muted)" }} />
                      {tagItem.name_en || tagItem.name || tagItem.slug}
                    </span>
                  </td>
                  <td className="p-4 font-semibold" style={{ color: "var(--color-text)" }} dir="rtl">
                    {tagItem.name_ar || tagItem.name_en || tagItem.name}
                  </td>
                  <td className="p-4 font-mono" style={{ color: "var(--color-muted)" }}>
                    <span className="px-2 py-0.5 rounded border text-[11px]" style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}>
                      {tagItem.slug}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openModal(tagItem)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                        style={{
                          borderColor: "var(--color-border)",
                          background: "var(--color-surface-2)",
                          color: "var(--color-text)",
                        }}
                      >
                        <FaEdit size={11} />
                        <span>{t("manage.projects.edit")}</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(tagItem.id)}
                        className="p-1.5 rounded-lg text-xs border transition-all"
                        style={{
                          borderColor: "rgba(239, 68, 68, 0.2)",
                          background: "rgba(239, 68, 68, 0.08)",
                          color: "#f87171",
                        }}
                        title="Delete Tag"
                      >
                        <FaTrash size={11} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl p-6 flex flex-col gap-5 border shadow-2xl"
              style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
            >
              <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "var(--color-border)" }}>
                <h3 className="font-bold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {editingTag ? t("manage.tags.editTitle") : t("manage.tags.createTitle")}
                </h3>
                <button onClick={closeModal} className="p-2 rounded-lg text-xs" style={{ color: "var(--color-muted)" }}>
                  <FaTimes size={16} />
                </button>
              </div>

              {formError && (
                <div
                  className="p-3.5 rounded-xl text-xs"
                  style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#f87171" }}
                >
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: "var(--color-muted)" }}>
                    {t("manage.tags.nameEn")} *
                  </label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. React, TypeScript, Tailwind"
                    className="form-input"
                  />
                </div>

                <div dir="rtl">
                  <label className="text-xs font-medium mb-1 block text-right" style={{ color: "var(--color-muted)" }}>
                    {t("manage.tags.nameAr")} *
                  </label>
                  <input
                    type="text"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="مثال: رياكت، تايب سكريبت"
                    className="form-input text-right"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 border-t pt-4 mt-2" style={{ borderColor: "var(--color-border)" }}>
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
                    <span>{editingTag ? t("manage.tags.update") : t("manage.tags.save")}</span>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl p-6 flex flex-col gap-4 border shadow-2xl"
              style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
            >
              <h3 className="font-bold text-lg text-rose-400">
                {t("manage.tags.deleteTitle")}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--color-muted)" }}>
                {t("manage.tags.deleteMessage")}
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
