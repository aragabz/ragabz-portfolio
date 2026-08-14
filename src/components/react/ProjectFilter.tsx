import { useState } from 'react';

interface Project {
  slug: string;
  data: {
    title: string;
    description: string;
    tech: string[];
    github?: string;
    live?: string;
    category: string;
    featured: boolean;
    image: string;
  };
}

interface Props {
  projects: Project[];
}

export default function ProjectFilter({ projects }: Props) {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  
  const categories = ['All', 'Frontend', 'Backend', 'Full-Stack', 'Open Source'];
  
  const filteredProjects = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.data.category === activeFilter);

  return (
    <div>
      {/* Filter Buttons */}
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <div
            key={project.slug}
            className="bg-[var(--color-bg-secondary)] border rounded-lg overflow-hidden card-hover"
            style={{ borderColor: 'var(--color-brand-gray-light)' }}
          >
            {/* Project Image */}
            <div
              className="aspect-video overflow-hidden"
              style={{ backgroundColor: 'var(--color-brand-gray-light)' }}
            >
              <img
                src={project.data.image}
                alt={project.data.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            </div>
            
            {/* Project Content */}
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{project.data.title}</h3>
              <p
                className="mb-4 text-sm leading-relaxed-custom"
                style={{ color: 'var(--color-brand-gray-dark)' }}
              >
                {project.data.description}
              </p>
              
              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.data.tech.slice(0, 4).map(tech => (
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
              <div className="flex gap-4">
                {project.data.github && (
                  <a
                    href={project.data.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover-text-brand-orange font-medium"
                    style={{ color: 'var(--color-brand-black)' }}
                  >
                    GitHub →
                  </a>
                )}
                {project.data.live && (
                  <a
                    href={project.data.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover-text-brand-orange font-medium"
                    style={{ color: 'var(--color-brand-black)' }}
                  >
                    Live Demo →
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
