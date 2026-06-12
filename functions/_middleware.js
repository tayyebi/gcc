var LOCALES = ['en_us', 'ru_ru', 'ar_iq', 'hy_am', 'fa_ir', 'ar_ae'];
var STATIC_PREFIXES = ['/css/', '/js/', '/images/'];
var STATIC_FILES = ['/favicon.svg', '/robots.txt', '/sitemap.xml', '/index.xml', '/index.json'];

export async function onRequest(context) {
  var request = context.request;
  var next = context.next;
  var url = new URL(request.url);
  var path = url.pathname;

  // ---- Normalize URL ----
  var normalized = path.toLowerCase()
    .replace(/\/+/g, '/')
    .replace(/\/+$/, '');           // strip trailing slashes temporarily

  // Add trailing slash for paths without a file extension (pages, not files)
  if (normalized !== '/' && !/\.[a-z0-9]+$/.test(normalized)) {
    normalized += '/';
  }

  // If normalization changed the path, redirect (preserve query string)
  if (normalized !== path) {
    return Response.redirect(url.origin + normalized + (url.search || ''), 301);
  }

  // ---- Route ----

  // Allow locale-prefixed pages through
  if (matchesLocale(path)) {
    return next(request);
  }

  // Allow static assets through
  if (startsWithAny(path, STATIC_PREFIXES) || STATIC_FILES.includes(path)) {
    return next(request);
  }

  // Allow API and well-known
  if (path.startsWith('/api/') || path.startsWith('/.well-known/')) {
    return next(request);
  }

  // Redirect root to default locale
  if (path === '/') {
    return Response.redirect(url.origin + '/en_us/', 301);
  }

  // Redirect all other paths to the default locale
  return Response.redirect(url.origin + '/en_us' + path, 301);
}

function matchesLocale(path) {
  for (var i = 0; i < LOCALES.length; i++) {
    var l = '/' + LOCALES[i];
    if (path === l || path.startsWith(l + '/')) {
      return true;
    }
  }
  return false;
}

function startsWithAny(s, prefixes) {
  for (var i = 0; i < prefixes.length; i++) {
    if (s.startsWith(prefixes[i])) return true;
  }
  return false;
}
