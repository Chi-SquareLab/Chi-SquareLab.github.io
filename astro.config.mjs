import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { unified } from '@astrojs/markdown-remark';
import starlight from '@astrojs/starlight';
import tailwind from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://chi-squarelab.github.io',
  output: 'static',
  markdown: { processor: unified({ remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] }) },
  vite: { plugins: [tailwind()] },
  integrations: [
    react(),
    starlight({
      title: 'Tabula',
      description: 'A field guide to tabular models and research tools in statistics and science.',
      favicon: '/assets/atlas.svg',
      pagination: false,
      customCss: ['katex/dist/katex.min.css', './src/styles/utilities.css', './src/styles/tabula.css'],
      components: {
        Header: './src/components/Header.astro',
        MarkdownContent: './src/components/DocContent.astro',
        Sidebar: './src/components/Sidebar.astro',
      },
      sidebar: [
        { slug: 'overview' },
        // Sidebar.astro fills this section from the products' collection memberships.
        { label: 'Collections', collapsed: true, items: [] },
        { label: 'Reference', items: [{ slug: 'reference/model-architecture' }, { slug: 'reference/reading-list' }] },
      ],
    }),
  ],
});
