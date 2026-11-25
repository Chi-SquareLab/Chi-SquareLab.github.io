// Check editorial constraints that span multiple Starlight docs entries.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import groups from '../src/data/collection-groups.json' with { type: 'json' };

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const docs = join(root, 'src/content/docs');
const ids = (folder) => readdirSync(join(docs, folder))
  .filter((file) => file.endsWith('.mdx')).map((file) => file.slice(0, -4));
const categories = new Set();
for (const { id, label } of groups) {
  if (typeof id !== 'string' || !/^[a-z][a-z0-9-]*$/.test(id) || categories.has(id)) {
    throw new Error(`Invalid or duplicate collection group ID: ${id}`);
  }
  if (typeof label !== 'string' || !label.trim()) throw new Error(`Missing display label for ${id}`);
  categories.add(id);
}
const records = ids('products');
const parser = unified().use(remarkParse);
const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const isHttpUrl = (value) => {
  if (!isNonEmptyString(value)) return false;
  try {
    return /^https?:$/.test(new URL(value).protocol);
  } catch {
    return false;
  }
};

for (const id of records) {
  const require = (ok, message) => { if (!ok) throw new Error(`products/${id}: ${message}`); };
  require(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id), 'use a stable, lowercase product ID');
  const file = readFileSync(join(docs, 'products', `${id}.mdx`), 'utf8').replace(/\r\n/g, '\n');
  const match = /^---\n([\s\S]*?)\n---(?:\n|$)/.exec(file);
  require(match, 'missing YAML frontmatter');
  const meta = parseYaml(match[1]);

  // Common required product identity fields.
  for (const key of ['title', 'description', 'maintainer', 'source']) {
    require(isNonEmptyString(meta[key]), `missing ${key}`);
  }
  require(['Preview', 'Released', 'Archived'].includes(meta.status), 'unknown publication status');

  // Optional common fields (validated when present).
  if (meta.release !== undefined) {
    require(isNonEmptyString(meta.release), 'release must be a non-empty string when provided');
  }
  if (meta.access !== undefined) {
    require(isNonEmptyString(meta.access), 'access must be a non-empty string when provided');
  }
  if (meta.delivery !== undefined) {
    require(
      Array.isArray(meta.delivery) && meta.delivery.length && meta.delivery.every(isNonEmptyString),
      'delivery must be a non-empty list of strings when provided',
    );
  }

  require(Array.isArray(meta.collections) && meta.collections.length, 'select at least one collection');
  require(meta.collections.every(c => categories.has(c)), 'unknown collection ID');
  require(new Set(meta.collections).size === meta.collections.length, 'duplicate collection ID');

  if (meta.source.startsWith('/')) {
    const publicDir = resolve(root, 'public');
    const source = resolve(publicDir, `.${meta.source}`);
    require(source.startsWith(`${publicDir}${sep}`) && statSync(source, { throwIfNoEntry: false })?.isFile(), 'local source file missing');
  } else {
    require(isHttpUrl(meta.source), 'source must be an HTTP(S) URL or public file path');
  }

  // Collection-specific metadata protocol: models.
  if (meta.collections.includes('models')) {
    require(meta.model && typeof meta.model === 'object' && !Array.isArray(meta.model), 'models products require a model metadata block');
    require(isNonEmptyString(meta.model.domain), 'model.domain is required for models products');
    require(
      Array.isArray(meta.model.tasks) && meta.model.tasks.length && meta.model.tasks.every(isNonEmptyString),
      'model.tasks must be a non-empty list of strings',
    );
    require(isNonEmptyString(meta.model.baseModel), 'model.baseModel is required for models products');
    if (meta.model.weights !== undefined) {
      require(isHttpUrl(meta.model.weights), 'model.weights must be an HTTP(S) URL');
    }
    if (meta.model.paper !== undefined) {
      require(isHttpUrl(meta.model.paper), 'model.paper must be an HTTP(S) URL');
    }
  }

  const blocks = parser.parse(file.slice(match[0].length)).children;
  const tutorials = blocks.filter(node => node.type === 'heading' && node.depth === 2 && node.children[0]?.value === 'Tutorial');
  require(tutorials.length === 1, 'include exactly one ## Tutorial on the product page');
  const rest = blocks.slice(blocks.indexOf(tutorials[0]) + 1);
  const end = rest.findIndex(node => node.type === 'heading' && node.depth <= 2);
  const steps = end === -1 ? rest : rest.slice(0, end);
  require(steps.some(node => node.type === 'paragraph' || node.type === 'code' || node.type === 'list'), 'Tutorial needs instructions, not just headings');
}
console.log(`Catalog checked: ${categories.size} collections, ${records.length} distinct products.`);
