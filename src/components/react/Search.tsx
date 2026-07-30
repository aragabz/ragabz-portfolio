import { useEffect, useRef, useState } from 'react';

interface SearchProps {
  className?: string;
}

export default function Search({ className = '' }: SearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Pagefind
  useEffect(() => {
    // Load Pagefind dynamically after build
    const loadPagefind = async () => {
      if (typeof window !== 'undefined') {
        try {
          // Use fetch to check if pagefind exists (generated post-build)
          const script = document.createElement('script');
          script.src = '/pagefind/pagefind.js';
          script.type = 'module';
          script.onload = async () => {
            // @ts-ignore
            if (window.pagefind) {
              console.log('Pagefind loaded successfully');
            }
          };
          script.onerror = () => {
            console.warn('Pagefind not available. Run full build to generate search index.');
          };
          document.head.appendChild(script);
        } catch (error) {
          console.warn('Pagefind not loaded yet.');
        }
      }
    };
    loadPagefind();
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        closeSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const openSearch = () => {
    setIsOpen(true);
    dialogRef.current?.showModal();
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const closeSearch = () => {
    setIsOpen(false);
    dialogRef.current?.close();
    setQuery('');
  };

  const handleSearch = async (value: string) => {
    setQuery(value);
    
    if (!value.trim()) {
      if (searchContainerRef.current) {
        searchContainerRef.current.innerHTML = '';
      }
      return;
    }

    try {
      // @ts-ignore
      if (window.pagefind) {
        // @ts-ignore
        const search = await window.pagefind.search(value);
        const results = await Promise.all(search.results.slice(0, 5).map((r: any) => r.data()));
        
        if (searchContainerRef.current) {
          searchContainerRef.current.innerHTML = results
            .map(
              (result: any) => `
                <a 
                  href="${result.url}" 
                  class="search-result"
                  style="
                    display: block;
                    padding: 1rem;
                    margin-bottom: 0.5rem;
                    background: var(--color-bg-secondary);
                    border-radius: 8px;
                    text-decoration: none;
                    color: var(--color-text);
                    transition: all 0.2s ease;
                  "
                  onmouseover="this.style.background='var(--color-bg-tertiary)'"
                  onmouseout="this.style.background='var(--color-bg-secondary)'"
                >
                  <h3 style="
                    font-size: 1.125rem;
                    font-weight: 600;
                    margin: 0 0 0.5rem 0;
                    color: var(--color-brand-orange);
                  ">${result.meta.title}</h3>
                  <p style="
                    font-size: 0.875rem;
                    color: var(--color-text-secondary);
                    margin: 0;
                    line-height: 1.5;
                  ">${result.excerpt}</p>
                </a>
              `
            )
            .join('');
        }
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <>
      {/* Search Button */}
      <button
        onClick={openSearch}
        className={className}
        aria-label="Open search"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          color: 'var(--color-text-secondary)',
          cursor: 'pointer',
          fontSize: '0.875rem',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--color-bg-tertiary)';
          e.currentTarget.style.borderColor = 'var(--color-brand-orange)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--color-bg-secondary)';
          e.currentTarget.style.borderColor = 'var(--color-border)';
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <span>Search</span>
        <kbd
          style={{
            padding: '0.125rem 0.375rem',
            background: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontFamily: 'monospace',
          }}
        >
          ⌘K
        </kbd>
      </button>

      {/* Search Dialog */}
      <dialog
        ref={dialogRef}
        style={{
          width: '90%',
          maxWidth: '600px',
          maxHeight: '80vh',
          padding: 0,
          border: 'none',
          borderRadius: '12px',
          background: 'var(--color-bg)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          color: 'var(--color-text)',
        }}
        onClick={(e) => {
          // Close if clicking backdrop
          if (e.target === dialogRef.current) {
            closeSearch();
          }
        }}
      >
        <div style={{ padding: '1.5rem' }}>
          {/* Search Input */}
          <div
            style={{
              position: 'relative',
              marginBottom: '1rem',
            }}
          >
            <svg
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-secondary)',
              }}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search articles, projects..."
              aria-label="Search"
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 3rem',
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                color: 'var(--color-text)',
                fontSize: '1rem',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-brand-orange)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
              }}
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  if (searchContainerRef.current) {
                    searchContainerRef.current.innerHTML = '';
                  }
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* Search Results */}
          <div
            ref={searchContainerRef}
            style={{
              maxHeight: '60vh',
              overflowY: 'auto',
            }}
          />

          {/* Help Text */}
          {!query && (
            <div
              style={{
                textAlign: 'center',
                padding: '2rem',
                color: 'var(--color-text-secondary)',
                fontSize: '0.875rem',
              }}
            >
              <p style={{ margin: 0 }}>
                Start typing to search articles and projects...
              </p>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem' }}>
                Press <kbd style={{ 
                  padding: '0.125rem 0.375rem', 
                  background: 'var(--color-bg-secondary)', 
                  borderRadius: '4px' 
                }}>ESC</kbd> to close
              </p>
            </div>
          )}

          {/* No Results */}
          {query && searchContainerRef.current?.innerHTML === '' && (
            <div
              style={{
                textAlign: 'center',
                padding: '2rem',
                color: 'var(--color-text-secondary)',
                fontSize: '0.875rem',
              }}
            >
              No results found for "{query}"
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
