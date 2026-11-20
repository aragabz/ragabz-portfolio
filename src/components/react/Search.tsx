import { useEffect, useRef, useState } from 'react';

// Minimal typing for the parts of the Pagefind JS API we use.
interface PagefindResultData {
  url: string;
  excerpt: string;
  meta: { title?: string };
}
interface Pagefind {
  options(opts: { baseUrl: string }): Promise<void>;
  search(query: string): Promise<{ results: Array<{ id: string; data(): Promise<PagefindResultData> }> } | null>;
}

interface SearchResult extends PagefindResultData {
  id: string;
}

type Status = 'idle' | 'loading' | 'ready' | 'unavailable';

const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : import.meta.env.BASE_URL + '/';

// Pagefind is generated into dist/ after `astro build`, so it can only be
// imported at runtime, and only exists after a full `yarn build`.
let pagefindPromise: Promise<Pagefind> | null = null;
function loadPagefind(): Promise<Pagefind> {
  pagefindPromise ??= import(/* @vite-ignore */ `${base}pagefind/pagefind.js`).then(async (pagefind: Pagefind) => {
    await pagefind.options({ baseUrl: base });
    return pagefind;
  });
  pagefindPromise.catch(() => {
    pagefindPromise = null;
  });
  return pagefindPromise;
}

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const latestQuery = useRef('');

  const openSearch = () => {
    dialogRef.current?.showModal();
    inputRef.current?.focus();
    if (status === 'idle') {
      setStatus('loading');
      loadPagefind().then(
        () => setStatus('ready'),
        () => setStatus('unavailable'),
      );
    }
  };

  // Cmd+K / Ctrl+K opens search from anywhere on the page.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const runSearch = async (value: string) => {
    setQuery(value);
    latestQuery.current = value;

    if (!value.trim()) {
      setResults([]);
      return;
    }

    try {
      const pagefind = await loadPagefind();
      const search = await pagefind.search(value);
      const data = await Promise.all(
        (search?.results ?? []).slice(0, 5).map(async (r) => ({ id: r.id, ...(await r.data()) })),
      );
      // Ignore responses for queries the user has already typed past.
      if (latestQuery.current === value) setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const resetSearch = () => {
    setQuery('');
    setResults([]);
    latestQuery.current = '';
  };

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        aria-label="Search articles and projects"
        className="search-trigger"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <span>Search</span>
        <kbd className="hidden sm:inline">⌘K</kbd>
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Search"
        onClose={resetSearch}
        onClick={(e) => {
          // Close when the backdrop (the dialog element itself) is clicked.
          if (e.target === dialogRef.current) dialogRef.current.close();
        }}
        className="search-dialog"
      >
        <div style={{ padding: '1.5rem' }}>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => runSearch(e.target.value)}
            placeholder="Search articles, projects..."
            aria-label="Search query"
            className="search-input"
          />

          <div style={{ maxHeight: '60vh', overflowY: 'auto' }} aria-live="polite">
            {status === 'unavailable' ? (
              <p className="search-hint">Search isn't available in this build. Run a full <code>yarn build</code>.</p>
            ) : !query.trim() ? (
              <p className="search-hint">
                Start typing to search articles and projects. Press <kbd>Esc</kbd> to close.
              </p>
            ) : results.length === 0 ? (
              <p className="search-hint">No results for “{query}”</p>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {results.map((result) => (
                  <li key={result.id}>
                    <a href={result.url} className="search-result">
                      <h3>{result.meta.title ?? result.url}</h3>
                      {/* Pagefind excerpts are HTML-escaped text with <mark> highlights. */}
                      <p dangerouslySetInnerHTML={{ __html: result.excerpt }} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
