"""Slug validation service [RISK-05, RISK-01]."""

import re

RESERVED_SLUGS = frozenset({
    "admin", "api", "ru", "en", "_next",
    "robots.txt", "sitemap.xml", "favicon.ico",
})

PAGE_PATTERN = re.compile(r"^page\d+$")


def validate_slug(slug: str) -> list[str]:
    """Validate a slug against reserved values and forbidden patterns.

    Returns a list of error messages (empty = valid).
    """
    errors: list[str] = []
    if slug in RESERVED_SLUGS:
        errors.append(f"Slug '{slug}' is reserved and cannot be used")
    if PAGE_PATTERN.match(slug):
        errors.append(f"Slug '{slug}' matches forbidden pattern 'pageN'")
    return errors
