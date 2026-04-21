/** Public API response types — mirrors backend Pydantic schemas */

export type Locale = "ru" | "en";

export interface PublicCategory {
  id: number;
  slug: string;
  name_ru: string;
  name_en: string;
  description_ru: string;
  description_en: string;
  meta_title_ru: string;
  meta_title_en: string;
  meta_description_ru: string;
  meta_description_en: string;
  landing_count: number;
}

export interface PublicLandingListItem {
  title: string;
  slug: string;
  category_slug: string;
  full_url: string;
  keyword: string;
  search_volume: number;
  locale: string;
}

export interface PublicLandingListResponse {
  items: PublicLandingListItem[];
  total: number;
  page: number;
  per_page: number;
}

export interface SocialProofItem {
  label: string;
  value: string;
}

export interface AdvantageItem {
  icon: string;
  title: string;
  description: string;
}

export interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
  image_url: string;
}

export interface ExampleItem {
  image_url: string;
  title: string;
  description: string;
  url: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  features: string[];
  cta_url: string;
  is_popular: boolean;
}

export interface ReviewItem {
  author: string;
  text: string;
  rating: number;
  avatar_url: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PublicLandingDetail {
  slug: string;
  category_slug: string;
  meta_title: string;
  meta_description: string;
  h1: string;
  og_title: string;
  og_description: string;
  og_image_url: string;
  hero_title: string;
  hero_subtitle: string;
  hero_cta_text: string;
  hero_placeholder: string;
  social_proof: SocialProofItem[] | null;
  advantages: AdvantageItem[] | null;
  how_it_works: HowItWorksStep[] | null;
  examples: ExampleItem[] | null;
  video_url: string;
  video_title: string;
  pricing: PricingPlan[] | null;
  reviews: ReviewItem[] | null;
  faq: FaqItem[] | null;
  cta_mid_title: string;
  cta_mid_subtitle: string;
  cta_final_title: string;
  cta_final_subtitle: string;
  cta_final_button_text: string;
  enabled_sections: string[];
}

export interface SitemapItem {
  slug: string;
  category_slug: string;
  landing_slug: string;
  updated_at: string;
  locales: string[];
}

export interface PublicSettings {
  metrika_id: string;
  smartcaptcha_client_key: string;
  platform_url: string;
}
