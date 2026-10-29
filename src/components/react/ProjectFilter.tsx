import { useState } from 'react';

interface Project {
  id: string;
  data: {
    title: string;
    description: string;
    tech: string[];
    github?: string;
    live?: string;
    category: string;
    featured: boolean;
    image: string;
    year?: number;
    status?: string;
    overview?: string;
    features?: string[];
  };
}

interface Props {
  projects: Project[];
}

export default function ProjectFilter({ projects }: Props) {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
  const withBase = (path: string) => (path.startsWith('/') ? `${base}${path.slice(1)}` : path);
  
  // Only offer filters that match at least one project; a single category needs no filter bar.
  const usedCategories = [...new Set(projects.map(p => p.data.category))];
  const categories = ['All', ...usedCategories];
  
  const filteredProjects = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.data.category === activeFilter);

  return (
    <div>
      {/* Filter Buttons */}
      {usedCategories.length > 1 && (
      <div className="flex flex-wrap gap-3 justify-center mb-12">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-6 py-2 rounded-full border transition-all duration-300 ${
              activeFilter === category ? '' : 'bg-[var(--color-bg-secondary)] hover-border-brand-gray-dark'
            }`}
            style={
              activeFilter === category
                ? {
                    backgroundColor: 'var(--color-brand-black)',
                    color: 'var(--color-brand-white)',
                    borderColor: 'var(--color-brand-black)',
                  }
                : {
                    color: 'var(--color-brand-black)',
                    borderColor: 'var(--color-brand-gray-light)',
                  }
            }
          >
            {category}
          </button>
        ))}
      </div>
      )}

      {/* Projects Grid: column count follows the number of projects so the row never has gaps */}
      <div
        className={`grid grid-cols-1 gap-8 mx-auto ${
          filteredProjects.length >= 3
            ? 'md:grid-cols-2 lg:grid-cols-3'
            : filteredProjects.length === 2
              ? 'md:grid-cols-2 max-w-4xl'
              : 'max-w-md'
        }`}
      >
        {filteredProjects.map(project => (
          <div
            key={project.id}
            className="group bg-[var(--color-bg-secondary)] border rounded-xl overflow-hidden card-hover flex flex-col"
            style={{ borderColor: 'var(--color-brand-gray-light)' }}
          >
            {/* Project Image (clickable) */}
            <a
              href={withBase(`/projects/${project.id}`)}
              aria-label={`View ${project.data.title}`}
              className="relative block aspect-video overflow-hidden"
              style={{ backgroundColor: 'var(--color-brand-gray-light)' }}
            >
              <img
                src={withBase(project.data.image)}
                alt={project.data.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                fetchPriority={project.data.featured ? 'high' : 'low'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Category badge */}
              <span
                className="absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full shadow-sm"
                style={{ backgroundColor: 'var(--color-brand-black)', color: 'var(--color-brand-white)' }}
              >
                {project.data.category}
              </span>

              {/* Featured / Year */}
              <span
                className="absolute top-3 right-3 text-xs font-medium px-3 py-1 rounded-full"
                style={{
                  backgroundColor: project.data.featured ? 'var(--color-accent)' : 'var(--color-brand-gray-light)',
                  color: project.data.featured ? '#ffffff' : 'var(--color-brand-gray-dark)',
                }}
              >
                {project.data.year ? project.data.year : (project.data.featured ? 'Featured' : 'Project')}
              </span>
            </a>

            {/* Project Content */}
            <div className="p-6 flex flex-col flex-1">
              {project.data.status && (
                <p
                  className="mb-1 text-xs font-medium uppercase tracking-wide"
                  style={{ color: 'var(--color-accent)' }}
                >
                  {project.data.status}
                </p>
              )}
              <h3
                className="text-xl font-semibold mb-2 transition-colors group-hover:text-brand-orange"
                style={{ color: 'var(--color-text)' }}
              >
                {project.data.title}
              </h3>
              <p
                className="mb-4 text-sm leading-relaxed-custom line-clamp-4"
                style={{ color: 'var(--color-brand-gray-dark)' }}
              >
                {project.data.description}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-5">
                {project.data.tech.slice(0, 4).map((tech: string) => (
                  <span
                    key={tech}
                    className="text-xs px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: 'var(--color-brand-gray-light)',
                      color: 'var(--color-brand-gray-dark)',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex items-center gap-5 border-t pt-4 mt-auto" style={{ borderColor: 'var(--color-brand-gray-light)' }}>
                <a
                  href={withBase(`/projects/${project.id}`)}
                  className="font-medium transition-colors hover:text-brand-orange"
                  style={{ color: 'var(--color-text)' }}
                >
                  View Details →
                </a>
                <span className="flex-1" />
                {project.data.github && (
                  <a
                    href={project.data.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.data.title} on GitHub`}
                    className="text-sm hover-text-brand-orange font-medium"
                    style={{ color: 'var(--color-brand-gray-dark)' }}
                  >
                    GitHub
                  </a>
                )}
                {project.data.live && (
                  <a
                    href={project.data.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.data.title} live demo`}
                    className="text-sm hover-text-brand-orange font-medium"
                    style={{ color: 'var(--color-brand-gray-dark)' }}
                  >
                    Live
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
