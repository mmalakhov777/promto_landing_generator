"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi, AdminApiError } from "@/lib/admin-api";
import { Badge } from "@/components/admin/Badge";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Modal } from "@/components/admin/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { FormField } from "@/components/admin/FormField";
import { useToast } from "@/components/admin/Toast";
import type { Category } from "@/types/admin";

const emptyForm = {
  slug: "",
  name_ru: "",
  name_en: "",
  description_ru: "",
  description_en: "",
  meta_title_ru: "",
  meta_title_en: "",
  meta_description_ru: "",
  meta_description_en: "",
  sort_order: 0,
  is_active: true,
};

export default function CategoriesPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await adminApi.get<Category[]>("/categories");
      setCategories(data);
    } catch {
      toast("Ошибка загрузки категорий", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({
      slug: cat.slug,
      name_ru: cat.name_ru,
      name_en: cat.name_en,
      description_ru: cat.description_ru || "",
      description_en: cat.description_en || "",
      meta_title_ru: cat.meta_title_ru || "",
      meta_title_en: cat.meta_title_en || "",
      meta_description_ru: cat.meta_description_ru || "",
      meta_description_en: cat.meta_description_en || "",
      sort_order: cat.sort_order,
      is_active: cat.is_active,
    });
    setFormError("");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.slug || !form.name_ru) {
      setFormError("Slug и название (RU) обязательны");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      if (editing) {
        await adminApi.patch(`/categories/${editing.id}`, form);
        toast("Категория обновлена", "success");
      } else {
        await adminApi.post("/categories", form);
        toast("Категория создана", "success");
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      setFormError(err instanceof AdminApiError ? err.message : "Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.delete(`/categories/${deleteTarget.id}`);
      toast("Категория деактивирована", "success");
      setDeleteTarget(null);
      fetchCategories();
    } catch (err) {
      toast(err instanceof AdminApiError ? err.message : "Ошибка удаления", "error");
    } finally {
      setDeleting(false);
    }
  };

  const updateField = (key: string, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const columns: Column<Category>[] = [
    {
      key: "name",
      header: "Название",
      render: (cat) => (
        <div>
          <p className="font-medium text-text">{cat.name_ru}</p>
          <p className="text-xs text-text-muted">{cat.name_en}</p>
        </div>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      render: (cat) => <code className="text-xs bg-surface px-1.5 py-0.5 rounded">{cat.slug}</code>,
    },
    {
      key: "status",
      header: "Статус",
      render: (cat) => (
        <Badge variant={cat.is_active ? "success" : "default"}>
          {cat.is_active ? "Активна" : "Неактивна"}
        </Badge>
      ),
    },
    {
      key: "sort",
      header: "Порядок",
      render: (cat) => <span className="text-text-muted">{cat.sort_order}</span>,
      className: "w-24",
    },
    {
      key: "actions",
      header: "",
      render: (cat) => (
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => openEdit(cat)}
            className="rounded-lg border border-border px-3 py-1 text-xs hover:bg-surface transition-colors"
          >
            Изменить
          </button>
          <button
            onClick={() => setDeleteTarget(cat)}
            className="rounded-lg border border-error/30 px-3 py-1 text-xs text-error hover:bg-red-50 transition-colors"
          >
            Удалить
          </button>
        </div>
      ),
      className: "w-48",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Категории</h1>
        <button
          onClick={openCreate}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
        >
          + Создать категорию
        </button>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        keyExtractor={(cat) => cat.id}
        loading={loading}
        emptyMessage="Нет категорий"
      />

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Редактировать категорию" : "Новая категория"}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          {formError && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-error">{formError}</div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Slug"
              value={form.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              placeholder="site-generator"
              hint="Только латиница, цифры, дефисы"
            />
            <FormField
              label="Порядок сортировки"
              type="number"
              value={form.sort_order}
              onChange={(e) => updateField("sort_order", parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Название (RU)"
              value={form.name_ru}
              onChange={(e) => updateField("name_ru", e.target.value)}
              placeholder="ИИ-конструктор сайтов"
            />
            <FormField
              label="Название (EN)"
              value={form.name_en}
              onChange={(e) => updateField("name_en", e.target.value)}
              placeholder="AI Website Builder"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Описание (RU)"
              multiline
              value={form.description_ru}
              onChange={(e) => updateField("description_ru", e.target.value)}
            />
            <FormField
              label="Описание (EN)"
              multiline
              value={form.description_en}
              onChange={(e) => updateField("description_en", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Meta Title (RU)"
              value={form.meta_title_ru}
              onChange={(e) => updateField("meta_title_ru", e.target.value)}
            />
            <FormField
              label="Meta Title (EN)"
              value={form.meta_title_en}
              onChange={(e) => updateField("meta_title_en", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Meta Description (RU)"
              multiline
              value={form.meta_description_ru}
              onChange={(e) => updateField("meta_description_ru", e.target.value)}
            />
            <FormField
              label="Meta Description (EN)"
              multiline
              value={form.meta_description_en}
              onChange={(e) => updateField("meta_description_en", e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={form.is_active}
              onChange={(e) => updateField("is_active", e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary"
            />
            <label htmlFor="is_active" className="text-sm text-text">
              Активна
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              onClick={() => setModalOpen(false)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text hover:bg-surface transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              {saving ? "Сохранение..." : editing ? "Сохранить" : "Создать"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Деактивировать категорию?"
        message={`Категория "${deleteTarget?.name_ru}" будет деактивирована. Все опубликованные лендинги этой категории будут сняты с публикации.`}
        confirmText="Деактивировать"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
