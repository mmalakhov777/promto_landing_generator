export interface User {
  id: number;
  email: string;
  role: "admin" | "editor";
  is_active: boolean;
  created_at: string;
}

export interface Category {
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
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Landing {
  id: number;
  category_id: number;
  slug: string;
  keyword_ru: string;
  keyword_en: string;
  search_volume: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
  contents?: LandingContent[];
  sections?: LandingSection[];
}

export interface LandingContent {
  id: number;
  landing_id: number;
  locale: "ru" | "en";
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
}

export interface LandingSection {
  id: number;
  landing_id: number;
  section_type: string;
  is_enabled: boolean;
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

export interface SiteSettings {
  id: number;
  metrika_id: string;
  smartcaptcha_client_key: string;
  platform_url: string;
  default_pricing: PricingPlan[] | null;
  default_cta_texts: Record<string, string> | null;
  social_proof_defaults: SocialProofItem[] | null;
  default_video_url: string;
  updated_at: string;
}

export interface LandingListResponse {
  items: Landing[];
  total: number;
  page: number;
  per_page: number;
}

export interface DashboardStats {
  total_landings: number;
  published: number;
  drafts: number;
  categories: number;
}
