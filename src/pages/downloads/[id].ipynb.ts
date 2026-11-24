import type { APIRoute, GetStaticPaths } from 'astro';
import { legacyArticles, type LegacyArticleData } from '../../data/legacy-articles.ts';

export const getStaticPaths: GetStaticPaths = () =>
  Object.entries(legacyArticles).map(([id, article]) => ({
    params: { id },
    props: { article },
  }));

function markdown(source: string) {
  return { cell_type: 'markdown', metadata: {}, source: [source] };
}

export const GET: APIRoute<{ article: LegacyArticleData }> = ({ props: { article } }) => {
  const cells = [
    markdown(`# ${article.title}\n\n${article.intro}`),
    ...article.sections.flatMap(({ title, text, code }) => [
      markdown(`## ${title}\n\n${text}`),
      ...(code ? [{ cell_type: 'code', execution_count: null, metadata: {}, outputs: [], source: [code] }] : []),
    ]),
    markdown(`## Sources\n\n${article.sources.map(({ label, url }) => `- [${label}](${url})`).join('\n')}`),
  ];

  return new Response(JSON.stringify({
    cells,
    metadata: {
      kernelspec: { display_name: 'Python 3', language: 'python', name: 'python3' },
    },
    nbformat: 4,
    nbformat_minor: 4,
  }, null, 2), { headers: { 'Content-Type': 'application/x-ipynb+json' } });
};
