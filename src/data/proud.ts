// "Things I'm proud of" on the home page. Edit freely; the section renders whatever is here.
//
// `post` is optional: set it to a blog post id (the file name in src/content/blog without
// the extension) to show a "Read how →" link. Leave it out and the link is hidden. An id
// that doesn't match a published post is ignored too, so a typo never ships a dead link.

export interface ProudItem {
  /** Small mono label: the company or product. */
  where: string;
  /** The big number or short headline. */
  headline: string;
  /** One or two sentences on what was at stake. */
  stakes: string;
  /** Blog post id for the "Read how →" link. */
  post?: string;
}

export const proud: ProudItem[] = [
  {
    where: 'VOIS',
    headline: '0 rows lost',
    stakes:
      'Moved 100M+ live records from CockroachDB to PostgreSQL. Built the validation and rollback plan before writing any migration code.',
  },
  {
    where: 'Squadio',
    headline: '98% shared',
    stakes: 'One Kotlin codebase running on both phones and Android TV, so features shipped to both at once.',
  },
  {
    where: 'VOIS',
    headline: '−45% response time',
    stakes: 'Profiled the Spring Boot services, fixed the slow queries, and added caching where it paid off.',
  },
  {
    where: 'Euroleague',
    headline: '−80% bugs',
    stakes: 'Rebuilt the app on MVVM, so fixes stopped breaking other screens.',
  },
  {
    where: 'Doctori',
    headline: '99.9% uptime',
    stakes: 'Video consultations that real doctors and patients relied on.',
  },
  {
    // TODO(Ahmed): replace both placeholders.
    where: 'VOIS',
    headline: 'Mentored [N] engineers',
    stakes: '[one line on impact]',
  },
];
