import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  return {
    title: `${t("siteName")} — ${t("description")}`,
    description: t("description"),
  };
}

export default function HomePage() {
  const t = useTranslations("common");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-primary">
          {t("siteName")}
        </h1>
        <p className="text-xl text-text-muted">{t("comingSoon")}</p>
        <p className="text-text-muted">{t("description")}</p>
      </div>
    </main>
  );
}
