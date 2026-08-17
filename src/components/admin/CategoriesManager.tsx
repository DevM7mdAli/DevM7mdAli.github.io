import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type ProjectCategory,
} from "../../lib/supabase";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaSpinner,
  FaTimes,
  FaFolder,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function CategoriesManager() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProjectCategory | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [formError, setFormError] = useState("");

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const createMutation = useMutation({
    mutationFn: ({ en, ar }: { en: string; ar: string }) => createCategory(en, ar),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      closeModal();
    },
    onError: (err: Error) => setFormError(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, en, ar }: { id: string; en: string; ar: string }) =>
      updateCategory(id, en, ar),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      closeModal();
    },
    onError: (err: Error) => setFormError(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      setDeleteConfirmId(null);
    },
  });

  const openModal = (category?: ProjectCategory) => {
    setFormError("");
    if (category) {
      setEditingCategory(category);
      setNameEn(category.name_en || category.name || "");
      setNameAr(category.name_ar || category.name || "");
    } else {
      setEditingCategory(null);
      setNameEn("");
      setNameAr("");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn.trim() && !nameAr.trim()) {
      setFormError("Category name is required in at least one language.");
      return;
    }

    const en = nameEn.trim() || nameAr.trim();
    const ar = nameAr.trim() || nameEn.trim();

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, en, ar });
    } else {
      createMutation.mutate({ en, ar });
    }
  };

  const filteredCategories = categories.filter((cat) => {
    const query = search.toLowerCase();
    const displayName = cat.name_en || cat.name_ar || cat.name || cat.slug || "";
    return displayName.toLowerCase().includes(query) || cat.slug.toLowerCase().includes(query);
  });

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <FaSearch size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--color-muted)" }} />
          <input
            type="text"
            placeholder={t("manage.categories.searchPlaceholder")}
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
          <span>{t("manage.categories.addNew")}</span>
        </button>
      </div>

      {/* Categories List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <FaSpinner size={24} className="animate-spin" style={{ color: "var(--color-muted)" }} />
        </div>
      ) : filteredCategories.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center border flex flex-col items-center justify-center gap-3"
          style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
        >
          <FaFolder size={28} style={{ color: "var(--color-muted)" }} />
          <p className="text-sm" style={{ color: "var(--color-muted)" }}>
            {t("manage.categories.noCategories")}
          </p>
          <button
            onClick={() => openModal()}
            className="text-xs font-semibold hover:underline"
            style={{ color: "var(--color-text)" }}
          >
            {t("manage.categories.createFirst")}
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
                <th className="p-4 font-semibold">{t("manage.categories.nameEn")}</th>
                <th className="p-4 font-semibold">{t("manage.categories.nameAr")}</th>
                <th className="p-4 font-semibold">Slug</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--color-border)" }}>
              {filteredCategories.map((cat) => (
                <tr key={cat.id} className="transition-colors hover:bg-black/5 dark:hover:bg-white/5">
                  <td className="p-4 font-semibold" style={{ color: "var(--color-text)" }}>
                    {cat.name_en || cat.name || cat.slug}
                  </td>
                  <td className="p-4 font-semibold" style={{ color: "var(--color-text)" }} dir="rtl">
                    {cat.name_ar || cat.name_en || cat.name}
                  </td>
                  <td className="p-4 font-mono" style={{ color: "var(--color-muted)" }}>
                    <span className="px-2 py-0.5 rounded border text-[11px]" style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}>
                      {cat.slug}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openModal(cat)}
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
                        onClick={() => setDeleteConfirmId(cat.id)}
                        className="p-1.5 rounded-lg text-xs border transition-all"
                        style={{
                          borderColor: "rgba(239, 68, 68, 0.2)",
                          background: "rgba(239, 68, 68, 0.08)",
                          color: "#f87171",
                        }}
                        title="Delete Category"
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
                  {editingCategory ? t("manage.categories.editTitle") : t("manage.categories.createTitle")}
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
                    {t("manage.categories.nameEn")} *
                  </label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. Web Development, Mobile Apps"
                    className="form-input"
                  />
                </div>

                <div dir="rtl">
                  <label className="text-xs font-medium mb-1 block text-right" style={{ color: "var(--color-muted)" }}>
                    {t("manage.categories.nameAr")} *
                  </label>
                  <input
                    type="text"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="مثال: تطوير الويب، تطبيقات الجوال"
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
                    <span>{editingCategory ? t("manage.categories.update") : t("manage.categories.save")}</span>
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
                {t("manage.categories.deleteTitle")}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--color-muted)" }}>
                {t("manage.categories.deleteMessage")}
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
