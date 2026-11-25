// Build-time data for the standalone welcome page.
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'astro/zod';
import records from './research-news.json';
import rawMission from './mission.json';

const field = z.string().trim().min(1);
const hrefOrPath = z.union([z.url({ protocol: /^https?$/ }), z.string().regex(/^\/(?![/\\])/)]);

const coverSchema = z
  .object({
    src: hrefOrPath,
    alt: field,
    caption: field.optional(),
    fit: z.enum(['cover', 'contain']).default('cover'),
  })
  .superRefine((cover, ctx) => {
    if (!cover.src.startsWith('/')) return;
    const relative = cover.src.split(/[?#]/, 1)[0].slice(1);
    const publicRoot = path.resolve(process.cwd(), 'public');
    const resolved = path.resolve(publicRoot, relative);
    const insidePublic = resolved.startsWith(`${publicRoot}${path.sep}`);
    if (!insidePublic || !fs.statSync(resolved, { throwIfNoEntry: false })?.isFile()) {
      ctx.addIssue({
        code: 'custom',
        path: ['src'],
        message: `Local cover asset not found under public/: ${cover.src}`,
      });
    }
  });

const storySchema = z.object({
  date: z.iso.date(),
  kind: field,
  title: field,
  summary: field,
  url: hrefOrPath,
  cover: coverSchema.optional(),
});

export type NewsStory = z.infer<typeof storySchema>;

export const researchNews = z
  .array(storySchema)
  .parse(records)
  .sort((a, b) => b.date.localeCompare(a.date));

const missionSchema = z.object({
  sectionTitle: field,
  statement: z.object({
    lead: field,
    emphasis: field,
  }),
  paragraphs: z.array(field).min(1),
  pillars: z
    .array(
      z.object({
        id: field,
        kicker: field,
        title: field,
        summary: field,
      }),
    )
    .min(1),
});

export const mission = missionSchema.parse(rawMission);
