import { useState, useMemo } from 'react';

interface Post {
  id: string;
  data: {
    title: string;
    excerpt: string;
    date: string; // ISO String from Astro
    readingTime?: number;
    tags: string[];
    draft?: boolean;
  };
}

interface BlogFilterProps {
  posts: Post[];
  base: string;
}

export default function BlogFilter({ posts, base }: BlogFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('All');

  // Extract all unique tags dynamically from the posts
  const tags = useMemo(() => {
    const allTags = posts.flatMap(post => post.data.tags || []);
    return ['All', ...Array.from(new Set(allTags))];
  }, [posts]);

  // Filter posts based on search query and active tag selection
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesTag = activeTag === 'All' || post.data.tags.includes(activeTag);
      
      const searchLower = searchQuery.toLowerCase().trim();
      const matchesSearch = !searchLower || 
        post.data.title.toLowerCase().includes(searchLower) ||
        post.data.excerpt.toLowerCase().includes(searchLower) ||
        post.data.tags.some(tag => tag.toLowerCase().includes(searchLower));

      return matchesTag && matchesSearch;
    });
  }, [posts, searchQuery, activeTag]);

  // Format date back to a human readable format
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  return (
    <div className="space-y-8">
      {/* Search Input and Filters Container */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5"
              style={{ color: 'var(--color-text-tertiary)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search articles by title, content, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-lg border focus:outline-none transition-all"
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-brand-orange)';
              e.currentTarget.style.boxShadow = '0 0 0 2px color-mix(in srgb, var(--color-brand-orange) 20%, transparent)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              style={{ color: 'var(--color-text-tertiary)' }}
              aria-label="Clear search"
            >
              <svg className="w-5 h-5 hover:text-[var(--color-brand-orange)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Post Count */}
        <div className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
          Showing {filteredPosts.length} of {posts.length} {posts.length === 1 ? 'article' : 'articles'}
        </div>
      </div>

      {/* Filter Tags Pills */}
      <div className="flex flex-wrap gap-2 py-2">
        {tags.map(tag => {
          const isActive = activeTag === tag;
          return (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className="px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer"
              style={
                isActive
                  ? {
                      backgroundColor: 'var(--color-brand-orange)',
                      borderColor: 'var(--color-brand-orange)',
                      color: '#ffffff',
                    }
                  : {
                      backgroundColor: 'var(--color-bg-secondary)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-secondary)',
                    }
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'var(--color-brand-orange)';
                  e.currentTarget.style.color = 'var(--color-brand-orange)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                }
              }}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {/* Blog Cards Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="card-hover blog-card flex flex-col"
              style={{
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                overflow: 'hidden',
                height: '100%',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Meta details */}
                <div className="flex items-center gap-3 text-sm mb-3" style={{ color: 'var(--color-text-tertiary)' }}>
                  <time dateTime={post.data.date}>
                    {formatDate(post.data.date)}
                  </time>
                  <span>•</span>
                  <span>{post.data.readingTime || 5} min read</span>
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold mb-3 hover-text-brand-orange transition-colors">
                  <a href={`${base}blog/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {post.data.title}
                  </a>
                </h3>
                
                {/* Excerpt */}
                <p className="mb-4 leading-relaxed-custom flex-1" style={{ color: 'var(--color-text-secondary)' }}>
                  {post.data.excerpt}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {post.data.tags.slice(0, 3).map(tag => (
                    <span 
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full border"
                      style={{ 
                        background: 'var(--color-bg-tertiary)', 
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text-secondary)' 
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Read More Link */}
                <a 
                  href={`${base}blog/${post.id}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold hover-text-brand-orange transition-colors"
                  style={{ color: 'var(--color-accent-strong)' }}
                >
                  Read More →
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border rounded-xl" style={{ backgroundColor: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}>
          <svg
            className="w-12 h-12 mx-auto mb-4"
            style={{ color: 'var(--color-text-tertiary)' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-bold mb-2">No matching articles found</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Try resetting your search query or choosing a different category.
          </p>
        </div>
      )}
    </div>
  );
}
