"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/admin-api";
import type { Landing, Category } from "@/types/admin";

interface Stats {
  totalLandings: number;
  published: number;
  drafts: number;
  categories: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalLandings: 0,
    published: 0,
    drafts: 0,
    categories: 0,
  });
  const [recentLandings, setRecentLandings] = useState<Landing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [landingsAll, landingsPub, cats] = await Promise.all([
          adminApi.get<{ total: number }>("/landings", { params: { per_page: "1" } }),
          adminApi.get<{ total: number }>("/landings", { params: { per_page: "1", is_published: "true" } }),
          adminApi.get<Category[]>("/categories"),
        ]);

        setStats({
          totalLandings: landingsAll.total,
          published: landingsPub.total,
          drafts: landingsAll.total - landingsPub.total,
          categories: cats.length,
        });

        const recent = await adminApi.get<{ items: Landing[] }>("/landings", {
          params: { per_page: "5", sort: "updated_at" },
        });
        setRecentLandings(recent.items);
      } catch {
        // Stats will show 0
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statCards = [
    { label: "Всего лендингов", value: stats.totalLandings, color: "text-primary" },
    { label: "Опубликовано", value: stats.published, color: "text-success" },
    { label: "Черновиков", value: stats.drafts, color: "text-warning" },
    { label: "Категорий", value: stats.categories, color: "text-accent" },
  ];

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Dashboard</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/landings?new=1"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
          >
            + Новый лендинг
          </Link>
          <Link
            href="/admin/categories"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text hover:bg-surface transition-colors"
          >
            + Категория
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-border bg-white p-5">
            <p className="text-sm text-text-muted">{card.label}</p>
            <p className={`mt-1 text-3xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent landings */}
      <div className="rounded-xl border border-border bg-white">
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-semibold text-text">Последние изменения</h2>
        </div>
        <div className="divide-y divide-border">
          {recentLandings.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-text-muted">Нет лендингов</p>
          ) : (
            recentLandings.map((landing) => (
              <Link
                key={landing.id}
                href={`/admin/landings/${landing.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-surface/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-text">{landing.keyword_ru || landing.slug}</p>
                  <p className="text-sm text-text-muted">/{landing.slug}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      landing.is_published
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {landing.is_published ? "Опубликован" : "Черновик"}
                  </span>
                  <span className="text-xs text-text-muted">
                    {new Date(landing.updated_at).toLocaleDateString("ru")}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
