import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

export async function getVisibleBlogPosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog');
  return import.meta.env.DEV ? posts : posts.filter((post) => !post.data.draft);
}
