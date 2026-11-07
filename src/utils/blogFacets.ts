// Filter facets for the blog index, derived from each post so authors don't
// maintain extra frontmatter: topics come from tags, languages from the code
// blocks actually present in the post body.

/** Topic label → tags that place a post in it. A post can have several topics. */
const TOPIC_TAGS: Record<string, string[]> = {
  Backend: ['Backend', 'Spring Boot', 'Microservices', 'API Design', 'OpenAPI', 'Databases', 'PostgreSQL', 'Hibernate', 'JPA'],
  Android: ['Android', 'Jetpack Compose', 'Room'],
  Multiplatform: ['Kotlin Multiplatform', 'KMP', 'Compose Multiplatform'],
  Frontend: ['React', 'React Native', 'TypeScript', 'JavaScript'],
  'Data Engineering': ['Data Engineering', 'Apache Airflow', 'ETL'],
  DevOps: ['DevOps', 'CI/CD', 'GitHub Actions', 'Kubernetes'],
  Security: ['Security', 'Authentication', 'Authorization', 'JWT', 'OAuth'],
  'Architecture & System Design': ['Architecture', 'System Design', 'Distributed Systems'],
  'Systems Programming': ['Systems Programming', 'Rust'],
  'Interview Prep': ['Interview Prep'],
};

export const TOPICS = Object.keys(TOPIC_TAGS);

/** Code-fence language id → display name. Config/markup/diagram fences are deliberately absent. */
const FENCE_LANGUAGES: Record<string, string> = {
  kotlin: 'Kotlin', kt: 'Kotlin', kts: 'Kotlin',
  java: 'Java',
  python: 'Python', py: 'Python',
  typescript: 'TypeScript', ts: 'TypeScript', tsx: 'TypeScript',
  javascript: 'JavaScript', js: 'JavaScript', jsx: 'JavaScript',
  sql: 'SQL',
  swift: 'Swift',
  go: 'Go',
  rust: 'Rust',
};

export const LANGUAGES = [...new Set(Object.values(FENCE_LANGUAGES))];

/** A language needs this many code blocks to count, so a one-off snippet doesn't tag the post. */
const MIN_BLOCKS = 2;

export function getTopics(tags: string[]): string[] {
  return TOPICS.filter(topic => TOPIC_TAGS[topic].some(tag => tags.includes(tag)));
}

export function getLanguages(body: string | undefined): string[] {
  const counts = new Map<string, number>();
  for (const [, id] of (body ?? '').matchAll(/^\s*(?:```|~~~)\s*([\w+#-]+)/gm)) {
    const language = FENCE_LANGUAGES[id.toLowerCase()];
    if (language) counts.set(language, (counts.get(language) ?? 0) + 1);
  }
  return LANGUAGES.filter(language => (counts.get(language) ?? 0) >= MIN_BLOCKS);
}
