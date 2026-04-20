"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi, AdminApiError } from "@/lib/admin-api";
import { FormField } from "@/components/admin/FormField";
import { useToast } from "@/components/admin/Toast";
import type { SiteSettings, SocialProofItem } from "@/types/admin";

export default function SettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [revalidating, setRevalidating] = useState(false);

  const [form, setForm] = useState({
    metrika_id: "",
    smartcaptcha_client_key: "",
    platform_url: "",
    default_video_url: "",
    default_pricing_json: "",
    default_cta_texts_json: "",
    social_proof_defaults: [] as SocialProofItem[],
  });

  const fetchSettings = useCallback(async () => {
    try {
      const data = await adminApi.get<SiteSettings>("/settings/full");
      setForm({
        metrika_id: data.metrika_id || "",
        smartcaptcha_client_key: data.smartcaptcha_client_key || "",
        platform_url: data.platform_url || "",
        default_video_url: data.default_video_url || "",
        default_pricing_json: data.default_pricing ? JSON.stringify(data.default_pricing, null, 2) : "[]",
        default_cta_texts_json: data.default_cta_texts ? JSON.stringify(data.default_cta_texts, null, 2) : "{}",
        social_proof_defaults: data.social_proof_defaults || [],
      });
    } catch {
      toast("Ошибка загрузки настроек", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      let default_pricing = null;
      let default_cta_texts = null;

      try {
        default_pricing = JSON.parse(form.default_pricing_json);
      } catch {
        toast("Невалидный JSON в тарифах", "error");
        setSaving(false);
        return;
      }

      try {
        default_cta_texts = JSON.parse(form.default_cta_texts_json);
      } catch {
        toast("Невалидный JSON в CTA текстах", "error");
        setSaving(false);
        return;
      }

      await adminApi.patch("/settings", {
        metrika_id: form.metrika_id,
        smartcaptcha_client_key: form.smartcaptcha_client_key,
        platform_url: form.platform_url,
        default_video_url: form.default_video_url,
        default_pricing,
        default_cta_texts,
        social_proof_defaults: form.social_proof_defaults,
      });
      toast("Настройки сохранены", "success");
    } catch (err) {
      toast(err instanceof AdminApiError ? err.message : "Ошибка сохранения", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleRevalidate = async () => {
    setRevalidating(true);
    try {
      await adminApi.post("/revalidate");
      toast("Ревалидация запущена", "success");
    } catch {
      toast("Ошибка ревалидации", "error");
    } finally {
      setRevalidating(false);
    }
  };

  const addSocialProof = () => {
    setForm((f) => ({
      ...f,
      social_proof_defaults: [...f.social_proof_defaults, { label: "", value: "" }],
    }));
  };

  const removeSocialProof = (idx: number) => {
    setForm((f) => ({
      ...f,
      social_proof_defaults: f.social_proof_defaults.filter((_, i) => i !== idx),
    }));
  };

  const updateSocialProof = (idx: number, field: "label" | "value", val: string) => {
    setForm((f) => {
      const items = [...f.social_proof_defaults];
      items[idx] = { ...items[idx], [field]: val };
      return { ...f, social_proof_defaults: items };
    });
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Настройки</h1>
        <button
          onClick={handleRevalidate}
          disabled={revalidating}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text hover:bg-surface transition-colors disabled:opacity-50"
        >
          {revalidating ? "Ревалидация..." : "Обновить кеш фронтенда"}
        </button>
      </div>

      <div className="rounded-xl border border-border bg-white p-6 space-y-6">
        {/* Analytics & Captcha */}
        <div>
          <h2 className="text-lg font-semibold text-text mb-4">Аналитика и антибот</h2>
          <div className="space-y-4">
            <FormField
              label="ID Яндекс.Метрики"
              value={form.metrika_id}
              onChange={(e) => setForm((f) => ({ ...f, metrika_id: e.target.value }))}
              placeholder="12345678"
            />
            <FormField
              label="Клиентский ключ SmartCaptcha"
              value={form.smartcaptcha_client_key}
              onChange={(e) => setForm((f) => ({ ...f, smartcaptcha_client_key: e.target.value }))}
            />
          </div>
        </div>

        <hr className="border-border" />

        {/* Platform */}
        <div>
          <h2 className="text-lg font-semibold text-text mb-4">Платформа</h2>
          <div className="space-y-4">
            <FormField
              label="URL платформы"
              value={form.platform_url}
              onChange={(e) => setForm((f) => ({ ...f, platform_url: e.target.value }))}
              placeholder="https://app.promto.ai"
            />
            <FormField
              label="URL дефолтного видео"
              value={form.default_video_url}
              onChange={(e) => setForm((f) => ({ ...f, default_video_url: e.target.value }))}
            />
          </div>
        </div>

        <hr className="border-border" />

        {/* Social Proof Defaults */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text">Social Proof по умолчанию</h2>
            <button
              onClick={addSocialProof}
              className="rounded-lg border border-border px-3 py-1 text-xs hover:bg-surface transition-colors"
            >
              + Добавить
            </button>
          </div>
          <div className="space-y-2">
            {form.social_proof_defaults.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  className="flex-1 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                  placeholder="Label"
                  value={item.label}
                  onChange={(e) => updateSocialProof(idx, "label", e.target.value)}
                />
                <input
                  className="flex-1 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                  placeholder="Value"
                  value={item.value}
                  onChange={(e) => updateSocialProof(idx, "value", e.target.value)}
                />
                <button
                  onClick={() => removeSocialProof(idx)}
                  className="text-text-muted hover:text-error text-sm px-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-border" />

        {/* JSON editors */}
        <div>
          <h2 className="text-lg font-semibold text-text mb-4">Дефолтные тарифы (JSON)</h2>
          <textarea
            className="w-full rounded-lg border border-border px-3 py-2 text-sm font-mono outline-none focus:border-primary min-h-[200px] resize-y"
            value={form.default_pricing_json}
            onChange={(e) => setForm((f) => ({ ...f, default_pricing_json: e.target.value }))}
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text mb-4">Дефолтные CTA тексты (JSON)</h2>
          <textarea
            className="w-full rounded-lg border border-border px-3 py-2 text-sm font-mono outline-none focus:border-primary min-h-[120px] resize-y"
            value={form.default_cta_texts_json}
            onChange={(e) => setForm((f) => ({ ...f, default_cta_texts_json: e.target.value }))}
          />
        </div>

        {/* Save */}
        <div className="pt-4 border-t border-border">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            {saving ? "Сохранение..." : "Сохранить настройки"}
          </button>
        </div>
      </div>
    </div>
  );
}
