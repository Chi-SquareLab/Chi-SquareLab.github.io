import { getCollection } from 'astro:content';
import groups from './collection-groups.json';

/** Both the sidebar and homepage list the same published products in title order. */
export async function getProductGroups() {
  const products = await getCollection('docs', ({ id, data }) =>
    id.startsWith('products/') && (import.meta.env.MODE !== 'production' || !data.draft)
  );
  products.sort((a, b) => a.data.title.localeCompare(b.data.title, 'en') || a.id.localeCompare(b.id));

  return groups.map(group => ({
    ...group,
    products: products.filter(({ data }) => data.collections?.includes(group.id)),
  }));
}
