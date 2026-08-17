import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  fetchAdminProjects,
  fetchCategories,
  fetchTags,
  createProject,
  updateProject,
  deleteProject,
  createCategory,
  createTag,
  uploadAssetFile,
  type Project,
  type CreateProjectPayload,
} from "../../lib/supabase";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaUpload,
  FaExternalLinkAlt,
  FaGithub,
  FaSpinner,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectsManager() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [activeTab, setActiveTab] = useState<"en" | "ar">("en");
  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descAr, setDescAr] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Inline Category / Tag Creation State
  const [newCatEn, setNewCatEn] = useState("");
  const [newCatAr, setNewCatAr] = useState("");
  const [showAddCat, setShowAddCat] = useState(false);

  const [newTagEn, setNewTagEn] = useState("");
  const [newTagAr, setNewTagAr] = useState("");
  const [showAddTag, setShowAddTag] = useState(false);

  const [formError, setFormError] = useState("");

  // Queries
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: fetchAdminProjects,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      closeModal();
    },
    onError: (err: Error) => setFormError(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreateProjectPayload }) =>
      updateProject(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      closeModal();
    },
    onError: (err: Error) => setFormError(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setDeleteConfirmId(null);
    },
  });

  const categoryMutation = useMutation({
    mutationFn: ({ en, ar }: { en: string; ar: string }) => createCategory(en, ar),
    onSuccess: (newCat) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setCategoryId(newCat.id);
      setNewCatEn("");
      setNewCatAr("");
      setShowAddCat(false);
    },
  });

  const tagMutation = useMutation({
    mutationFn: ({ en, ar }: { en: string; ar: string }) => createTag(en, ar),
    onSuccess: (newTag) => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      setSelectedTagIds((prev) => [...prev, newTag.id]);
      setNewTagEn("");
      setNewTagAr("");
      setShowAddTag(false);
    },
  });

  const openModal = (project?: Project) => {
    setFormError("");
    if (project) {
      setEditingProject(project);
      setTitleEn(project.title_en || project.title || "");
      setTitleAr(project.title_ar || project.title || "");
      setDescEn(project.description_en || project.description || "");
      setDescAr(project.description_ar || project.description || "");
      setImageUrl(project.image_url || "");
      setGithubUrl(project.github_url || "");
      setLiveUrl(project.live_url || "");
      setCategoryId(project.category?.id || project.category_id || "");
      const existingTagIds = project.tags
        ? project.tags.map((t) => t.tag_id || t.tag?.id).filter(Boolean) as string[]
        : [];
      setSelectedTagIds(existingTagIds);
    } else {
      setEditingProject(null);
      setTitleEn("");
      setTitleAr("");
      setDescEn("");
      setDescAr("");
      setImageUrl("");
      setGithubUrl("");
      setLiveUrl("");
      setCategoryId("");
      setSelectedTagIds([]);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormError("");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const url = await uploadAssetFile(file, "projects");
      setImageUrl(url);
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn.trim() && !titleAr.trim()) {
      setFormError("Project title is required in at least one language.");
      return;
    }

    const payload: CreateProjectPayload = {
      title_en: titleEn.trim() || titleAr.trim(),
      title_ar: titleAr.trim() || titleEn.trim(),
      description_en: descEn.trim() || descAr.trim(),
      description_ar: descAr.trim() || descEn.trim(),
      image_url: imageUrl.trim() || null,
      github_url: githubUrl.trim() || null,
      live_url: liveUrl.trim() || null,
      category_id: categoryId || null,
      tag_ids: selectedTagIds,
    };

    if (editingProject) {
      updateMutation.mutate({ id: editingProject.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const query = search.toLowerCase();
    const categoryName = p.category?.name || p.category?.name_en || p.category?.name_ar || p.category?.slug || "";
    return (
      p.title?.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query) ||
      categoryName.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <FaSearch size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--color-muted)" }} />
          <input
            type="text"
            placeholder={t("manage.projects.searchPlaceholder")}
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
          <span>{t("manage.projects.addNew")}</span>
        </button>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <FaSpinner size={24} className="animate-spin" style={{ color: "var(--color-muted)" }} />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center border flex flex-col items-center justify-center gap-3"
          style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
        >
          <p className="text-sm" style={{ color: "var(--color-muted)" }}>
            {t("manage.projects.noProjects")}
          </p>
          <button
            onClick={() => openModal()}
            className="text-xs font-semibold hover:underline"
            style={{ color: "var(--color-text)" }}
          >
            {t("manage.projects.createFirst")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const catName = project.category?.name || project.category?.name_en || project.category?.name_ar || project.category?.slug;
            return (
              <div
                key={project.id}
                className="group rounded-2xl border overflow-hidden flex flex-col justify-between transition-all"
                style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
              >
                <div>
                  {/* Image Cover */}
                  <div
                    className="relative h-44 w-full overflow-hidden border-b"
                    style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}
                  >
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-mono" style={{ color: "var(--color-muted)" }}>
                        {t("manage.projects.noCover")}
                      </div>
                    )}

                    {catName && (
                      <span
                        className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold font-mono border"
                        style={{
                          background: "var(--color-surface)",
                          borderColor: "var(--color-border)",
                          color: "var(--color-text)",
                        }}
                      >
                        {catName}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col gap-2">
                    <h3 className="font-bold text-base leading-snug" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {project.title}
                    </h3>
                    <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: "var(--color-muted)" }}>
                      {project.description}
                    </p>

                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {project.tags.map((tItem, idx) => {
                          const tagName = tItem.tag?.name || tItem.tag?.name_en || tItem.tag?.name_ar || tItem.tag?.slug;
                          if (!tagName) return null;
                          return (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md text-[10px] border font-mono"
                              style={{
                                background: "var(--color-surface-2)",
                                borderColor: "var(--color-border)",
                                color: "var(--color-muted)",
                              }}
                            >
                              {tagName}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div
                  className="p-4 flex items-center justify-between border-t mt-4"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <div className="flex items-center gap-2 text-xs">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg border transition-colors"
                        style={{ borderColor: "var(--color-border)", color: "var(--color-muted)" }}
                        title="GitHub Repository"
                      >
                        <FaGithub size={14} />
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg border transition-colors"
                        style={{ borderColor: "var(--color-border)", color: "var(--color-muted)" }}
                        title="Live Project"
                      >
                        <FaExternalLinkAlt size={12} />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openModal(project)}
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
                      onClick={() => setDeleteConfirmId(project.id)}
                      className="p-2 rounded-lg text-xs border transition-all"
                      style={{
                        borderColor: "rgba(239, 68, 68, 0.2)",
                        background: "rgba(239, 68, 68, 0.08)",
                        color: "#f87171",
                      }}
                      title="Delete Project"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-2xl p-6 my-8 flex flex-col gap-5 border shadow-2xl max-h-[90vh] overflow-y-auto"
              style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
            >
              <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "var(--color-border)" }}>
                <h3 className="font-bold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {editingProject ? t("manage.projects.editTitle") : t("manage.projects.createTitle")}
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

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Language Selector Tabs */}
                <div className="flex items-center gap-2 p-1 rounded-xl border" style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}>
                  <button
                    type="button"
                    onClick={() => setActiveTab("en")}
                    className="flex-1 py-2 text-xs font-bold rounded-lg transition-all"
                    style={{
                      background: activeTab === "en" ? "var(--color-primary)" : "transparent",
                      color: activeTab === "en" ? "var(--color-bg)" : "var(--color-muted)",
                    }}
                  >
                    English Details 🇬🇧
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
                    Arabic Details (العربية) 🇸🇦
                  </button>
                </div>

                {activeTab === "en" ? (
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="text-xs font-medium mb-1 block" style={{ color: "var(--color-muted)" }}>
                        {t("manage.projects.titleEn")} *
                      </label>
                      <input
                        type="text"
                        value={titleEn}
                        onChange={(e) => setTitleEn(e.target.value)}
                        placeholder="e.g. E-Commerce Platform"
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block" style={{ color: "var(--color-muted)" }}>
                        {t("manage.projects.descEn")}
                      </label>
                      <textarea
                        rows={3}
                        value={descEn}
                        onChange={(e) => setDescEn(e.target.value)}
                        placeholder="Describe features, tech stack, and achievements..."
                        className="form-input"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4" dir="rtl">
                    <div>
                      <label className="text-xs font-medium mb-1 block text-right" style={{ color: "var(--color-muted)" }}>
                        {t("manage.projects.titleAr")} *
                      </label>
                      <input
                        type="text"
                        value={titleAr}
                        onChange={(e) => setTitleAr(e.target.value)}
                        placeholder="مثال: منصة التجارة الإلكترونية"
                        className="form-input text-right"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block text-right" style={{ color: "var(--color-muted)" }}>
                        {t("manage.projects.descAr")}
                      </label>
                      <textarea
                        rows={3}
                        value={descAr}
                        onChange={(e) => setDescAr(e.target.value)}
                        placeholder="اشرح المميزات والتقنيات المستخدمة..."
                        className="form-input text-right"
                      />
                    </div>
                  </div>
                )}

                {/* Image & Links Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-xs font-medium mb-1 block" style={{ color: "var(--color-muted)" }}>
                      {t("manage.projects.coverImage")}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://... or upload an image"
                        className="form-input flex-1"
                      />
                      <label className="cursor-pointer flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold border transition-all" style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)", color: "var(--color-text)" }}>
                        {uploadingImage ? (
                          <FaSpinner size={12} className="animate-spin" />
                        ) : (
                          <FaUpload size={12} />
                        )}
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {imageUrl && (
                      <div className="mt-2 h-20 w-36 rounded-lg overflow-hidden border bg-black/20" style={{ borderColor: "var(--color-border)" }}>
                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: "var(--color-muted)" }}>
                      {t("manage.projects.githubUrl")}
                    </label>
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/..."
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: "var(--color-muted)" }}>
                      {t("manage.projects.liveUrl")}
                    </label>
                    <input
                      type="url"
                      value={liveUrl}
                      onChange={(e) => setLiveUrl(e.target.value)}
                      placeholder="https://..."
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium" style={{ color: "var(--color-muted)" }}>
                      {t("manage.projects.category")}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAddCat(!showAddCat)}
                      className="text-[11px] font-semibold hover:underline"
                      style={{ color: "var(--color-text)" }}
                    >
                      {showAddCat ? "Cancel" : "+ New Category"}
                    </button>
                  </div>

                  {showAddCat ? (
                    <div className="p-3 rounded-xl border flex flex-col gap-2" style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Name (EN)"
                          value={newCatEn}
                          onChange={(e) => setNewCatEn(e.target.value)}
                          className="form-input text-xs"
                        />
                        <input
                          type="text"
                          placeholder="الاسم (عربي)"
                          value={newCatAr}
                          onChange={(e) => setNewCatAr(e.target.value)}
                          className="form-input text-xs text-right"
                          dir="rtl"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (newCatEn.trim()) {
                            categoryMutation.mutate({
                              en: newCatEn.trim(),
                              ar: newCatAr.trim() || newCatEn.trim(),
                            });
                          }
                        }}
                        disabled={categoryMutation.isPending}
                        className="btn-primary self-end px-3 py-1.5 rounded-lg text-xs font-semibold"
                      >
                        {categoryMutation.isPending ? "Creating..." : "Save Category"}
                      </button>
                    </div>
                  ) : (
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="form-input"
                    >
                      <option value="">No Category</option>
                      {categories.map((cat: any) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name || cat.name_en || cat.name_ar || cat.slug}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Tags Selection */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium" style={{ color: "var(--color-muted)" }}>
                      {t("manage.projects.tags")}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAddTag(!showAddTag)}
                      className="text-[11px] font-semibold hover:underline"
                      style={{ color: "var(--color-text)" }}
                    >
                      {showAddTag ? "Cancel" : "+ New Tag"}
                    </button>
                  </div>

                  {showAddTag ? (
                    <div className="p-3 rounded-xl border flex flex-col gap-2 mb-2" style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Tag Name (EN)"
                          value={newTagEn}
                          onChange={(e) => setNewTagEn(e.target.value)}
                          className="form-input text-xs"
                        />
                        <input
                          type="text"
                          placeholder="الوسم (عربي)"
                          value={newTagAr}
                          onChange={(e) => setNewTagAr(e.target.value)}
                          className="form-input text-xs text-right"
                          dir="rtl"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (newTagEn.trim()) {
                            tagMutation.mutate({
                              en: newTagEn.trim(),
                              ar: newTagAr.trim() || newTagEn.trim(),
                            });
                          }
                        }}
                        disabled={tagMutation.isPending}
                        className="btn-primary self-end px-3 py-1.5 rounded-lg text-xs font-semibold"
                      >
                        {tagMutation.isPending ? "Creating..." : "Save Tag"}
                      </button>
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-3 rounded-xl border" style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}>
                    {tags.map((tag: any) => {
                      const isSelected = selectedTagIds.includes(tag.id);
                      const tagName = tag.name || tag.name_en || tag.name_ar || tag.slug;
                      return (
                        <button
                          type="button"
                          key={tag.id}
                          onClick={() => {
                            setSelectedTagIds((prev) =>
                              isSelected ? prev.filter((id) => id !== tag.id) : [...prev, tag.id]
                            );
                          }}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono border transition-all"
                          style={{
                            background: isSelected ? "var(--color-primary)" : "var(--color-surface)",
                            color: isSelected ? "var(--color-bg)" : "var(--color-muted)",
                            borderColor: isSelected ? "var(--color-primary)" : "var(--color-border)",
                          }}
                        >
                          {isSelected && <FaCheck size={10} />}
                          <span>{tagName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Actions */}
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
                    <span>{editingProject ? t("manage.projects.update") : t("manage.projects.save")}</span>
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
                {t("manage.projects.deleteTitle")}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--color-muted)" }}>
                {t("manage.projects.deleteMessage")}
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
