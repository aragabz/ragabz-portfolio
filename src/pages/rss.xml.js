import rss from '@astrojs/rss';
import { getVisibleBlogPosts } from '../utils/blog';

export async function GET(context) {
  const blog = await getVisibleBlogPosts();
  
  return rss({
    title: 'Ahmed Ragab - Blog',
    description: 'Software Engineer sharing insights on web development, React, TypeScript, and modern technologies.',
    site: context.site,
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.excerpt,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
    })),
    customData: `<language>en-us</language>`,
  });
}
