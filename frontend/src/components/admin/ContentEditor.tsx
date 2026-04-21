"use client";

import { useState } from "react";
import { FormField } from "./FormField";
import type {
  LandingContent,
  SocialProofItem,
  AdvantageItem,
  HowItWorksStep,
  ExampleItem,
  PricingPlan,
  ReviewItem,
  FaqItem,
} from "@/types/admin";

interface DynamicListProps<T> {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, index: number, update: (field: string, value: string | number | boolean | string[]) => void) => React.ReactNode;
  createItem: () => T;
}

function DynamicList<T>({ label, items, onChange, renderItem, createItem }: DynamicListProps<T>) {
  const addItem = () => onChange([...items, createItem()]);
  const removeItem = (idx: number) => onChange(items.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: string, value: string | number | boolean | string[]) => {
    const next = [...items];
    next[idx] = { ...next[idx], [field]: value };
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-text">{label}</label>
        <button
          type="button"
          onClick={addItem}
          className="rounded-lg border border-border px-2.5 py-1 text-xs hover:bg-surface transition-colors"
        >
          + Добавить
        </button>
      </div>
      {items.map((item, idx) => (
        <div key={idx} className="relative rounded-lg border border-border p-3 space-y-2">
          <button
            type="button"
            onClick={() => removeItem(idx)}
            className="absolute top-2 right-2 text-text-muted hover:text-error text-xs"
          >
            ✕
          </button>
          {renderItem(item, idx, (field, value) => updateItem(idx, field, value))}
        </div>
      ))}
      {items.length === 0 && (
        <p className="text-xs text-text-muted py-2">Нет элементов</p>
      )}
    </div>
  );
}

interface Collapsible {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({ title, children, defaultOpen = false }: Collapsible) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg border border-border">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-text hover:bg-surface/50 transition-colors"
      >
        {title}
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="border-t border-border p-4 space-y-3">{children}</div>}
    </div>
  );
}

interface ContentEditorProps {
  content: LandingContent;
  onChange: (content: LandingContent) => void;
  locale: "ru" | "en";
}

export function ContentEditor({ content, onChange, locale }: ContentEditorProps) {
  const update = (field: keyof LandingContent, value: unknown) => {
    onChange({ ...content, [field]: value });
  };

  const localeLabel = locale === "ru" ? "RU" : "EN";

  return (
    <div className="space-y-4">
      {/* Hero */}
      <CollapsibleSection title={`Hero (${localeLabel})`} defaultOpen>
        <FormField
          label="Заголовок"
          value={content.hero_title || ""}
          onChange={(e) => update("hero_title", e.target.value)}
        />
        <FormField
          label="Подзаголовок"
          multiline
          value={content.hero_subtitle || ""}
          onChange={(e) => update("hero_subtitle", e.target.value)}
        />
        <div className="grid grid-cols-2 gap-3">
          <FormField
            label="Текст CTA"
            value={content.hero_cta_text || ""}
            onChange={(e) => update("hero_cta_text", e.target.value)}
          />
          <FormField
            label="Placeholder"
            value={content.hero_placeholder || ""}
            onChange={(e) => update("hero_placeholder", e.target.value)}
          />
        </div>
      </CollapsibleSection>

      {/* Social Proof */}
      <CollapsibleSection title={`Social Proof (${localeLabel})`}>
        <DynamicList<SocialProofItem>
          label="Элементы"
          items={content.social_proof || []}
          onChange={(items) => update("social_proof", items)}
          createItem={() => ({ label: "", value: "" })}
          renderItem={(item, _idx, upd) => (
            <div className="grid grid-cols-2 gap-2">
              <FormField label="Label" value={item.label} onChange={(e) => upd("label", e.target.value)} />
              <FormField label="Value" value={item.value} onChange={(e) => upd("value", e.target.value)} />
            </div>
          )}
        />
      </CollapsibleSection>

      {/* Advantages */}
      <CollapsibleSection title={`Преимущества (${localeLabel})`}>
        <DynamicList<AdvantageItem>
          label="Карточки"
          items={content.advantages || []}
          onChange={(items) => update("advantages", items)}
          createItem={() => ({ icon: "star", title: "", description: "" })}
          renderItem={(item, _idx, upd) => (
            <>
              <div className="grid grid-cols-3 gap-2">
                <FormField label="Иконка" value={item.icon} onChange={(e) => upd("icon", e.target.value)} />
                <FormField label="Заголовок" value={item.title} onChange={(e) => upd("title", e.target.value)} className="col-span-2" />
              </div>
              <FormField label="Описание" multiline value={item.description} onChange={(e) => upd("description", e.target.value)} />
            </>
          )}
        />
      </CollapsibleSection>

      {/* How It Works */}
      <CollapsibleSection title={`Как это работает (${localeLabel})`}>
        <DynamicList<HowItWorksStep>
          label="Шаги"
          items={content.how_it_works || []}
          onChange={(items) => update("how_it_works", items)}
          createItem={() => ({ step: (content.how_it_works?.length || 0) + 1, title: "", description: "", image_url: "" })}
          renderItem={(item, _idx, upd) => (
            <>
              <div className="grid grid-cols-4 gap-2">
                <FormField label="Шаг" type="number" value={item.step} onChange={(e) => upd("step", parseInt(e.target.value) || 0)} />
                <FormField label="Заголовок" value={item.title} onChange={(e) => upd("title", e.target.value)} className="col-span-3" />
              </div>
              <FormField label="Описание" multiline value={item.description} onChange={(e) => upd("description", e.target.value)} />
              <FormField label="URL картинки" value={item.image_url} onChange={(e) => upd("image_url", e.target.value)} />
            </>
          )}
        />
      </CollapsibleSection>

      {/* Examples */}
      <CollapsibleSection title={`Примеры работ (${localeLabel})`}>
        <DynamicList<ExampleItem>
          label="Примеры"
          items={content.examples || []}
          onChange={(items) => update("examples", items)}
          createItem={() => ({ image_url: "", title: "", description: "", url: "" })}
          renderItem={(item, _idx, upd) => (
            <>
              <div className="grid grid-cols-2 gap-2">
                <FormField label="Заголовок" value={item.title} onChange={(e) => upd("title", e.target.value)} />
                <FormField label="URL" value={item.url} onChange={(e) => upd("url", e.target.value)} />
              </div>
              <FormField label="Описание" multiline value={item.description} onChange={(e) => upd("description", e.target.value)} />
              <FormField label="URL картинки" value={item.image_url} onChange={(e) => upd("image_url", e.target.value)} />
            </>
          )}
        />
      </CollapsibleSection>

      {/* Video */}
      <CollapsibleSection title={`Видео (${localeLabel})`}>
        <FormField
          label="URL видео"
          value={content.video_url || ""}
          onChange={(e) => update("video_url", e.target.value)}
        />
        <FormField
          label="Заголовок секции"
          value={content.video_title || ""}
          onChange={(e) => update("video_title", e.target.value)}
        />
      </CollapsibleSection>

      {/* Pricing */}
      <CollapsibleSection title={`Тарифы (${localeLabel})`}>
        <DynamicList<PricingPlan>
          label="Тарифные планы"
          items={content.pricing || []}
          onChange={(items) => update("pricing", items)}
          createItem={() => ({ name: "", price: "", features: [], cta_url: "", is_popular: false })}
          renderItem={(item, _idx, upd) => (
            <>
              <div className="grid grid-cols-2 gap-2">
                <FormField label="Название" value={item.name} onChange={(e) => upd("name", e.target.value)} />
                <FormField label="Цена" value={item.price} onChange={(e) => upd("price", e.target.value)} />
              </div>
              <FormField label="URL кнопки" value={item.cta_url} onChange={(e) => upd("cta_url", e.target.value)} />
              <FormField
                label="Фичи (через Enter)"
                multiline
                value={(item.features || []).join("\n")}
                onChange={(e) => upd("features", e.target.value.split("\n").filter(Boolean))}
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item.is_popular}
                  onChange={(e) => upd("is_popular", e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary"
                />
                <span className="text-sm text-text">Популярный</span>
              </div>
            </>
          )}
        />
      </CollapsibleSection>

      {/* Reviews */}
      <CollapsibleSection title={`Отзывы (${localeLabel})`}>
        <DynamicList<ReviewItem>
          label="Отзывы"
          items={content.reviews || []}
          onChange={(items) => update("reviews", items)}
          createItem={() => ({ author: "", text: "", rating: 5, avatar_url: "" })}
          renderItem={(item, _idx, upd) => (
            <>
              <div className="grid grid-cols-3 gap-2">
                <FormField label="Автор" value={item.author} onChange={(e) => upd("author", e.target.value)} />
                <FormField label="Рейтинг (1-5)" type="number" value={item.rating} onChange={(e) => upd("rating", parseInt(e.target.value) || 5)} />
                <FormField label="URL аватара" value={item.avatar_url} onChange={(e) => upd("avatar_url", e.target.value)} />
              </div>
              <FormField label="Текст" multiline value={item.text} onChange={(e) => upd("text", e.target.value)} />
            </>
          )}
        />
      </CollapsibleSection>

      {/* FAQ */}
      <CollapsibleSection title={`FAQ (${localeLabel})`}>
        <DynamicList<FaqItem>
          label="Вопросы"
          items={content.faq || []}
          onChange={(items) => update("faq", items)}
          createItem={() => ({ question: "", answer: "" })}
          renderItem={(item, _idx, upd) => (
            <>
              <FormField label="Вопрос" value={item.question} onChange={(e) => upd("question", e.target.value)} />
              <FormField label="Ответ" multiline value={item.answer} onChange={(e) => upd("answer", e.target.value)} />
            </>
          )}
        />
      </CollapsibleSection>

      {/* CTA */}
      <CollapsibleSection title={`CTA блоки (${localeLabel})`}>
        <div className="space-y-3">
          <p className="text-xs font-medium text-text-muted uppercase">Промежуточный CTA</p>
          <FormField label="Заголовок" value={content.cta_mid_title || ""} onChange={(e) => update("cta_mid_title", e.target.value)} />
          <FormField label="Подзаголовок" value={content.cta_mid_subtitle || ""} onChange={(e) => update("cta_mid_subtitle", e.target.value)} />
          <hr className="border-border" />
          <p className="text-xs font-medium text-text-muted uppercase">Финальный CTA</p>
          <FormField label="Заголовок" value={content.cta_final_title || ""} onChange={(e) => update("cta_final_title", e.target.value)} />
          <FormField label="Подзаголовок" value={content.cta_final_subtitle || ""} onChange={(e) => update("cta_final_subtitle", e.target.value)} />
          <FormField label="Текст кнопки" value={content.cta_final_button_text || ""} onChange={(e) => update("cta_final_button_text", e.target.value)} />
        </div>
      </CollapsibleSection>
    </div>
  );
}
