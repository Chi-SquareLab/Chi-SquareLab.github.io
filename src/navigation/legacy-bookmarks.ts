// These retired category IDs still appear in both /collections/<id>/ URLs
// and the prototype's /#<id> and /#<id>/<section> bookmarks.
export const legacyCollectionIds: readonly string[] = ['domain', 'statistics', 'science'];
export const quickstartSectionIds: readonly string[] = ['s0', 's1', 's2', 'sources'];
export const overviewPath = '/overview/';

// Content anchors from the Overview that previously lived at /.
const overviewAnchors = new Set([
  '_top',
  'what-is-a-tfm',
  'what-can-a-tfm-do',
  ...quickstartSectionIds,
  'our-products',
  'collections',
  'tabula-directory-models',
  'tabula-directory-tasks',
  'tabula-directory-applications',
  'next-steps',
]);

const pages: Record<string, string> = {
  overview: overviewPath,
  architecture: '/reference/model-architecture/',
  references: '/reference/reading-list/',
};

export function legacyBookmarkTarget(route: string, section?: string): string | undefined {
  if (route === 'quickstart') {
    const anchor = section && quickstartSectionIds.includes(section) ? section : 'quickstart';
    return `${overviewPath}#${anchor}`;
  }
  if (route === 'overview' && section === 'example') return `${overviewPath}#quickstart`;
  if (legacyCollectionIds.includes(route)) {
    return section ? `/examples/${route}/#${encodeURIComponent(section)}` : `${overviewPath}#collections`;
  }
  if (!Object.hasOwn(pages, route)) return undefined;
  const path = pages[route];
  return section ? `${path}#${encodeURIComponent(section)}` : path;
}

/** Resolve old root bookmarks while leaving the welcome page's own anchors in place. */
export function welcomeBookmarkTarget(hash: string): string | undefined {
  if (!hash.startsWith('#')) return undefined;
  const [rawRoute, rawSection] = hash.slice(1).split('/', 2);
  try {
    const route = decodeURIComponent(rawRoute);
    const section = rawSection ? decodeURIComponent(rawSection) : undefined;
    if (!section && overviewAnchors.has(route)) return `${overviewPath}#${route}`;
    return legacyBookmarkTarget(route, section);
  } catch {
    return undefined;
  }
}
