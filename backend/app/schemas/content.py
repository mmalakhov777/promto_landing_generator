"""Pydantic models for JSONB field validation [RISK-07]."""

from pydantic import BaseModel, Field


class SocialProofItem(BaseModel):
    label: str
    value: str


class AdvantageItem(BaseModel):
    icon: str = ""
    title: str
    description: str


class HowItWorksStep(BaseModel):
    step: int
    title: str
    description: str
    image_url: str = ""


class ExampleItem(BaseModel):
    image_url: str = ""
    title: str
    description: str = ""
    url: str = ""


class PricingPlan(BaseModel):
    name: str
    price: str
    features: list[str] = Field(default_factory=list)
    cta_url: str = ""
    is_popular: bool = False


class ReviewItem(BaseModel):
    author: str
    text: str
    rating: int = Field(ge=1, le=5, default=5)
    avatar_url: str = ""


class FaqItem(BaseModel):
    question: str
    answer: str


class CtaTexts(BaseModel):
    cta_mid_title: str = ""
    cta_mid_subtitle: str = ""
    cta_final_title: str = ""
    cta_final_subtitle: str = ""
    cta_final_button_text: str = ""
