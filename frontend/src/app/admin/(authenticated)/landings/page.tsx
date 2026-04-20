"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { adminApi, AdminApiError } from "@/lib/admin-api";
import { Badge } from "@/components/admin/Badge";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Modal } from "@/components/admin/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { FormField } from "@/components/admin/FormField";
import { useToast } from "@/components/admin/Toast";
import type { Category, Landing, LandingListResponse } from "@/types/admin";

export default function LandingsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [landings, setLandings] = useState<Landing[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  // Filters
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");

  // Create modal — open immediately if ?new=1
  const [createOpen, setCreateOpen] = useState(searchParams.get("new") === "1");
  const [createForm, setCreateForm] = useState({
    slug: "",
    category_id: 0,
    keyword_ru: "",
    keyword_en: "",
    search_volume: 0,
  });
  const [createError, setCreateError] = useState("");
  const [creating, setCreating] = useState(false);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<Landing | null>(null);
  const [deleting, setDeleting] = useState(false);

  const perPage = 20;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounced(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Load categories
  useEffect(() => {
    adminApi.get<Category[]>("/categories").then(setCategories).catch(() => {});
  }, []);

  const fetchLandings = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: String(page),
        per_page: String(perPage),
      };
      if (filterCategory) params.category_id = filterCategory;
      if (filterStatus) params.is_published = filterStatus;
      if (searchDebounced) params.search = searchDebounced;

      const data = await adminApi.get<LandingListResponse>("/landings", { params });
      setLandings(data.items);
      setTotal(data.total);
    } catch {
      toast("Ошибка загрузки лендингов", "error");
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps -- refetch when filters change
  useEffect(() => { void fetchLandings(); }, [page, filterCategory, filterStatus, searchDebounced]);

  const handleCreate = async () => {
    if (!createForm.slug || !createForm.category_id) {
      setCreateError("Slug и категория обязательны");
      return;
    }
    setCreating(true);
    setCreateError("");
    try {
      const landing = await adminApi.post<Landing>("/landings", createForm);
      toast("Лендинг создан", "success");
      setCreateOpen(false);
      setCreateForm({ slug: "", category_id: 0, keyword_ru: "", keyword_en: "", search_volume: 0 });
      router.push(`/admin/landings/${landing.id}`);
    } catch (err) {
      setCreateError(err instanceof AdminApiError ? err.message : "Ошибка создания");
    } finally {
      setCreating(false);
    }
  };

  const handleTogglePublish = async (landing: Landing) => {
    try {
      await adminApi.patch(`/landings/${landing.id}/publish`);
      toast(
        landing.is_published ? "Снято с публикации" : "Опубликовано",
        "success",
      );
      fetchLandings();
    } catch (err) {
      toast(err instanceof AdminApiError ? err.message : "Ошибка", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminApi.delete(`/landings/${deleteTarget.id}`);
      toast("Лендинг удалён", "success");
      setDeleteTarget(null);
      fetchLandings();
    } catch (err) {
      toast(err instanceof AdminApiError ? err.message : "Ошибка удаления", "error");
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = Math.ceil(total / perPage);

  const columns: Column<Landing>[] = [
    {
      key: "keyword",
      header: "Ключевой запрос",
      render: (l) => (
        <Link href={`/admin/landings/${l.id}`} className="hover:text-primary transition-colors">
          <p className="font-medium">{l.keyword_ru || l.slug}</p>
          <p className="text-xs text-text-muted">/{l.slug}</p>
        </Link>
      ),
    },
    {
      key: "category",
      header: "Категория",
      render: (l) => {
        const cat = categories.find((c) => c.id === l.category_id);
        return <span className="text-sm text-text-muted">{cat?.name_ru || "—"}</span>;
      },
    },
    {
      key: "status",
      header: "Статус",
      render: (l) => (
        <Badge variant={l.is_published ? "success" : "default"}>
          {l.is_published ? "Опубликован" : "Черновик"}
        </Badge>
      ),
      className: "w-32",
    },
    {
      key: "volume",
      header: "Частотность",
      render: (l) => <span className="text-sm text-text-muted">{l.search_volume || "—"}</span>,
      className: "w-28",
    },
    {
      key: "updated",
      header: "Обновлён",
      render: (l) => (
        <span className="text-sm text-text-muted">
          {new Date(l.updated_at).toLocaleDateString("ru")}
        </span>
      ),
      className: "w-28",
    },
    {
      key: "actions",
      header: "",
      render: (l) => (
        <div className="flex gap-1.5 justify-end">
          <button
            onClick={() => handleTogglePublish(l)}
            className={`rounded-lg border px-2.5 py-1 text-xs transition-colors ${
              l.is_published
                ? "border-warning/30 text-warning hover:bg-yellow-50"
                : "border-success/30 text-success hover:bg-green-50"
            }`}
          >
            {l.is_published ? "Снять" : "Опубл."}
          </button>
          <Link
            href={`/admin/landings/${l.id}`}
            className="rounded-lg border border-border px-2.5 py-1 text-xs hover:bg-surface transition-colors"
          >
            Изменить
          </Link>
          <button
            onClick={() => setDeleteTarget(l)}
            className="rounded-lg border border-error/30 px-2.5 py-1 text-xs text-error hover:bg-red-50 transition-colors"
          >
            Удалить
          </button>
        </div>
      ),
      className: "w-56",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Лендинги</h1>
        <button
          onClick={() => setCreateOpen(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
        >
          + Новый лендинг
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Поиск по H1, keyword, slug..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary w-64"
        />
        <select
          value={filterCategory}
          onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
          className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="">Все категории</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name_ru}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
          className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="">Все статусы</option>
          <option value="true">Опубликованы</option>
          <option value="false">Черновики</option>
        </select>
        <span className="flex items-center text-sm text-text-muted">
          Найдено: {total}
        </span>
      </div>

      <DataTable
        columns={columns}
        data={landings}
        keyExtractor={(l) => l.id}
        loading={loading}
        emptyMessage="Лендинги не найдены"
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Create Modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Новый лендинг"
      >
        <div className="space-y-4">
          {createError && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-error">{createError}</div>
          )}
          <FormField
            label="Slug"
            value={createForm.slug}
            onChange={(e) => setCreateForm((f) => ({ ...f, slug: e.target.value }))}
            placeholder="dlya-biznesa"
            hint="Только латиница, цифры, дефисы"
          />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-text">Категория</label>
            <select
              value={createForm.category_id}
              onChange={(e) => setCreateForm((f) => ({ ...f, category_id: parseInt(e.target.value) || 0 }))}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value={0}>Выберите категорию</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name_ru}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Ключевой запрос (RU)"
              value={createForm.keyword_ru}
              onChange={(e) => setCreateForm((f) => ({ ...f, keyword_ru: e.target.value }))}
            />
            <FormField
              label="Ключевой запрос (EN)"
              value={createForm.keyword_en}
              onChange={(e) => setCreateForm((f) => ({ ...f, keyword_en: e.target.value }))}
            />
          </div>
          <FormField
            label="Частотность"
            type="number"
            value={createForm.search_volume}
            onChange={(e) => setCreateForm((f) => ({ ...f, search_volume: parseInt(e.target.value) || 0 }))}
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              onClick={() => setCreateOpen(false)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text hover:bg-surface transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleCreate}
              disabled={creating}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              {creating ? "Создание..." : "Создать"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Удалить лендинг?"
        message={`Лендинг "${deleteTarget?.keyword_ru || deleteTarget?.slug}" будет удалён безвозвратно.`}
        confirmText="Удалить"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
