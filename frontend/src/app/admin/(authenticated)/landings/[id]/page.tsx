"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminApi, AdminApiError } from "@/lib/admin-api";
import { FormField } from "@/components/admin/FormField";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { useToast } from "@/components/admin/Toast";
import type { Landing, LandingContent, LandingSection, Category } from "@/types/admin";

type Tab = "main" | "seo" | "content_ru" | "content_en" | "sections";

const tabLabels: { key: Tab; label: string }[] = [
  { key: "main", label: "Основное" },
  { key: "seo", label: "SEO" },
  { key: "content_ru", label: "Контент RU" },
  { key: "content_en", label: "Контент EN" },
  { key: "sections", label: "Секции" },
];

const sectionLabels: Record<string, string> = {
  social_proof: "Social Proof",
  advantages: "Преимущества",
  how_it_works: "Как это работает",
  examples: "Примеры работ",
  cta_mid: "CTA промежуточный",
  video: "Видео",
  pricing: "Тарифы",
  reviews: "Отзывы",
  faq: "FAQ",
};

export default function LandingEditorPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<Tab>("main");
  const [categories, setCategories] = useState<Category[]>([]);

  const [landing, setLanding] = useState<Landing | null>(null);
  const [contentRu, setContentRu] = useState<LandingContent | null>(null);
  const [contentEn, setContentEn] = useState<LandingContent | null>(null);
  const [sections, setSections] = useState<LandingSection[]>([]);

  // Editable main fields
  const [mainForm, setMainForm] = useState({
    slug: "",
    category_id: 0,
    keyword_ru: "",
    keyword_en: "",
    search_volume: 0,
  });

  const fetchLanding = async () => {
    try {
      const [data, cats] = await Promise.all([
        adminApi.get<Landing>(`/landings/${id}`),
        adminApi.get<Category[]>("/categories"),
      ]);

      setLanding(data);
      setCategories(cats);
      setMainForm({
        slug: data.slug,
        category_id: data.category_id,
        keyword_ru: data.keyword_ru || "",
        keyword_en: data.keyword_en || "",
        search_volume: data.search_volume || 0,
      });

      const ru = data.contents?.find((c) => c.locale === "ru") || null;
      const en = data.contents?.find((c) => c.locale === "en") || null;
      setContentRu(ru);
      setContentEn(en);
      setSections(data.sections || []);
    } catch {
      toast("Ошибка загрузки лендинга", "error");
      router.push("/admin/landings");
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps -- initial data fetch
  useEffect(() => { void fetchLanding(); }, [id]);

  const saveMain = async () => {
    setSaving(true);
    try {
      await adminApi.patch(`/landings/${id}`, mainForm);
      toast("Основные данные сохранены", "success");
      fetchLanding();
    } catch (err) {
      toast(err instanceof AdminApiError ? err.message : "Ошибка сохранения", "error");
    } finally {
      setSaving(false);
    }
  };

  const saveSeo = async (locale: "ru" | "en") => {
    const content = locale === "ru" ? contentRu : contentEn;
    if (!content) return;
    setSaving(true);
    try {
      await adminApi.patch(`/landings/${id}/content/${locale}`, {
        meta_title: content.meta_title,
        meta_description: content.meta_description,
        h1: content.h1,
        og_title: content.og_title,
        og_description: content.og_description,
        og_image_url: content.og_image_url,
      });
      toast(`SEO (${locale.toUpperCase()}) сохранён`, "success");
    } catch (err) {
      toast(err instanceof AdminApiError ? err.message : "Ошибка сохранения", "error");
    } finally {
      setSaving(false);
    }
  };

  const saveContent = async (locale: "ru" | "en") => {
    const content = locale === "ru" ? contentRu : contentEn;
    if (!content) return;
    setSaving(true);
    try {
      // Send all content fields (excluding SEO which is saved separately)
      const seoKeys = new Set(["id", "landing_id", "locale", "meta_title", "meta_description", "h1", "og_title", "og_description", "og_image_url"]);
      const contentFields = Object.fromEntries(
        Object.entries(content).filter(([key]) => !seoKeys.has(key))
      );
      await adminApi.patch(`/landings/${id}/content/${locale}`, contentFields);
      toast(`Контент (${locale.toUpperCase()}) сохранён`, "success");
    } catch (err) {
      toast(err instanceof AdminApiError ? err.message : "Ошибка сохранения", "error");
    } finally {
      setSaving(false);
    }
  };

  const saveSections = async () => {
    setSaving(true);
    try {
      const payload = sections.map((s) => ({
        section_type: s.section_type,
        is_enabled: s.is_enabled,
      }));
      await adminApi.patch(`/landings/${id}/sections`, { sections: payload });
      toast("Секции сохранены", "success");
    } catch (err) {
      toast(err instanceof AdminApiError ? err.message : "Ошибка сохранения", "error");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!landing) return;
    try {
      await adminApi.patch(`/landings/${id}/publish`);
      toast(landing.is_published ? "Снято с публикации" : "Опубликовано", "success");
      fetchLanding();
    } catch (err) {
      toast(err instanceof AdminApiError ? err.message : "Ошибка", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!landing) return null;

  const cat = categories.find((c) => c.id === landing.category_id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push("/admin/landings")}
            className="text-sm text-text-muted hover:text-text transition-colors mb-1"
          >
            ← Назад к списку
          </button>
          <h1 className="text-2xl font-bold text-text">
            {landing.keyword_ru || landing.slug}
          </h1>
          <p className="text-sm text-text-muted">
            {cat?.name_ru} / {landing.slug}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handlePublish}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              landing.is_published
                ? "border-warning text-warning hover:bg-yellow-50"
                : "border-success text-success hover:bg-green-50"
            }`}
          >
            {landing.is_published ? "Снять с публикации" : "Опубликовать"}
          </button>
          {landing.is_published && cat && (
            <a
              href={`/ru/${cat.slug}/${landing.slug}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text hover:bg-surface transition-colors"
            >
              Предпросмотр ↗
            </a>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {tabLabels.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t.key
                ? "border-primary text-primary"
                : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="rounded-xl border border-border bg-white p-6">
        {tab === "main" && (
          <div className="space-y-4 max-w-2xl">
            <FormField
              label="Slug"
              value={mainForm.slug}
              onChange={(e) => setMainForm((f) => ({ ...f, slug: e.target.value }))}
              hint="При изменении slug опубликованного лендинга будет создан редирект"
            />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-text">Категория</label>
              <select
                value={mainForm.category_id}
                onChange={(e) => setMainForm((f) => ({ ...f, category_id: parseInt(e.target.value) || 0 }))}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name_ru}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Ключевой запрос (RU)"
                value={mainForm.keyword_ru}
                onChange={(e) => setMainForm((f) => ({ ...f, keyword_ru: e.target.value }))}
              />
              <FormField
                label="Ключевой запрос (EN)"
                value={mainForm.keyword_en}
                onChange={(e) => setMainForm((f) => ({ ...f, keyword_en: e.target.value }))}
              />
            </div>
            <FormField
              label="Частотность"
              type="number"
              value={mainForm.search_volume}
              onChange={(e) => setMainForm((f) => ({ ...f, search_volume: parseInt(e.target.value) || 0 }))}
            />
            <div className="pt-4">
              <button
                onClick={saveMain}
                disabled={saving}
                className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors disabled:opacity-50"
              >
                {saving ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </div>
        )}

        {tab === "seo" && (
          <div className="space-y-6">
            {(["ru", "en"] as const).map((locale) => {
              const content = locale === "ru" ? contentRu : contentEn;
              const setContent = locale === "ru" ? setContentRu : setContentEn;
              if (!content) return null;

              const updateSeoField = (field: keyof LandingContent, value: string) => {
                setContent({ ...content, [field]: value });
              };

              return (
                <div key={locale} className="space-y-4">
                  <h3 className="text-lg font-semibold text-text">
                    SEO — {locale.toUpperCase()}
                  </h3>
                  <FormField
                    label="Meta Title"
                    value={content.meta_title || ""}
                    onChange={(e) => updateSeoField("meta_title", e.target.value)}
                    hint={`${(content.meta_title || "").length}/60 символов`}
                  />
                  <FormField
                    label="Meta Description"
                    multiline
                    value={content.meta_description || ""}
                    onChange={(e) => updateSeoField("meta_description", e.target.value)}
                    hint={`${(content.meta_description || "").length}/160 символов`}
                  />
                  <FormField
                    label="H1"
                    value={content.h1 || ""}
                    onChange={(e) => updateSeoField("h1", e.target.value)}
                  />
                  <FormField
                    label="OG Title"
                    value={content.og_title || ""}
                    onChange={(e) => updateSeoField("og_title", e.target.value)}
                  />
                  <FormField
                    label="OG Description"
                    multiline
                    value={content.og_description || ""}
                    onChange={(e) => updateSeoField("og_description", e.target.value)}
                  />
                  <FormField
                    label="OG Image URL"
                    value={content.og_image_url || ""}
                    onChange={(e) => updateSeoField("og_image_url", e.target.value)}
                  />
                  <button
                    onClick={() => saveSeo(locale)}
                    disabled={saving}
                    className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors disabled:opacity-50"
                  >
                    {saving ? "Сохранение..." : `Сохранить SEO (${locale.toUpperCase()})`}
                  </button>
                  {locale === "ru" && <hr className="border-border" />}
                </div>
              );
            })}
          </div>
        )}

        {tab === "content_ru" && contentRu && (
          <div className="space-y-4">
            <ContentEditor content={contentRu} onChange={setContentRu} locale="ru" />
            <div className="pt-4 border-t border-border">
              <button
                onClick={() => saveContent("ru")}
                disabled={saving}
                className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors disabled:opacity-50"
              >
                {saving ? "Сохранение..." : "Сохранить контент (RU)"}
              </button>
            </div>
          </div>
        )}

        {tab === "content_en" && contentEn && (
          <div className="space-y-4">
            <ContentEditor content={contentEn} onChange={setContentEn} locale="en" />
            <div className="pt-4 border-t border-border">
              <button
                onClick={() => saveContent("en")}
                disabled={saving}
                className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors disabled:opacity-50"
              >
                {saving ? "Сохранение..." : "Сохранить контент (EN)"}
              </button>
            </div>
          </div>
        )}

        {tab === "sections" && (
          <div className="space-y-4 max-w-xl">
            <p className="text-sm text-text-muted">
              Включите или выключите отображение секций на лендинге.
            </p>
            {sections.map((section, idx) => (
              <div
                key={section.section_type}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
              >
                <span className="text-sm font-medium text-text">
                  {sectionLabels[section.section_type] || section.section_type}
                </span>
                <button
                  onClick={() => {
                    const next = [...sections];
                    next[idx] = { ...next[idx], is_enabled: !next[idx].is_enabled };
                    setSections(next);
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    section.is_enabled ? "bg-primary" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      section.is_enabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
            <div className="pt-4">
              <button
                onClick={saveSections}
                disabled={saving}
                className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors disabled:opacity-50"
              >
                {saving ? "Сохранение..." : "Сохранить секции"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
