import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

export async function getVisibleBlogPosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog');
  return import.meta.env.DEV ? posts : posts.filter((post) => !post.data.draft);
}

/** Newest first; posts of a series published on the same day list their later parts first. */
export function byNewest(a: BlogPost, b: BlogPost): number {
  return b.data.date.getTime() - a.data.date.getTime() || (b.data.seriesOrder ?? 0) - (a.data.seriesOrder ?? 0);
}

export function readingTime(post: BlogPost): number {
  return post.data.readingTime ?? 5;
}

/** "Nov 7, 2026". UTC, so a date-only frontmatter value never shifts a day at build time. */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }).format(date);
}
