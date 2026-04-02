export default async (request: Request) => {
  const url = new URL(request.url);
  const path = url.pathname;

  // Replace multiple consecutive slashes with a single slash
  const cleaned = path.replace(/\/{2,}/g, '/');

  // Remove trailing slash (except for root)
  const final = cleaned.length > 1 ? cleaned.replace(/\/$/, '') : cleaned;

  if (final !== path) {
    return Response.redirect(new URL(final + url.search, url.origin), 301);
  }
};

export const config = { path: '/*' };
