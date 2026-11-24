import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';

// Only product pages use these fields. Catalog-wide requirements (including
// valid memberships and an in-page tutorial) are checked before each build.
export const collections = {
  i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        collections: z.array(z.string()).optional(),
        delivery: z.array(z.string()).optional(),
        maintainer: z.string().optional(),
        source: z.string().optional(),
        status: z.enum(['Preview', 'Released', 'Archived']).optional(),
        release: z.string().optional(),
        access: z.string().optional(),
        demo: z.boolean().optional(),
      }),
    }),
  }),
};
