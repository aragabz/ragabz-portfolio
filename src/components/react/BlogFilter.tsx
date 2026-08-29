import { useState, useMemo, useEffect, Fragment } from 'react';

interface Post {
  id: string;
  data: {
    title: string;
    excerpt: string;
    date: string;
    readingTime?: number;
    tags: string[];
    draft?: boolean;
  };
}

interface BlogFilterProps {
  posts: Post[];
  base: string;
}

const POSTS_PER_PAGE = 9;

export default function BlogFilter({ posts, base }: BlogFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter posts based on search query and active tag
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

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTag]);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const pages = [1];
    if (currentPage > 3) pages.push(-1); // ellipsis
    
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (currentPage < totalPages - 2) pages.push(-1); // ellipsis
    if (totalPages > 1) pages.push(totalPages);
    
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5" style={{ color: 'var(--color-text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
            Showing <strong>{paginatedPosts.length}</strong> of <strong>{filteredPosts.length}</strong> {filteredPosts.length === 1 ? 'article' : 'articles'}
          </div>
        </div>
      </div>

      {/* Blog Cards Grid */}
      {filteredPosts.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 gap-8">
            {paginatedPosts.map((post) => (
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
                  <div className="flex items-center gap-3 text-sm mb-3" style={{ color: 'var(--color-text-tertiary)' }}>
                    <time dateTime={post.data.date}>
                      {formatDate(post.data.date)}
                    </time>
                    <span>•</span>
                    <span>{post.data.readingTime || 5} min read</span>
                    {post.data.draft && (
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: 'var(--color-brand-orange)',
                          color: '#ffffff',
                        }}
                      >
                        Draft
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 hover-text-brand-orange transition-colors">
                    <a href={`${base}blog/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {post.data.title}
                    </a>
                  </h3>
                  
                  <p className="mb-4 leading-relaxed-custom flex-1" style={{ color: 'var(--color-text-secondary)' }}>
                    {post.data.excerpt}
                  </p>
                  
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
                    {post.data.tags.length > 3 && (
                      <span className="text-xs px-3 py-1 rounded-full" style={{ color: 'var(--color-text-tertiary)' }}>
                        +{post.data.tags.length - 3} more
                      </span>
                    )}
                  </div>
                  
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2" aria-label="Blog pagination">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
                aria-label="Previous page"
              >
                ← Prev
              </button>
              
              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => (
                  <Fragment key={index}>
                    {page === -1 ? (
                      <span className="px-3 py-2" style={{ color: 'var(--color-text-tertiary)' }}>
                        …
                      </span>
                    ) : (
                      <button
                        onClick={() => goToPage(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${page === currentPage ? 'active' : ''}`}
                        style={{
                          backgroundColor: page === currentPage ? 'var(--color-brand-orange)' : 'var(--color-bg-secondary)',
                          borderColor: page === currentPage ? 'var(--color-brand-orange)' : 'var(--color-border)',
                          color: page === currentPage ? '#ffffff' : 'var(--color-text)',
                        }}
                        aria-label={`Page ${page}`}
                        aria-current={page === currentPage ? 'page' : undefined}
                      >
                        {page}
                      </button>
                    )}
                  </Fragment>
                ))}
              </div>
              
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
                aria-label="Next page"
              >
                Next →
              </button>
            </nav>
          )}
        </>
      ) : (
        <div className="text-center py-16 border rounded-xl" style={{ backgroundColor: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)' }}>
          <svg className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-bold mb-2">No matching articles found</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Try adjusting your search query.
          </p>
        </div>
      )}
    </div>
  );
}