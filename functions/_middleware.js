const LOCALES = ['en_us', 'ru_ru', 'ar_iq', 'hy_am', 'fa_ir', 'ar_ae'];
const STATIC_PREFIXES = ['/css/', '/js/', '/images/'];
const STATIC_FILES = ['/favicon.svg', '/robots.txt', '/sitemap.xml'];

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // Allow locale-prefixed paths through to static assets
  for (const locale of LOCALES) {
    if (path === `/${locale}` || path.startsWith(`/${locale}/`)) {
      return next(request);
    }
  }

  // Allow static assets through
  for (const prefix of STATIC_PREFIXES) {
    if (path.startsWith(prefix)) {
      return next(request);
    }
  }

  if (STATIC_FILES.includes(path)) {
    return next(request);
  }

  if (path.startsWith('/api/')) {
    return next(request);
  }

  if (path.startsWith('/.well-known/')) {
    return next(request);
  }

  if (path === '/') {
    return Response.redirect(`${url.origin}/en_us/`, 301);
  }

  return Response.redirect(`${url.origin}/en_us${path}`, 301);
}
