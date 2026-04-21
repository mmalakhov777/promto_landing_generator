import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Onest } from "next/font/google";
import "@/styles/globals.css";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { ScrollToTop } from "@/components/landing/ScrollToTop";
import { YandexMetrika } from "@/components/landing/YandexMetrika";
import { getPublicSettings } from "@/lib/public-api";
import type { Locale } from "@/types/public";

const onest = Onest({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-onest",
});

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return [{ locale: "ru" }, { locale: "en" }];
}

export default async function LpLocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  let platformUrl = "https://app.promto.ai";
  let metrikaId = "";
  try {
    const settings = await getPublicSettings();
    platformUrl = settings.platform_url || platformUrl;
    metrikaId = settings.metrika_id || "";
  } catch {
    // Use defaults if API unavailable
  }

  return (
    <html lang={locale} className={onest.variable}>
      <body className="font-sans bg-background text-text antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header locale={locale as Locale} platformUrl={platformUrl} />
          <main className="min-h-screen">{children}</main>
          <Footer platformUrl={platformUrl} />
          <ScrollToTop />
          <YandexMetrika id={metrikaId} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
