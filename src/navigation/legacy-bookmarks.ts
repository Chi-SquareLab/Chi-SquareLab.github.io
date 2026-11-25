// The prototype used /#route and /#route/section instead of page URLs.
const pages: Record<string, string> = {
  overview: '/',
  quickstart: '/quickstart/',
  domain: '/#collections',
  statistics: '/#collections',
  science: '/#collections',
  architecture: '/reference/model-architecture/',
  references: '/reference/reading-list/',
};

export function legacyBookmarkTarget(route: string, section?: string): string | undefined {
  if (!Object.hasOwn(pages, route)) return undefined;

  const path = section && ['domain', 'statistics', 'science'].includes(route)
    ? `/examples/${route}/`
    : pages[route];
  return section ? `${path}#${encodeURIComponent(section)}` : path;
}
