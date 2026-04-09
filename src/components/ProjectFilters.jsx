const techStackOptions = ['All', 'React', 'Node.js', 'Python', 'Flutter', 'AI/ML', 'Design'];
const yearOptions = ['All', '2025', '2024', '2023', '2022'];
const domainOptions = ['All', 'Web Dev', 'Mobile', 'AI/ML', 'Design', 'DevOps', 'Other'];
const teamSizeOptions = ['All', 'Solo', '2-4', '5+'];
const sortOptions = [
  { label: 'Latest', value: 'latest' },
  { label: 'Most Liked', value: 'likes' },
  { label: 'Featured', value: 'featured' }
];

const ProjectFilters = ({ filters, onFilterChange }) => {
  const handleTechClick = (tech) => {
    onFilterChange({ ...filters, techStack: tech });
  };

  const handleSortClick = (sort) => {
    onFilterChange({ ...filters, sort });
  };

  return (
    <section className="border-b border-white/[0.05] bg-bg/80 backdrop-blur-xl sticky top-[72px] z-40">
      <div className="section-container py-4">
        {/* Row 1 - Tech Stack */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-sm text-muted mr-2">Tech:</span>
          {techStackOptions.map((tech) => {
            const isActive = filters.techStack === tech;
            return (
              <button
                key={tech}
                onClick={() => handleTechClick(tech)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150"
                style={{
                  background: isActive ? 'rgba(0, 205, 184, 0.15)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(0, 205, 184, 0.6)' : 'rgba(255,255,255,0.1)'}`,
                  color: isActive ? '#00CDB8' : 'rgba(255,255,255,0.7)'
                }}
              >
                {tech}
              </button>
            );
          })}
        </div>

        {/* Row 2 - Dropdowns and Sort */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Year Dropdown */}
            <div className="relative">
              <select
                value={filters.year}
                onChange={(e) => onFilterChange({ ...filters, year: e.target.value })}
                className="appearance-none px-4 py-2 pr-10 rounded-lg text-sm font-medium bg-white/5 border border-white/10 text-white focus:outline-none focus:border-teal/50 cursor-pointer hover:bg-white/[0.08] transition-colors"
              >
                {yearOptions.map(year => (
                  <option key={year} value={year} className="bg-bg text-white">{year === 'All' ? 'Year' : year}</option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Domain Dropdown */}
            <div className="relative">
              <select
                value={filters.domain}
                onChange={(e) => onFilterChange({ ...filters, domain: e.target.value })}
                className="appearance-none px-4 py-2 pr-10 rounded-lg text-sm font-medium bg-white/5 border border-white/10 text-white focus:outline-none focus:border-teal/50 cursor-pointer hover:bg-white/[0.08] transition-colors"
              >
                {domainOptions.map(domain => (
                  <option key={domain} value={domain} className="bg-bg text-white">{domain === 'All' ? 'Domain' : domain}</option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Team Size Dropdown */}
            <div className="relative">
              <select
                value={filters.teamSize}
                onChange={(e) => onFilterChange({ ...filters, teamSize: e.target.value })}
                className="appearance-none px-4 py-2 pr-10 rounded-lg text-sm font-medium bg-white/5 border border-white/10 text-white focus:outline-none focus:border-teal/50 cursor-pointer hover:bg-white/[0.08] transition-colors"
              >
                {teamSizeOptions.map(size => (
                  <option key={size} value={size} className="bg-bg text-white">{size === 'All' ? 'Team Size' : size}</option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Sort Pills */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted mr-1">Sort:</span>
            {sortOptions.map((sort) => {
              const isActive = filters.sort === sort.value;
              return (
                <button
                  key={sort.value}
                  onClick={() => handleSortClick(sort.value)}
                  className="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150"
                  style={{
                    background: isActive ? 'rgba(0, 205, 184, 0.2)' : 'transparent',
                    border: `1px solid ${isActive ? '#00CDB8' : 'rgba(255,255,255,0.1)'}`,
                    color: isActive ? '#00CDB8' : 'rgba(255,255,255,0.6)'
                  }}
                >
                  {sort.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectFilters;
