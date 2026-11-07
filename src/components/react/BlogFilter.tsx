import { useState, useMemo, useEffect, Fragment } from 'react';
import { LEVELS, LEVEL_LABELS, type Level } from '../../utils/levels';
import { TOPICS, LANGUAGES } from '../../utils/blogFacets';

interface Post {
  id: string;
  data: {
    title: string;
    excerpt: string;
    date: string;
    readingTime?: number;
    tags: string[];
    draft?: boolean;
    level?: Level;
    topics: string[];
    languages: string[];
  };
}

type FacetKey = 'topic' | 'language' | 'level';
type Filters = Record<FacetKey, string>;
const ALL = 'all';
const NO_FILTERS: Filters = { topic: ALL, language: ALL, level: ALL };

function matchesFacet(post: Post, key: FacetKey, value: string) {
  if (value === ALL) return true;
  if (key === 'topic') return post.data.topics.includes(value);
  if (key === 'language') return post.data.languages.includes(value);
  return post.data.level === value;
}

interface BlogFilterProps {
  posts: Post[];
  base: string;
}

const POSTS_PER_PAGE = 9;

export default function BlogFilter({ posts, base }: BlogFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  const searchLower = searchQuery.toLowerCase().trim();
  const matchesSearch = (post: Post) => !searchLower ||
    post.data.title.toLowerCase().includes(searchLower) ||
    post.data.excerpt.toLowerCase().includes(searchLower) ||
    post.data.tags.some(tag => tag.toLowerCase().includes(searchLower));

  // Posts matching the search and every facet except `skip` — used for per-option counts.
  const matchingExcept = (skip?: FacetKey) => posts.filter(post =>
    matchesSearch(post) &&
    (Object.keys(filters) as FacetKey[]).every(key => key === skip || matchesFacet(post, key, filters[key]))
  );

  const filteredPosts = useMemo(() => matchingExcept(), [posts, searchLower, filters]);

  const facets: { key: FacetKey; label: string; options: { value: string; label: string }[] }[] = [
    { key: 'topic', label: 'Topic', options: TOPICS.filter(t => posts.some(p => p.data.topics.includes(t))).map(t => ({ value: t, label: t })) },
    { key: 'language', label: 'Language', options: LANGUAGES.filter(l => posts.some(p => p.data.languages.includes(l))).map(l => ({ value: l, label: l })) },
    { key: 'level', label: 'Level', options: LEVELS.filter(l => posts.some(p => p.data.level === l)).map(l => ({ value: l, label: LEVEL_LABELS[l] })) },
  ];
  const hasActiveFilters = (Object.keys(filters) as FacetKey[]).some(key => filters[key] !== ALL);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchLower, filters]);

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

      {/* Facet filters: topic, language, level */}
      <div className="space-y-3">
        {facets.filter(f => f.options.length > 0).map(facet => {
          const pool = matchingExcept(facet.key);
          return (
            <div key={facet.key} className="flex flex-col sm:flex-row sm:items-start gap-2">
              <span
                id={`facet-${facet.key}`}
                className="text-xs font-semibold uppercase tracking-wider sm:w-20 sm:pt-2 shrink-0"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                {facet.label}
              </span>
              <div className="flex flex-wrap gap-2" role="group" aria-labelledby={`facet-${facet.key}`}>
                {[{ value: ALL, label: 'All' }, ...facet.options].map(option => {
                  const active = filters[facet.key] === option.value;
                  const count = option.value === ALL
                    ? pool.length
                    : pool.filter(post => matchesFacet(post, facet.key, option.value)).length;
                  const disabled = count === 0 && !active;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFilters(f => ({ ...f, [facet.key]: option.value }))}
                      aria-pressed={active}
                      disabled={disabled}
                      className="text-sm px-3 py-1.5 rounded-full border transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        background: active ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                        borderColor: active ? 'var(--color-accent)' : 'var(--color-border)',
                        color: active ? '#ffffff' : 'var(--color-text-secondary)',
                      }}
                    >
                      {option.label}
                      <span className="ml-1.5 text-xs" style={{ opacity: 0.75 }}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => setFilters(NO_FILTERS)}
            className="text-sm font-medium sm:ml-[5.5rem] hover-text-brand-orange transition-colors"
            style={{ color: 'var(--color-accent-strong)' }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Blog post list */}
      {filteredPosts.length > 0 ? (
        <>
          <ul className="border-t" style={{ borderColor: 'var(--color-border)' }}>
            {paginatedPosts.map((post) => (
              <li
                key={post.id}
                className="blog-row group relative border-b py-6 md:grid md:grid-cols-[9rem_1fr] md:gap-8"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div className="flex md:flex-col gap-x-3 gap-y-1 text-sm mb-2 md:mb-0 md:pt-1" style={{ color: 'var(--color-text-tertiary)' }}>
                  <time dateTime={post.data.date}>{formatDate(post.data.date)}</time>
                  <span className="md:hidden" aria-hidden="true">•</span>
                  <span>{post.data.readingTime || 5} min read</span>
                  {post.data.draft && (
                    <span
                      className="self-start text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: 'var(--color-brand-orange)', color: '#ffffff' }}
                    >
                      Draft
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="text-xl font-bold mb-2 transition-colors group-hover:text-[var(--color-accent-strong)]">
                    <a
                      href={`${base}blog/${post.id}`}
                      className="after:absolute after:inset-0 after:content-['']"
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {post.data.title}
                    </a>
                  </h3>

                  <p className="mb-3 leading-relaxed-custom line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
                    {post.data.excerpt}
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    {post.data.level && (
                      <span className="level-badge" title={`Level: ${LEVEL_LABELS[post.data.level]}`}>
                        <span className="level-dots" aria-hidden="true">
                          {LEVELS.map((level, i) => (
                            <span key={level} className={i <= LEVELS.indexOf(post.data.level!) ? 'is-on' : undefined} />
                          ))}
                        </span>
                        {LEVEL_LABELS[post.data.level]}
                      </span>
                    )}
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
                      <span className="text-xs px-1 py-1" style={{ color: 'var(--color-text-tertiary)' }}>
                        +{post.data.tags.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>

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
            Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  );
}